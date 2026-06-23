import { asc, count, eq, isNotNull } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getDb } from "@/db";
import {
  productCategories,
  products,
  productSubcategories,
  productTitlePresets,
  type ProductAttributeValue,
} from "@/db/schema";
import {
  uniqueCategorySlug,
} from "@/lib/product-taxonomy";
import { upsertCategoryTemplate, DEFAULT_TEMPLATE_FIELDS } from "@/lib/category-template";
import { z } from "zod";

const createSchema = z.object({
  name: z.string().min(1).max(160),
});

function normalizeText(value: string) {
  return value.trim().replace(/\s+/g, " ").toLowerCase();
}

function normalizeAttributeValue(value: ProductAttributeValue | undefined) {
  if (!value) return "";
  if (typeof value === "string") return normalizeText(value);
  return normalizeText(`${value.value ?? ""} ${value.unit ?? ""}`);
}

function attributesMatch(
  productAttributes: Record<string, ProductAttributeValue>,
  presetAttributes: Record<string, ProductAttributeValue>
) {
  const presetEntries = Object.entries(presetAttributes).filter(([, value]) =>
    Boolean(normalizeAttributeValue(value))
  );
  if (!presetEntries.length) return false;

  return presetEntries.every(([key, presetValue]) => {
    const productValue = normalizeAttributeValue(productAttributes[key]);
    const normalizedPresetValue = normalizeAttributeValue(presetValue);
    return (
      Boolean(productValue) &&
      (productValue === normalizedPresetValue ||
        productValue.includes(normalizedPresetValue) ||
        normalizedPresetValue.includes(productValue))
    );
  });
}

export async function GET() {
  const db = getDb();
  if (!db)
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });

  const [cats, subs, presetCounts, presetRows, linkedPresetRows, productRows] = await Promise.all([
    db
      .select()
      .from(productCategories)
      .orderBy(asc(productCategories.sortOrder), asc(productCategories.name)),
    db
      .select()
      .from(productSubcategories)
      .orderBy(asc(productSubcategories.sortOrder), asc(productSubcategories.name)),
    db
      .select({
        categoryId: productTitlePresets.categoryId,
        presetCount: count(),
      })
      .from(productTitlePresets)
      .groupBy(productTitlePresets.categoryId),
    db
      .select({
        id: productTitlePresets.id,
        categoryId: productTitlePresets.categoryId,
        title: productTitlePresets.title,
        sourceLabel: productTitlePresets.sourceLabel,
        attributes: productTitlePresets.attributes,
      })
      .from(productTitlePresets),
    db
      .selectDistinct({
        categoryId: products.categoryId,
        presetId: products.productTitlePresetId,
      })
      .from(products)
      .where(isNotNull(products.productTitlePresetId)),
    db
      .select({
        categoryId: products.categoryId,
        title: products.title,
        productTitlePresetId: products.productTitlePresetId,
        attributes: products.attributes,
      })
      .from(products),
  ]);

  const subcategoriesByCategory = new Map<string, typeof subs>();
  for (const subcategory of subs) {
    const current = subcategoriesByCategory.get(subcategory.categoryId) ?? [];
    current.push(subcategory);
    subcategoriesByCategory.set(subcategory.categoryId, current);
  }

  const presetCountByCategory = new Map(
    presetCounts.map((row) => [row.categoryId, row.presetCount])
  );
  const presetsByCategory = new Map<string, typeof presetRows>();
  for (const preset of presetRows) {
    const current = presetsByCategory.get(preset.categoryId) ?? [];
    current.push(preset);
    presetsByCategory.set(preset.categoryId, current);
  }

  const createdPresetIdsByCategory = new Map<string, Set<string>>();
  for (const row of linkedPresetRows) {
    if (!row.categoryId || !row.presetId) continue;
    const current = createdPresetIdsByCategory.get(row.categoryId) ?? new Set<string>();
    current.add(row.presetId);
    createdPresetIdsByCategory.set(row.categoryId, current);
  }
  for (const product of productRows) {
    if (!product.categoryId || product.productTitlePresetId) continue;
    const categoryPresets = presetsByCategory.get(product.categoryId) ?? [];
    const normalizedTitle = normalizeText(product.title);
    const matches = categoryPresets.filter(
      (preset) =>
        normalizeText(preset.title) === normalizedTitle ||
        normalizeText(preset.sourceLabel) === normalizedTitle
    );
    const attributeMatches =
      matches.length > 1
        ? matches.filter((preset) =>
            attributesMatch(
              product.attributes as Record<string, ProductAttributeValue>,
              preset.attributes
            )
          )
        : matches;
    if (attributeMatches.length !== 1) continue;
    const current = createdPresetIdsByCategory.get(product.categoryId) ?? new Set<string>();
    current.add(attributeMatches[0].id);
    createdPresetIdsByCategory.set(product.categoryId, current);
  }

  const categories = cats.map((c) => ({
    ...c,
    subcategories: subcategoriesByCategory.get(c.id) ?? [],
    presetCount: presetCountByCategory.get(c.id) ?? 0,
    createdPresetCount: createdPresetIdsByCategory.get(c.id)?.size ?? 0,
  }));

  return NextResponse.json({ categories });
}

export async function POST(request: Request) {
  const db = getDb();
  if (!db)
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const name = parsed.data.name.trim();
  const slug = await uniqueCategorySlug(db, name);

  const [row] = await db
    .insert(productCategories)
    .values({ name, slug })
    .returning();

  await upsertCategoryTemplate(db, row.id, null, DEFAULT_TEMPLATE_FIELDS);

  return NextResponse.json(row, { status: 201 });
}

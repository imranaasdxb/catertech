import { and, count, desc, eq, like, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getDb } from "@/db";
import {
  products,
  productTitlePresets,
  type ProductAttributeValue,
} from "@/db/schema";
import {
  buildCategoryDisplayLabel,
  validateSubcategoryForCategory,
} from "@/lib/product-taxonomy";
import { generateProductSeo } from "@/lib/product-seo";
import { buildProductIdPrefix, reserveProductId } from "@/lib/product-id";
import { slugify } from "@/lib/slug";
import { z } from "zod";

const createSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  categoryId: z.union([z.string().uuid(), z.null()]).optional(),
  subCategoryId: z.union([z.string().uuid(), z.null()]).optional(),
  images: z.array(z.string()).optional(),
  isAvailable: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  published: z.boolean().optional(),
  attributes: z.record(z.string(), z.unknown()).optional(),
  seoTitle: z.string().trim().max(80).optional(),
  seoDescription: z.string().trim().max(180).optional(),
  searchKeywords: z.array(z.string().trim().min(1).max(80)).optional(),
  canonicalProductId: z.union([z.string().uuid(), z.null()]).optional(),
  productTitlePresetId: z.union([z.string().uuid(), z.null()]).optional(),
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

  const rows = await db
    .select()
    .from(products)
    .orderBy(desc(products.updatedAt));

  return NextResponse.json(rows);
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

  const d = parsed.data;
  const catId = d.categoryId === undefined ? null : d.categoryId;
  let subId = d.subCategoryId === undefined ? null : d.subCategoryId;

  const subCheck = await validateSubcategoryForCategory(db, catId, subId);
  if (!subCheck.ok) {
    return NextResponse.json({ error: subCheck.message }, { status: 400 });
  }
  if (!catId) subId = null;
  const attributes = (d.attributes ?? {}) as Record<string, ProductAttributeValue>;

  let productTitlePresetId = d.productTitlePresetId ?? null;
  if (!productTitlePresetId && catId) {
    const matchingPresets = await db
      .select({
        id: productTitlePresets.id,
        subCategoryId: productTitlePresets.subCategoryId,
        attributes: productTitlePresets.attributes,
      })
      .from(productTitlePresets)
      .where(
        and(
          eq(productTitlePresets.categoryId, catId),
          sql`(
            lower(trim(${productTitlePresets.title})) = ${d.title.trim().toLowerCase()}
            or lower(trim(${productTitlePresets.sourceLabel})) = ${d.title.trim().toLowerCase()}
          )`
        )
      )
      .limit(2);

    const sameSubcategoryPresets = matchingPresets.filter(
      (matchingPreset) => matchingPreset.subCategoryId === subId
    );
    const attributeMatches =
      sameSubcategoryPresets.length > 1
        ? sameSubcategoryPresets.filter((matchingPreset) =>
            attributesMatch(attributes, matchingPreset.attributes)
          )
        : sameSubcategoryPresets;
    const [matchingPreset] = attributeMatches;
    if (attributeMatches.length === 1 && matchingPreset) {
      productTitlePresetId = matchingPreset.id;
    }
  }

  if (productTitlePresetId) {
    const [preset] = await db
      .select({
        id: productTitlePresets.id,
        categoryId: productTitlePresets.categoryId,
        subCategoryId: productTitlePresets.subCategoryId,
      })
      .from(productTitlePresets)
      .where(eq(productTitlePresets.id, productTitlePresetId))
      .limit(1);

    if (
      !preset ||
      !catId ||
      preset.categoryId !== catId ||
      preset.subCategoryId !== subId
    ) {
      return NextResponse.json(
        { error: "Selected title preset does not belong to this category selection." },
        { status: 400 }
      );
    }
  }

  const categoryLabel = await buildCategoryDisplayLabel(db, catId, subId);
  let productIdPrefix: string;
  try {
    productIdPrefix = buildProductIdPrefix(categoryLabel ?? "", d.title);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unsupported product category" },
      { status: 400 }
    );
  }
  const generatedSeo = generateProductSeo({
    title: d.title,
    categoryName: categoryLabel?.split("›")[0]?.trim() ?? null,
    subCategoryName: categoryLabel?.split("›")[1]?.trim() ?? null,
    description: d.description,
    attributes,
  });

  const base = slugify(d.title);
  let slug = base;
  let n = 0;
  while (n < 20) {
    const clash = await db
      .select({ id: products.id })
      .from(products)
      .where(eq(products.slug, slug))
      .limit(1);
    if (!clash.length) break;
    n += 1;
    slug = `${base}-${n}`;
  }

  const row = await reserveProductId(
    productIdPrefix,
    async () => {
      const existing = await db
        .select({ productId: products.productId })
        .from(products)
        .where(like(products.productId, `${productIdPrefix}-%`));
      return existing.map(({ productId }) => productId);
    },
    async (productId) => {
      const [created] = await db
        .insert(products)
        .values({
          productId,
          title: d.title,
          slug,
          description: d.description ?? null,
          category: categoryLabel,
          categoryId: catId,
          subCategoryId: subId,
          productTitlePresetId,
          images: d.images ?? [],
          isAvailable: d.isAvailable ?? true,
          isFeatured: d.isFeatured ?? false,
          published: d.published ?? false,
          attributes,
          seoTitle: d.seoTitle || generatedSeo.seoTitle,
          seoDescription: d.seoDescription || generatedSeo.seoDescription,
          searchKeywords: d.searchKeywords?.length
            ? d.searchKeywords
            : generatedSeo.searchKeywords,
          canonicalProductId: d.canonicalProductId ?? null,
        })
        .returning({
          id: products.id,
          productId: products.productId,
          slug: products.slug,
        });
      return created;
    }
  );

  let presetProgressIncremented = false;
  if (productTitlePresetId) {
    const [{ linkedProductCount }] = await db
      .select({ linkedProductCount: count() })
      .from(products)
      .where(eq(products.productTitlePresetId, productTitlePresetId));
    presetProgressIncremented = linkedProductCount === 1;
  }

  return NextResponse.json({ ...row, presetProgressIncremented }, { status: 201 });
}

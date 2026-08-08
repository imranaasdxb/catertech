import { desc, eq, like } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getDb } from "@/db";
import {
  products,
  productTitlePresets,
  type ProductAttributeValue,
} from "@/db/schema";
import { cleanPresetProductTitle } from "@/lib/catalog/canonical-catalog";
import {
  buildCategoryDisplayLabel,
  validateSubcategoryForCategory,
} from "@/lib/product-taxonomy";
import { generateProductSeo } from "@/lib/product-seo";
import { buildProductIdPrefix, reserveProductId } from "@/lib/product-id";
import { normalizePricePerDayAed } from "@/lib/product-pricing";
import { resolveProductPresetMatch } from "@/lib/product-preset-match";
import { slugify } from "@/lib/slug";
import { z } from "zod";

const createSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  pricePerDayAed: z.union([z.string().max(40), z.null()]).optional(),
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

function hasSavedAttributes(attributes: Record<string, ProductAttributeValue>) {
  return Object.values(attributes).some((value) => {
    if (!value) return false;
    if (typeof value === "string") return Boolean(value.trim());
    return Boolean(value.value?.trim() || value.unit?.trim());
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
  let pricePerDayAed = normalizePricePerDayAed(d.pricePerDayAed ?? "");
  const catId = d.categoryId === undefined ? null : d.categoryId;
  let subId = d.subCategoryId === undefined ? null : d.subCategoryId;
  if (!catId) subId = null;
  const attributes = (d.attributes ?? {}) as Record<string, ProductAttributeValue>;

  let productTitlePresetId = d.productTitlePresetId ?? null;
  if (!productTitlePresetId && catId) {
    const categoryPresets = await db
      .select({
        id: productTitlePresets.id,
        title: productTitlePresets.title,
        sourceLabel: productTitlePresets.sourceLabel,
        subCategoryId: productTitlePresets.subCategoryId,
        attributes: productTitlePresets.attributes,
        pricePerDayAed: productTitlePresets.pricePerDayAed,
      })
      .from(productTitlePresets)
      .where(eq(productTitlePresets.categoryId, catId));

    const match = resolveProductPresetMatch(
      {
        title: d.title,
        productTitlePresetId: null,
        attributes,
        subCategoryId: subId,
      },
      categoryPresets.map((preset) => ({
        ...preset,
        attributes: preset.attributes as Record<string, ProductAttributeValue>,
      }))
    );
    if (match) productTitlePresetId = match.id;
  }

  let presetAttributes: Record<string, ProductAttributeValue> | null = null;
  let presetPricePerDayAed: string | null = null;

  if (productTitlePresetId) {
    const [preset] = await db
      .select({
        id: productTitlePresets.id,
        categoryId: productTitlePresets.categoryId,
        subCategoryId: productTitlePresets.subCategoryId,
        attributes: productTitlePresets.attributes,
        pricePerDayAed: productTitlePresets.pricePerDayAed,
      })
      .from(productTitlePresets)
      .where(eq(productTitlePresets.id, productTitlePresetId))
      .limit(1);

    if (!preset || !catId || preset.categoryId !== catId) {
      return NextResponse.json(
        { error: "Selected title preset does not belong to this category selection." },
        { status: 400 }
      );
    }

    if (!subId && preset.subCategoryId) {
      subId = preset.subCategoryId;
    }

    if (subId && preset.subCategoryId && preset.subCategoryId !== subId) {
      return NextResponse.json(
        { error: "Selected title preset does not belong to this sub-category selection." },
        { status: 400 }
      );
    }

    presetAttributes = preset.attributes as Record<string, ProductAttributeValue>;
    presetPricePerDayAed = preset.pricePerDayAed;
  }

  if (!pricePerDayAed && presetPricePerDayAed) {
    pricePerDayAed = presetPricePerDayAed;
  }

  const subCheck = await validateSubcategoryForCategory(db, catId, subId);
  if (!subCheck.ok) {
    return NextResponse.json({ error: subCheck.message }, { status: 400 });
  }

  if (!productTitlePresetId && catId) {
    const [createdPreset] = await db
      .insert(productTitlePresets)
      .values({
        categoryId: catId,
        subCategoryId: subId,
        title: cleanPresetProductTitle(d.title),
        sourceLabel: d.title,
        pricePerDayAed,
        attributes,
      })
      .returning({ id: productTitlePresets.id });

    productTitlePresetId = createdPreset.id;
  } else if (
    productTitlePresetId &&
    ((presetAttributes &&
      !hasSavedAttributes(presetAttributes) &&
      hasSavedAttributes(attributes)) ||
      (pricePerDayAed && !presetPricePerDayAed))
  ) {
    await db
      .update(productTitlePresets)
      .set({
        ...(presetAttributes &&
        !hasSavedAttributes(presetAttributes) &&
        hasSavedAttributes(attributes)
          ? { attributes }
          : {}),
        ...(pricePerDayAed && !presetPricePerDayAed ? { pricePerDayAed } : {}),
        updatedAt: new Date(),
      })
      .where(eq(productTitlePresets.id, productTitlePresetId));
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
          pricePerDayAed,
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
  if (catId) {
    presetProgressIncremented = true;
  }

  return NextResponse.json({ ...row, presetProgressIncremented }, { status: 201 });
}

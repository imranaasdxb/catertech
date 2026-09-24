import { and, asc, count, desc, eq, ilike, isNull, like, or } from "drizzle-orm";
import { productSearchText } from "@/db/product-search";
import { searchQuerySchema } from "@/lib/search-query-schema";
import { escapeSearchPattern } from "@/lib/search";
import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { isAdminSession } from "@/lib/auth-user";
import {
  products,
  productTitlePresets,
  type ProductAttributeValue,
} from "@/db/schema";
import { cleanPresetProductTitle } from "@/lib/product-catalog/canonical-catalog";
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

const listQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(10),
  categoryId: z.string().uuid().optional(),
  search: searchQuerySchema,
  missingPrice: z
    .preprocess((value) => value === "true" || value === "1", z.boolean())
    .default(false),
  sort: z.enum(["default", "a-z"]).default("default"),
});

function hasSavedAttributes(attributes: Record<string, ProductAttributeValue>) {
  return Object.values(attributes).some((value) => {
    if (!value) return false;
    if (typeof value === "string") return Boolean(value.trim());
    return Boolean(value.value?.trim() || value.unit?.trim());
  });
}

export async function GET(request: Request) {
  if (!(await isAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getDb();
  if (!db)
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });

  const url = new URL(request.url);
  const parsed = listQuerySchema.safeParse({
    page: url.searchParams.get("page") || undefined,
    pageSize: url.searchParams.get("pageSize") || undefined,
    categoryId: url.searchParams.get("categoryId") || undefined,
    search: url.searchParams.get("search") || undefined,
    missingPrice: url.searchParams.get("missingPrice") || undefined,
    sort: url.searchParams.get("sort") || undefined,
  });

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { page, pageSize, categoryId, search, missingPrice, sort } = parsed.data;
  const where = and(
    categoryId ? eq(products.categoryId, categoryId) : undefined,
    missingPrice ? or(isNull(products.pricePerDayAed), eq(products.pricePerDayAed, "")) : undefined,
    search ? ilike(productSearchText(products), escapeSearchPattern(search)) : undefined
  );

  const rowsQuery = db
    .select()
    .from(products)
    .where(where)
    .orderBy(...(sort === "a-z" ? [asc(products.title), asc(products.id)] : [desc(products.updatedAt), asc(products.id)]))
    .limit(pageSize)
    .offset((page - 1) * pageSize);

  const totalQuery = db.select({ total: count() }).from(products).where(where);
  const [rows, [{ total }]] = await Promise.all([rowsQuery, totalQuery]);

  return NextResponse.json({
    products: rows.map((r) => ({
      id: r.id,
      title: r.title,
      slug: r.slug,
      pricePerDayAed: r.pricePerDayAed,
      category: r.category ?? null,
      categoryId: r.categoryId ?? null,
      galleryCount: r.images?.filter(Boolean).length ?? 0,
      published: r.published,
      isFeatured: r.isFeatured,
      isAvailable: r.isAvailable,
      attributes: r.attributes,
      updatedAt: r.updatedAt,
      thumbUrl: r.images?.[0] ?? null,
      detail: r,
    })),
    pagination: {
      page,
      pageSize,
      total,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
    },
  });
}

export async function POST(request: Request) {
  if (!(await isAdminSession())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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

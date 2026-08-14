import { and, asc, count, eq, ilike, or, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getDb } from "@/db";
import {
  productCategories,
  products,
  productSubcategories,
  productTitlePresets,
  type ProductAttributeValue,
} from "@/db/schema";
import { cleanPresetProductTitle } from "@/lib/product-catalog/canonical-catalog";
import {
  categoryLabelMatches,
  collectCreatedPresetIds,
  normalizeMatchText,
  resolveProductPresetMatch,
} from "@/lib/product-preset-match";
import { normalizePricePerDayAed } from "@/lib/product-pricing";
import { z } from "zod";

const querySchema = z.object({
  categoryId: z.string().uuid(),
  subCategoryId: z.string().uuid().optional(),
});

const manageQuerySchema = z.object({
  categoryId: z.string().uuid().optional(),
  subCategoryId: z.string().uuid().optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(20),
  search: z.string().trim().max(160).default(""),
});

const createSchema = z.object({
  title: z.string().trim().min(1).max(240),
  categoryId: z.string().uuid(),
  subCategoryId: z.string().uuid().nullable().optional(),
  pricePerDayAed: z.union([z.string().max(40), z.null()]).optional(),
});

export async function GET(request: Request) {
  const db = getDb();
  if (!db) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  const url = new URL(request.url);
  if (url.searchParams.get("mode") === "manage") {
    const parsed = manageQuerySchema.safeParse({
      categoryId: url.searchParams.get("categoryId") || undefined,
      subCategoryId: url.searchParams.get("subCategoryId") || undefined,
      page: url.searchParams.get("page") || undefined,
      pageSize: url.searchParams.get("pageSize") || undefined,
      search: url.searchParams.get("search") || undefined,
    });

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const { categoryId, subCategoryId, page, pageSize, search } = parsed.data;
    const searchFilter = search
      ? or(
          ilike(productTitlePresets.title, `%${search}%`),
          ilike(productTitlePresets.sourceLabel, `%${search}%`)
        )
      : undefined;
    const where = and(
      categoryId ? eq(productTitlePresets.categoryId, categoryId) : undefined,
      subCategoryId ? eq(productTitlePresets.subCategoryId, subCategoryId) : undefined,
      searchFilter
    );

    const [rows, [{ total }], categoryCounts] = await Promise.all([
      db
        .select({
          id: productTitlePresets.id,
          categoryId: productTitlePresets.categoryId,
          subCategoryId: productTitlePresets.subCategoryId,
          title: productTitlePresets.title,
          sourceLabel: productTitlePresets.sourceLabel,
          pricePerDayAed: productTitlePresets.pricePerDayAed,
          attributes: productTitlePresets.attributes,
          categoryName: productCategories.name,
          subCategoryName: productSubcategories.name,
        })
        .from(productTitlePresets)
        .innerJoin(productCategories, eq(productTitlePresets.categoryId, productCategories.id))
        .leftJoin(
          productSubcategories,
          eq(productTitlePresets.subCategoryId, productSubcategories.id)
        )
        .where(where)
        .orderBy(asc(productCategories.sortOrder), asc(productTitlePresets.sortOrder))
        .limit(pageSize)
        .offset((page - 1) * pageSize),
      db.select({ total: count() }).from(productTitlePresets).where(where),
      db
        .select({
          categoryId: productCategories.id,
          categoryName: productCategories.name,
          count: count(productTitlePresets.id),
        })
        .from(productCategories)
        .leftJoin(
          productTitlePresets,
          eq(productCategories.id, productTitlePresets.categoryId)
        )
        .groupBy(
          productCategories.id,
          productCategories.name,
          productCategories.sortOrder
        )
        .orderBy(asc(productCategories.sortOrder), asc(productCategories.name)),
    ]);

    return NextResponse.json({
      presets: rows,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.max(1, Math.ceil(total / pageSize)),
      },
      categoryCounts,
    });
  }

  const parsed = querySchema.safeParse({
    categoryId: url.searchParams.get("categoryId"),
    subCategoryId: url.searchParams.get("subCategoryId") || undefined,
  });

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { categoryId, subCategoryId } = parsed.data;
  const [category] = await db
    .select({ name: productCategories.name })
    .from(productCategories)
    .where(eq(productCategories.id, categoryId))
    .limit(1);

  if (!category) {
    return NextResponse.json(
      { presets: [] },
      { headers: { "Cache-Control": "no-store" } }
    );
  }

  const [rows, categoryProductRows] = await Promise.all([
    db
      .select({
        id: productTitlePresets.id,
        title: productTitlePresets.title,
        sourceLabel: productTitlePresets.sourceLabel,
        pricePerDayAed: productTitlePresets.pricePerDayAed,
        attributes: productTitlePresets.attributes,
        subCategoryId: productTitlePresets.subCategoryId,
      })
      .from(productTitlePresets)
      .where(
        subCategoryId
          ? and(
              eq(productTitlePresets.categoryId, categoryId),
              eq(productTitlePresets.subCategoryId, subCategoryId)
            )
          : eq(productTitlePresets.categoryId, categoryId)
      )
      .orderBy(asc(productTitlePresets.sortOrder), asc(productTitlePresets.sourceLabel)),
    db
      .select({
        id: products.id,
        title: products.title,
        category: products.category,
        categoryId: products.categoryId,
        productTitlePresetId: products.productTitlePresetId,
        attributes: products.attributes,
        subCategoryId: products.subCategoryId,
      })
      .from(products)
      .where(
        or(
          eq(products.categoryId, categoryId),
          ilike(products.category, `${category.name}%`)
        )
      ),
  ]);

  const categoryProducts = categoryProductRows.filter(
    (product) =>
      product.categoryId === categoryId ||
      categoryLabelMatches(product.category, category.name)
  );

  const productInputs = categoryProducts.map((product) => ({
    title: product.title,
    productTitlePresetId: product.productTitlePresetId,
    attributes: product.attributes as Record<string, ProductAttributeValue>,
    subCategoryId: product.subCategoryId,
  }));

  const presetRows = rows.map((row) => ({
    ...row,
    attributes: row.attributes as Record<string, ProductAttributeValue>,
  }));

  const createdPresetIds = collectCreatedPresetIds(productInputs, presetRows);

  const presetProductById = new Map<string, { id: string; title: string }>();
  for (const product of categoryProducts) {
    const match = resolveProductPresetMatch(
      {
        title: product.title,
        productTitlePresetId: product.productTitlePresetId,
        attributes: product.attributes as Record<string, ProductAttributeValue>,
        subCategoryId: product.subCategoryId,
      },
      presetRows
    );
    if (!match) continue;
    presetProductById.set(match.id, { id: product.id, title: product.title });
  }

  const presets = rows.map((row) => {
    const linkedProduct = presetProductById.get(row.id);
    return {
      ...row,
      created: createdPresetIds.has(row.id),
      productId: linkedProduct?.id ?? null,
      productTitle: linkedProduct?.title ?? null,
    };
  });

  return NextResponse.json(
    { presets },
    { headers: { "Cache-Control": "no-store" } }
  );
}

export async function POST(request: Request) {
  const db = getDb();
  if (!db) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

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

  const title = parsed.data.title.trim();
  const subCategoryId = parsed.data.subCategoryId || null;
  const pricePerDayAed = normalizePricePerDayAed(parsed.data.pricePerDayAed ?? "");

  const [category] = await db
    .select({ id: productCategories.id })
    .from(productCategories)
    .where(eq(productCategories.id, parsed.data.categoryId))
    .limit(1);

  if (!category) {
    return NextResponse.json({ error: "Category not found" }, { status: 404 });
  }

  if (subCategoryId) {
    const [subCategory] = await db
      .select({ id: productSubcategories.id })
      .from(productSubcategories)
      .where(
        and(
          eq(productSubcategories.id, subCategoryId),
          eq(productSubcategories.categoryId, parsed.data.categoryId)
        )
      )
      .limit(1);

    if (!subCategory) {
      return NextResponse.json({ error: "Sub-category not found" }, { status: 404 });
    }
  }

  const normalizedTitle = normalizeMatchText(title);
  const cleanedTitle = normalizeMatchText(cleanPresetProductTitle(title));

  const [existing] = await db
    .select({
      id: productTitlePresets.id,
      title: productTitlePresets.title,
      sourceLabel: productTitlePresets.sourceLabel,
      pricePerDayAed: productTitlePresets.pricePerDayAed,
      attributes: productTitlePresets.attributes,
      created: sql<boolean>`exists (
        select 1
        from ${products}
        where ${products.productTitlePresetId} = ${productTitlePresets.id}
      )`,
    })
    .from(productTitlePresets)
    .where(
      and(
        eq(productTitlePresets.categoryId, parsed.data.categoryId),
        subCategoryId
          ? eq(productTitlePresets.subCategoryId, subCategoryId)
          : sql`${productTitlePresets.subCategoryId} is null`,
        sql`(
          lower(trim(${productTitlePresets.sourceLabel})) = ${normalizedTitle}
          or lower(trim(${productTitlePresets.title})) = ${normalizedTitle}
          or lower(trim(${productTitlePresets.sourceLabel})) = ${cleanedTitle}
          or lower(trim(${productTitlePresets.title})) = ${cleanedTitle}
        )`
      )
    )
    .limit(1);

  if (existing) {
    return NextResponse.json({ preset: existing, existed: true });
  }

  const [created] = await db
    .insert(productTitlePresets)
    .values({
      categoryId: parsed.data.categoryId,
      subCategoryId,
      title: cleanPresetProductTitle(title),
      sourceLabel: title,
      pricePerDayAed,
      attributes: {},
    })
    .returning({
      id: productTitlePresets.id,
      title: productTitlePresets.title,
      sourceLabel: productTitlePresets.sourceLabel,
      pricePerDayAed: productTitlePresets.pricePerDayAed,
      attributes: productTitlePresets.attributes,
    });

  return NextResponse.json(
    { preset: { ...created, created: false }, existed: false },
    { status: 201 }
  );
}

import { and, asc, count, eq, ilike, or, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getDb } from "@/db";
import {
  productCategories,
  products,
  productSubcategories,
  productTitlePresets,
} from "@/db/schema";
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
  const rows = await db
    .select({
      id: productTitlePresets.id,
      title: productTitlePresets.title,
      sourceLabel: productTitlePresets.sourceLabel,
      attributes: productTitlePresets.attributes,
      created: sql<boolean>`exists (
        select 1
        from ${products}
        where ${products.productTitlePresetId} = ${productTitlePresets.id}
      )`,
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
    .orderBy(asc(productTitlePresets.sortOrder), asc(productTitlePresets.sourceLabel));

  return NextResponse.json({ presets: rows });
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

  const [existing] = await db
    .select({
      id: productTitlePresets.id,
      title: productTitlePresets.title,
      sourceLabel: productTitlePresets.sourceLabel,
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
        eq(productTitlePresets.sourceLabel, title)
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
      title,
      sourceLabel: title,
      attributes: {},
    })
    .returning({
      id: productTitlePresets.id,
      title: productTitlePresets.title,
      sourceLabel: productTitlePresets.sourceLabel,
      attributes: productTitlePresets.attributes,
    });

  return NextResponse.json(
    { preset: { ...created, created: false }, existed: false },
    { status: 201 }
  );
}

import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { products, type ProductAttributeValue } from "@/db/schema";
import {
  buildCategoryDisplayLabel,
  validateSubcategoryForCategory,
} from "@/lib/product-taxonomy";
import { generateProductSeo } from "@/lib/product-seo";
import { slugify } from "@/lib/slug";
import { z } from "zod";

const updateSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().nullable().optional(),
  categoryId: z.union([z.string().uuid(), z.null()]).optional(),
  subCategoryId: z.union([z.string().uuid(), z.null()]).optional(),
  images: z.array(z.string()).optional(),
  isAvailable: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  published: z.boolean().optional(),
  attributes: z.record(z.string(), z.unknown()).optional(),
  seoTitle: z.string().trim().max(80).nullable().optional(),
  seoDescription: z.string().trim().max(180).nullable().optional(),
  searchKeywords: z.array(z.string().trim().min(1).max(80)).optional(),
  canonicalProductId: z.union([z.string().uuid(), z.null()]).optional(),
});

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  const db = getDb();
  if (!db)
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });

  const [row] = await db
    .select()
    .from(products)
    .where(eq(products.id, id))
    .limit(1);

  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(row);
}

export async function PUT(
  request: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  const db = getDb();
  if (!db)
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const d = parsed.data;

  const [row] = await db.select().from(products).where(eq(products.id, id));
  if (!row) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const nextCat =
    d.categoryId !== undefined ? d.categoryId : row.categoryId ?? null;
  let nextSub =
    d.subCategoryId !== undefined ? d.subCategoryId : row.subCategoryId ?? null;

  if (
    d.categoryId !== undefined &&
    d.categoryId !== row.categoryId &&
    d.subCategoryId === undefined
  ) {
    nextSub = null;
  }

  if (!nextCat) nextSub = null;

  const subCheck = await validateSubcategoryForCategory(db, nextCat, nextSub);
  if (!subCheck.ok) {
    return NextResponse.json({ error: subCheck.message }, { status: 400 });
  }

  const categoryLabelRaw = await buildCategoryDisplayLabel(db, nextCat, nextSub);
  const categoryLabel =
    categoryLabelRaw === null &&
    nextCat === null &&
    nextSub === null &&
    row.categoryId === null &&
    row.subCategoryId === null
      ? row.category
      : categoryLabelRaw;

  const title = d.title ?? row.title;
  const presetLinkageChanged =
    (d.title !== undefined && d.title !== row.title) ||
    (d.categoryId !== undefined && d.categoryId !== row.categoryId) ||
    (d.subCategoryId !== undefined && d.subCategoryId !== row.subCategoryId);
  const productTitlePresetId =
    presetLinkageChanged ? null : row.productTitlePresetId;
  const nextSlug =
    d.title !== undefined ? slugify(d.title) : row.slug;
  const nextAttributes =
    d.attributes !== undefined
      ? (d.attributes as Record<string, ProductAttributeValue>)
      : row.attributes;
  const generatedSeo = generateProductSeo({
    title,
    categoryName: categoryLabel?.split("›")[0]?.trim() ?? null,
    subCategoryName: categoryLabel?.split("›")[1]?.trim() ?? null,
    description:
      d.description !== undefined ? d.description : row.description,
    attributes: nextAttributes,
  });

  const [updated] = await db
    .update(products)
    .set({
      title,
      slug: nextSlug,
      description:
        d.description !== undefined ? d.description : row.description,
      category: categoryLabel,
      categoryId: nextCat,
      subCategoryId: nextSub,
      productTitlePresetId,
      images: d.images !== undefined ? d.images : row.images,
      isAvailable: d.isAvailable ?? row.isAvailable,
      isFeatured: d.isFeatured ?? row.isFeatured,
      published: d.published ?? row.published,
      attributes: nextAttributes,
      seoTitle:
        d.seoTitle !== undefined ? d.seoTitle || generatedSeo.seoTitle : row.seoTitle,
      seoDescription:
        d.seoDescription !== undefined
          ? d.seoDescription || generatedSeo.seoDescription
          : row.seoDescription,
      searchKeywords:
        d.searchKeywords !== undefined
          ? d.searchKeywords.length
            ? d.searchKeywords
            : generatedSeo.searchKeywords
          : row.searchKeywords,
      canonicalProductId:
        d.canonicalProductId !== undefined ? d.canonicalProductId : row.canonicalProductId,
      updatedAt: new Date(),
    })
    .where(eq(products.id, id))
    .returning();

  return NextResponse.json(updated);
}

export async function DELETE(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  const db = getDb();
  if (!db)
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });

  const deleted = await db
    .delete(products)
    .where(eq(products.id, id))
    .returning({ id: products.id });

  if (!deleted.length)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}

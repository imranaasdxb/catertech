import { desc, eq } from "drizzle-orm";
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
});

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

  const categoryLabel = await buildCategoryDisplayLabel(db, catId, subId);
  const attributes = (d.attributes ?? {}) as Record<string, ProductAttributeValue>;
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

  const [row] = await db
    .insert(products)
    .values({
      title: d.title,
      slug,
      description: d.description ?? null,
      category: categoryLabel,
      categoryId: catId,
      subCategoryId: subId,
      images: d.images ?? [],
      isAvailable: d.isAvailable ?? true,
      isFeatured: d.isFeatured ?? false,
      published: d.published ?? false,
      attributes,
      seoTitle: d.seoTitle || generatedSeo.seoTitle,
      seoDescription: d.seoDescription || generatedSeo.seoDescription,
      searchKeywords: d.searchKeywords?.length ? d.searchKeywords : generatedSeo.searchKeywords,
      canonicalProductId: d.canonicalProductId ?? null,
    })
    .returning();

  return NextResponse.json(row, { status: 201 });
}

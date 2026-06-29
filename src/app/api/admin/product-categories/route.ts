import { asc, count, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getDb } from "@/db";
import {
  productCategories,
  products,
  productSubcategories,
  productTitlePresets,
} from "@/db/schema";
import {
  uniqueCategorySlug,
} from "@/lib/product-taxonomy";
import { upsertCategoryTemplate, DEFAULT_TEMPLATE_FIELDS } from "@/lib/category-template";
import { z } from "zod";

const createSchema = z.object({
  name: z.string().min(1).max(160),
});

export async function GET() {
  const db = getDb();
  if (!db)
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });

  const [cats, subs, presetCounts, productRows] = await Promise.all([
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
        categoryId: products.categoryId,
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
  const productCountByCategory = new Map<string, number>();
  for (const product of productRows) {
    if (!product.categoryId) continue;
    productCountByCategory.set(
      product.categoryId,
      (productCountByCategory.get(product.categoryId) ?? 0) + 1
    );
  }

  const categories = cats.map((c) => ({
    ...c,
    subcategories: subcategoriesByCategory.get(c.id) ?? [],
    presetCount: presetCountByCategory.get(c.id) ?? 0,
    createdPresetCount: productCountByCategory.get(c.id) ?? 0,
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

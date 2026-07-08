import { asc } from "drizzle-orm";
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
  categoryLabelMatches,
} from "@/lib/product-preset-match";
import {
  uniqueCategorySlug,
} from "@/lib/product-taxonomy";
import { z } from "zod";

const createSchema = z.object({
  name: z.string().min(1).max(160),
});

export async function GET() {
  const db = getDb();
  if (!db)
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });

  const [cats, subs, presetRows, productRows] = await Promise.all([
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
        id: productTitlePresets.id,
        categoryId: productTitlePresets.categoryId,
        title: productTitlePresets.title,
        sourceLabel: productTitlePresets.sourceLabel,
        attributes: productTitlePresets.attributes,
        subCategoryId: productTitlePresets.subCategoryId,
      })
      .from(productTitlePresets),
    db
      .select({
        id: products.id,
        category: products.category,
        categoryId: products.categoryId,
        title: products.title,
        productTitlePresetId: products.productTitlePresetId,
        attributes: products.attributes,
        subCategoryId: products.subCategoryId,
      })
      .from(products),
  ]);

  const subcategoriesByCategory = new Map<string, typeof subs>();
  for (const subcategory of subs) {
    const current = subcategoriesByCategory.get(subcategory.categoryId) ?? [];
    current.push(subcategory);
    subcategoriesByCategory.set(subcategory.categoryId, current);
  }

  const presetsByCategory = new Map<string, typeof presetRows>();
  for (const preset of presetRows) {
    const current = presetsByCategory.get(preset.categoryId) ?? [];
    current.push(preset);
    presetsByCategory.set(preset.categoryId, current);
  }

  const productsByCategory = new Map<string, typeof productRows>();
  for (const product of productRows) {
    const matchedCategoryIds = new Set<string>();
    if (product.categoryId) matchedCategoryIds.add(product.categoryId);

    for (const category of cats) {
      if (categoryLabelMatches(product.category, category.name)) {
        matchedCategoryIds.add(category.id);
      }
    }

    for (const categoryId of matchedCategoryIds) {
      const current = productsByCategory.get(categoryId) ?? [];
      current.push(product);
      productsByCategory.set(categoryId, current);
    }
  }

  const categories = cats.map((c) => {
    const categoryPresets = (presetsByCategory.get(c.id) ?? []).map((preset) => ({
      id: preset.id,
      title: preset.title,
      sourceLabel: preset.sourceLabel,
      attributes: preset.attributes as Record<string, ProductAttributeValue>,
      subCategoryId: preset.subCategoryId,
    }));
    const categoryProducts = (productsByCategory.get(c.id) ?? []).map((product) => ({
      title: product.title,
      productTitlePresetId: product.productTitlePresetId,
      attributes: product.attributes as Record<string, ProductAttributeValue>,
      subCategoryId: product.subCategoryId,
    }));
    return {
      ...c,
      subcategories: subcategoriesByCategory.get(c.id) ?? [],
      presetCount: categoryPresets.length,
      createdPresetCount: categoryProducts.length,
    };
  });

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

  return NextResponse.json(row, { status: 201 });
}

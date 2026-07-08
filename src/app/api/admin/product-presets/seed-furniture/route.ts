import { count, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getDb } from "@/db";
import {
  productCategories,
  productSubcategories,
  productTitlePresets,
  products,
} from "@/db/schema";
import {
  FURNITURE_PRESETS,
  FURNITURE_SUBCATEGORIES,
} from "@/lib/catalog/furniture-presets";
import { uniqueCategorySlug, uniqueSubcategorySlug } from "@/lib/product-taxonomy";

export async function POST() {
  const db = getDb();
  if (!db) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  const [existing] = await db
    .select()
    .from(productCategories)
    .where(eq(productCategories.name, "Furniture"))
    .limit(1);

  let categoryId = existing?.id;
  if (!categoryId) {
    const slug = await uniqueCategorySlug(db, "Furniture");
    const [created] = await db
      .insert(productCategories)
      .values({ name: "Furniture", slug, sortOrder: 0 })
      .returning();
    categoryId = created.id;
  }

  const [usage] = await db
    .select({ count: count() })
    .from(products)
    .where(eq(products.categoryId, categoryId));
  if (usage.count > 0) {
    return NextResponse.json(
      { error: "Furniture already has products. Refusing to replace its preset catalogue." },
      { status: 409 }
    );
  }

  await db.delete(productTitlePresets).where(eq(productTitlePresets.categoryId, categoryId));
  await db
    .delete(productSubcategories)
    .where(eq(productSubcategories.categoryId, categoryId));

  const subcategoryIds = new Map<string, string>();
  for (let index = 0; index < FURNITURE_SUBCATEGORIES.length; index += 1) {
    const name = FURNITURE_SUBCATEGORIES[index];
    const slug = await uniqueSubcategorySlug(db, categoryId, name);
    const [subcategory] = await db
      .insert(productSubcategories)
      .values({ categoryId, name, slug, sortOrder: index })
      .returning();
    subcategoryIds.set(name, subcategory.id);
  }

  await db.insert(productTitlePresets).values(
    FURNITURE_PRESETS.map((preset, index) => ({
      categoryId,
      subCategoryId: subcategoryIds.get(preset.subcategory) ?? null,
      title: preset.title,
      sourceLabel: preset.sourceLabel,
      attributes: preset.attributes ?? {},
      sortOrder: index,
    }))
  );

  return NextResponse.json({
    ok: true,
    categoryId,
    subcategories: FURNITURE_SUBCATEGORIES.length,
    presets: FURNITURE_PRESETS.length,
  });
}

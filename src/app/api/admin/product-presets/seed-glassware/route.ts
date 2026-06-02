import { or, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getDb } from "@/db";
import {
  categoryProductTemplates,
  productCategories,
  productSubcategories,
  productTitlePresets,
  products,
} from "@/db/schema";
import {
  GLASSWARE_PRESETS,
  GLASSWARE_SUBCATEGORIES,
  GLASSWARE_TEMPLATE_FIELDS,
} from "@/lib/catalog/glassware-presets";
import { upsertCategoryTemplate } from "@/lib/category-template";
import { uniqueCategorySlug, uniqueSubcategorySlug } from "@/lib/product-taxonomy";

export async function POST() {
  const db = getDb();
  if (!db) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  const [existing] = await db
    .select()
    .from(productCategories)
    .where(
      or(
        eq(productCategories.name, "Glass Ware"),
        eq(productCategories.name, "Glassware")
      )
    )
    .limit(1);

  let categoryId = existing?.id;
  if (!categoryId) {
    const slug = await uniqueCategorySlug(db, "Glass Ware");
    const [created] = await db
      .insert(productCategories)
      .values({ name: "Glass Ware", slug, sortOrder: 1 })
      .returning();
    categoryId = created.id;
  } else {
    await db
      .update(productCategories)
      .set({ name: "Glass Ware", sortOrder: 1, updatedAt: new Date() })
      .where(eq(productCategories.id, categoryId));
  }

  const deletedProducts = await db
    .delete(products)
    .where(eq(products.categoryId, categoryId))
    .returning({ id: products.id });

  await db.delete(productTitlePresets).where(eq(productTitlePresets.categoryId, categoryId));
  await db
    .delete(categoryProductTemplates)
    .where(eq(categoryProductTemplates.categoryId, categoryId));
  await db
    .delete(productSubcategories)
    .where(eq(productSubcategories.categoryId, categoryId));

  await upsertCategoryTemplate(db, categoryId, null, GLASSWARE_TEMPLATE_FIELDS);

  const subcategoryIds = new Map<string, string>();
  for (let index = 0; index < GLASSWARE_SUBCATEGORIES.length; index += 1) {
    const name = GLASSWARE_SUBCATEGORIES[index];
    const slug = await uniqueSubcategorySlug(db, categoryId, name);
    const [subcategory] = await db
      .insert(productSubcategories)
      .values({ categoryId, name, slug, sortOrder: index })
      .returning();
    subcategoryIds.set(name, subcategory.id);
  }

  await db.insert(productTitlePresets).values(
    GLASSWARE_PRESETS.map((preset, index) => ({
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
    deletedProducts: deletedProducts.length,
    subcategories: GLASSWARE_SUBCATEGORIES.length,
    presets: GLASSWARE_PRESETS.length,
  });
}

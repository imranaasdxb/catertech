import { asc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import {
  productCategories,
  productSubcategories,
  productTitlePresets,
} from "@/db/schema";
import type { ProductAttributeValue } from "@/lib/category-template";

export type CatalogueCategoryRow = {
  id: string;
  name: string;
  subcategories: {
    id: string;
    name: string;
  }[];
};

export type CataloguePresetRow = {
  id: string;
  categoryId: string;
  subCategoryId: string | null;
  title: string;
  sourceLabel: string;
  attributes: Record<string, ProductAttributeValue>;
  categoryName: string;
  subCategoryName: string | null;
};

export async function getCataloguePresetData(): Promise<{
  categories: CatalogueCategoryRow[];
  presets: CataloguePresetRow[];
  catalogError?: string;
}> {
  const db = getDb();
  if (!db) {
    return {
      categories: [],
      presets: [],
      catalogError: "Database is not configured.",
    };
  }

  try {
    const [categories, subcategories, presets] = await Promise.all([
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
        .orderBy(asc(productCategories.sortOrder), asc(productTitlePresets.sortOrder)),
    ]);

    return {
      categories: categories.map((category) => ({
        id: category.id,
        name: category.name,
        subcategories: subcategories
          .filter((subcategory) => subcategory.categoryId === category.id)
          .map((subcategory) => ({
            id: subcategory.id,
            name: subcategory.name,
          })),
      })),
      presets,
    };
  } catch {
    return {
      categories: [],
      presets: [],
      catalogError: "Could not load live catalogue filters.",
    };
  }
}

import { and, asc, desc, eq } from "drizzle-orm";
import { getDb } from "@/db";
import {
  productCategories,
  productSubcategories,
  products,
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

export type CatalogueProductRow = {
  id: string;
  categoryId: string | null;
  subCategoryId: string | null;
  title: string;
  slug: string;
  description: string;
  image: string | null;
  tag: "Popular" | "New" | null;
  attributes: Record<string, ProductAttributeValue>;
  categoryName: string | null;
  subCategoryName: string | null;
};

function plainText(value: string | null) {
  return (value ?? "")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

export async function getCatalogueProductData({
  featuredOnly = false,
}: {
  featuredOnly?: boolean;
} = {}): Promise<{
  categories: CatalogueCategoryRow[];
  products: CatalogueProductRow[];
  catalogError?: string;
}> {
  const db = getDb();
  if (!db) {
    return {
      categories: [],
      products: [],
      catalogError: "Database is not configured.",
    };
  }

  try {
    const [categories, subcategories, storefrontProducts] = await Promise.all([
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
          id: products.id,
          categoryId: products.categoryId,
          subCategoryId: products.subCategoryId,
          title: products.title,
          slug: products.slug,
          description: products.description,
          images: products.images,
          attributes: products.attributes,
          isFeatured: products.isFeatured,
          createdAt: products.createdAt,
          categoryName: productCategories.name,
          subCategoryName: productSubcategories.name,
        })
        .from(products)
        .leftJoin(productCategories, eq(products.categoryId, productCategories.id))
        .leftJoin(
          productSubcategories,
          eq(products.subCategoryId, productSubcategories.id)
        )
        .where(
          featuredOnly
            ? and(eq(products.published, true), eq(products.isFeatured, true))
            : eq(products.published, true)
        )
        .orderBy(desc(products.isFeatured), desc(products.createdAt)),
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
      products: storefrontProducts.map((product) => {
        const isNew = Date.now() - product.createdAt.getTime() <= 30 * 24 * 60 * 60 * 1000;
        return {
          id: product.id,
          categoryId: product.categoryId,
          subCategoryId: product.subCategoryId,
          title: product.title,
          slug: product.slug,
          description: plainText(product.description),
          image: product.images[0] ?? null,
          tag: isNew ? "New" : product.isFeatured ? "Popular" : null,
          attributes: product.attributes,
          categoryName: product.categoryName,
          subCategoryName: product.subCategoryName,
        };
      }),
    };
  } catch {
    return {
      categories: [],
      products: [],
      catalogError: "Could not load live catalogue products.",
    };
  }
}

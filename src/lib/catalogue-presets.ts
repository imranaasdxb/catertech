import { and, asc, desc, eq, ne, or, sql } from "drizzle-orm";
import { getDb } from "@/db";
import {
  productCategories,
  productSubcategories,
  productTitlePresets,
  products,
} from "@/db/schema";
import type { ProductAttributeValue } from "@/lib/category-template";
import { resolveCategoryForProduct } from "@/lib/product-category-match";

export type CatalogueCategoryRow = {
  id: string;
  name: string;
  slug: string;
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
  images?: string[];
  tag: "Popular" | "New" | null;
  attributes: Record<string, ProductAttributeValue>;
  categoryName: string | null;
  categorySlug: string | null;
  subCategoryName: string | null;
};

function mapStorefrontProduct(product: {
  id: string;
  categoryId: string | null;
  subCategoryId: string | null;
  title: string;
  slug: string;
  description: string | null;
  images: string[];
  attributes: Record<string, ProductAttributeValue>;
  isFeatured: boolean;
  createdAt: Date;
  categoryName: string | null;
  categorySlug?: string | null;
  categoryLabel?: string | null;
  subCategoryName: string | null;
}): CatalogueProductRow {
  const isNew = Date.now() - product.createdAt.getTime() <= 30 * 24 * 60 * 60 * 1000;
  const resolvedCategoryName =
    product.categoryName?.trim() ||
    product.categoryLabel?.trim() ||
    null;
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
    categoryName: resolvedCategoryName,
    categorySlug: product.categorySlug ?? null,
    subCategoryName: product.subCategoryName,
  };
}

/** Normalise a product title to its variant family key, e.g. "90 x 90 cm Square Table" → "Square Table". */
export function extractProductVariantGroupKey(title: string) {
  let value = title.trim();

  value = value.replace(
    /^(?:\d+(?:\.\d+)?\s*[x×X*]\s*\d+(?:\.\d+)?(?:\s*(?:cm|mm|m|ft|feet|in|inches|"))?|\d+(?:\.\d+)?\s*(?:ft|feet|cm|mm|m|in|inches)\b)\s+/i,
    "",
  );

  value = value.replace(
    /^(?:white|black|blue|red|golden|gold|silver|green|grey|gray|ivory|beige|brown|clear|transparent|chrome|brass|copper|rose)\s+/i,
    "",
  );

  value = value.replace(
    /\s+\d[\d\s*x×*./-]*(?:cm|mm|m|in|inch|inches|ft|feet)?(?:\s*(\([^)]*\)|\[[^\]]*\]))?\s*$/i,
    "",
  );

  value = value.replace(/\s+\([^)]*\)\s*$/i, "").trim();

  return value || title.trim();
}

/** @deprecated Use extractProductVariantGroupKey */
export function extractProductTitlePrefix(title: string) {
  return extractProductVariantGroupKey(title);
}

const storefrontProductSelect = {
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
  categoryLabel: products.category,
  categoryName: productCategories.name,
  categorySlug: productCategories.slug,
  subCategoryName: productSubcategories.name,
  presetTitle: productTitlePresets.title,
};

async function resolveVariantGroupTitle(
  db: NonNullable<ReturnType<typeof getDb>>,
  {
    productTitlePresetId,
    categoryId,
    title,
  }: {
    productTitlePresetId: string | null;
    categoryId: string | null;
    title: string;
  },
): Promise<{ groupTitle: string; subCategoryId: string | null } | null> {
  const normalizedTitle = title.trim();

  if (productTitlePresetId) {
    const [preset] = await db
      .select({
        title: productTitlePresets.title,
        subCategoryId: productTitlePresets.subCategoryId,
      })
      .from(productTitlePresets)
      .where(eq(productTitlePresets.id, productTitlePresetId))
      .limit(1);

    if (preset?.title?.trim()) {
      return {
        groupTitle: preset.title.trim(),
        subCategoryId: preset.subCategoryId,
      };
    }
  }

  if (categoryId) {
    const [matchedPreset] = await db
      .select({
        title: productTitlePresets.title,
        subCategoryId: productTitlePresets.subCategoryId,
      })
      .from(productTitlePresets)
      .where(
        and(
          eq(productTitlePresets.categoryId, categoryId),
          or(
            sql`lower(trim(${productTitlePresets.sourceLabel})) = ${normalizedTitle.toLowerCase()}`,
            sql`lower(trim(${productTitlePresets.title})) = ${normalizedTitle.toLowerCase()}`,
          ),
        ),
      )
      .limit(1);

    if (matchedPreset?.title?.trim()) {
      return {
        groupTitle: matchedPreset.title.trim(),
        subCategoryId: matchedPreset.subCategoryId,
      };
    }
  }

  const derived = extractProductVariantGroupKey(normalizedTitle);
  if (derived.length >= 3) {
    return { groupTitle: derived, subCategoryId: null };
  }

  return null;
}

function productMatchesVariantGroup(
  row: { title: string; presetTitle: string | null },
  groupTitle: string,
) {
  const groupKey = groupTitle.trim().toLowerCase();
  if (row.presetTitle?.trim()) {
    return row.presetTitle.trim().toLowerCase() === groupKey;
  }
  return extractProductVariantGroupKey(row.title).toLowerCase() === groupKey;
}

export async function getProductTitleVariants({
  productId,
  productTitlePresetId,
  canonicalProductId,
  categoryId,
  subCategoryId,
  title,
}: {
  productId: string;
  productTitlePresetId: string | null;
  canonicalProductId: string | null;
  categoryId: string | null;
  subCategoryId?: string | null;
  title: string;
}): Promise<CatalogueProductRow[]> {
  const db = getDb();
  if (!db) return [];

  try {
    if (canonicalProductId) {
      const canonicalRows = await db
        .select(storefrontProductSelect)
        .from(products)
        .leftJoin(productCategories, eq(products.categoryId, productCategories.id))
        .leftJoin(productSubcategories, eq(products.subCategoryId, productSubcategories.id))
        .leftJoin(productTitlePresets, eq(products.productTitlePresetId, productTitlePresets.id))
        .where(
          and(
            eq(products.published, true),
            or(
              eq(products.id, canonicalProductId),
              eq(products.canonicalProductId, canonicalProductId),
            ),
          ),
        )
        .orderBy(asc(products.title));

      const canonicalMapped = canonicalRows.map((product) => ({
        ...mapStorefrontProduct(product),
        images: product.images,
      }));
      if (canonicalMapped.length >= 2) return canonicalMapped;
    }

    const canonicalChildren = await db
      .select({ id: products.id })
      .from(products)
      .where(and(eq(products.published, true), eq(products.canonicalProductId, productId)))
      .limit(24);

    if (canonicalChildren.length > 0) {
      const masterRows = await db
        .select(storefrontProductSelect)
        .from(products)
        .leftJoin(productCategories, eq(products.categoryId, productCategories.id))
        .leftJoin(productSubcategories, eq(products.subCategoryId, productSubcategories.id))
        .leftJoin(productTitlePresets, eq(products.productTitlePresetId, productTitlePresets.id))
        .where(
          and(
            eq(products.published, true),
            or(eq(products.id, productId), eq(products.canonicalProductId, productId)),
          ),
        )
        .orderBy(asc(products.title));

      const masterMapped = masterRows.map((product) => ({
        ...mapStorefrontProduct(product),
        images: product.images,
      }));
      if (masterMapped.length >= 2) return masterMapped;
    }

    if (!categoryId) return [];

    const resolved = await resolveVariantGroupTitle(db, {
      productTitlePresetId,
      categoryId,
      title,
    });
    if (!resolved) return [];

    const scopeSubCategoryId = resolved.subCategoryId ?? subCategoryId ?? null;

    const rows = await db
      .select(storefrontProductSelect)
      .from(products)
      .leftJoin(productCategories, eq(products.categoryId, productCategories.id))
      .leftJoin(productSubcategories, eq(products.subCategoryId, productSubcategories.id))
      .leftJoin(productTitlePresets, eq(products.productTitlePresetId, productTitlePresets.id))
      .where(
        and(
          eq(products.published, true),
          eq(products.categoryId, categoryId),
          scopeSubCategoryId ? eq(products.subCategoryId, scopeSubCategoryId) : undefined,
        ),
      )
      .orderBy(asc(products.title));

    const mapped = rows
      .filter((row) => productMatchesVariantGroup(row, resolved.groupTitle))
      .map((product) => ({
        ...mapStorefrontProduct(product),
        images: product.images,
      }));

    return mapped.length >= 2 ? mapped : [];
  } catch {
    return [];
  }
}

export async function getSimilarCatalogueProducts({
  categoryId,
  excludeProductId,
  limit = 12,
}: {
  categoryId: string | null;
  excludeProductId: string;
  limit?: number;
}): Promise<CatalogueProductRow[]> {
  const db = getDb();
  if (!db) return [];

  try {
    const whereClause = categoryId
      ? and(
          eq(products.published, true),
          eq(products.categoryId, categoryId),
          ne(products.id, excludeProductId),
        )
      : and(eq(products.published, true), ne(products.id, excludeProductId));

    const rows = await db
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
      .leftJoin(productSubcategories, eq(products.subCategoryId, productSubcategories.id))
      .where(whereClause)
      .orderBy(desc(products.isFeatured), desc(products.createdAt))
      .limit(limit);

    return rows.map(mapStorefrontProduct);
  } catch {
    return [];
  }
}

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
          categoryLabel: products.category,
          categoryName: productCategories.name,
          categorySlug: productCategories.slug,
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
        slug: category.slug,
        subcategories: subcategories
          .filter((subcategory) => subcategory.categoryId === category.id)
          .map((subcategory) => ({
            id: subcategory.id,
            name: subcategory.name,
          })),
      })),
      products: storefrontProducts.map((product) => {
        const mapped = mapStorefrontProduct(product);
        const categoryRows = categories.map((category) => ({
          id: category.id,
          name: category.name,
          slug: category.slug,
        }));
        const resolved = resolveCategoryForProduct(
          {
            categoryId: mapped.categoryId,
            categorySlug: mapped.categorySlug,
            category: mapped.categoryName ?? "",
          },
          categoryRows,
        );

        if (!resolved) return mapped;

        return {
          ...mapped,
          categoryId: mapped.categoryId ?? resolved.id,
          categorySlug: mapped.categorySlug ?? resolved.slug,
          categoryName: mapped.categoryName ?? resolved.name,
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

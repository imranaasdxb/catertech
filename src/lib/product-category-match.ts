import { CANONICAL_CATALOGUE } from "@/lib/product-catalog/canonical-catalog";
import { slugify } from "@/lib/slug";

export type CategoryMatchTarget = {
  id: string;
  name: string;
  slug: string;
};

export type ProductCategoryMatchInput = {
  categoryId: string | null;
  categorySlug?: string | null;
  category: string;
};

function norm(value: string) {
  return value.toLowerCase().trim().replace(/\s+/g, " ");
}

export function categoryRootLabel(value: string) {
  return value.split(/[›>]/)[0]?.trim() ?? value.trim();
}

function categoryNamesForTab(name: string) {
  const normalized = norm(name);
  const canonical = CANONICAL_CATALOGUE.find(
    (entry) =>
      norm(entry.name) === normalized ||
      entry.aliases?.some((alias) => norm(alias) === normalized),
  );

  const names = canonical ? [canonical.name, ...(canonical.aliases ?? [])] : [name];
  return [...new Set(names.map(norm))];
}

function categoryNamesForProductLabel(label: string) {
  const root = categoryRootLabel(label);
  const normalizedRoot = norm(root);
  const canonical = CANONICAL_CATALOGUE.find(
    (entry) =>
      norm(entry.name) === normalizedRoot ||
      entry.aliases?.some((alias) => norm(alias) === normalizedRoot),
  );

  const names = canonical ? [canonical.name, ...(canonical.aliases ?? [])] : [root];
  return [...new Set(names.map(norm))];
}

export function productMatchesCategory(
  product: ProductCategoryMatchInput,
  category: CategoryMatchTarget,
): boolean {
  if (product.categoryId === category.id) return true;

  const tabSlug = norm(category.slug);
  if (product.categorySlug && norm(product.categorySlug) === tabSlug) return true;

  const tabNames = categoryNamesForTab(category.name);
  const rawCategory = norm(product.category);

  if (rawCategory) {
    for (const tabName of tabNames) {
      if (rawCategory === tabName) return true;
      if (rawCategory.startsWith(`${tabName} ›`) || rawCategory.startsWith(`${tabName} >`)) {
        return true;
      }
    }
  }

  const productNames = product.category ? categoryNamesForProductLabel(product.category) : [];
  for (const productName of productNames) {
    for (const tabName of tabNames) {
      if (productName === tabName) return true;
    }
    if (slugify(productName) === tabSlug) return true;
  }

  return false;
}

export function resolveCategoryForProduct(
  product: ProductCategoryMatchInput,
  categories: CategoryMatchTarget[],
): CategoryMatchTarget | null {
  if (product.categoryId) {
    const byId = categories.find((category) => category.id === product.categoryId);
    if (byId) return byId;
  }

  return categories.find((category) => productMatchesCategory(product, category)) ?? null;
}

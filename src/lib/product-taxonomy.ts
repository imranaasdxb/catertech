import { and, count, eq, ne } from "drizzle-orm";
import { getDb } from "@/db";
import { productCategories, productSubcategories, products } from "@/db/schema";
import { slugify } from "@/lib/slug";

type DbNonNull = NonNullable<ReturnType<typeof getDb>>;

export async function uniqueCategorySlug(db: DbNonNull, base: string): Promise<string> {
  const root = slugify(base) || "category";
  let s = root;
  let n = 0;
  while (n < 80) {
    const clash = await db
      .select({ id: productCategories.id })
      .from(productCategories)
      .where(eq(productCategories.slug, s))
      .limit(1);
    if (!clash.length) return s;
    n += 1;
    s = `${root}-${n}`;
  }
  throw new Error("Could not allocate category slug");
}

export async function uniqueCategorySlugForUpdate(
  db: DbNonNull,
  base: string,
  excludeCategoryId: string
): Promise<string> {
  const root = slugify(base) || "category";
  let s = root;
  let n = 0;
  while (n < 80) {
    const clash = await db
      .select({ id: productCategories.id })
      .from(productCategories)
      .where(
        and(eq(productCategories.slug, s), ne(productCategories.id, excludeCategoryId))
      )
      .limit(1);
    if (!clash.length) return s;
    n += 1;
    s = `${root}-${n}`;
  }
  throw new Error("Could not allocate category slug");
}

export async function uniqueSubcategorySlug(
  db: DbNonNull,
  categoryId: string,
  base: string
): Promise<string> {
  const root = slugify(base) || "subcategory";
  let s = root;
  let n = 0;
  while (n < 80) {
    const clash = await db
      .select({ id: productSubcategories.id })
      .from(productSubcategories)
      .where(
        and(eq(productSubcategories.categoryId, categoryId), eq(productSubcategories.slug, s))
      )
      .limit(1);
    if (!clash.length) return s;
    n += 1;
    s = `${root}-${n}`;
  }
  throw new Error("Could not allocate subcategory slug");
}

export async function uniqueSubcategorySlugForUpdate(
  db: DbNonNull,
  categoryId: string,
  base: string,
  excludeSubcategoryId: string
): Promise<string> {
  const root = slugify(base) || "subcategory";
  let s = root;
  let n = 0;
  while (n < 80) {
    const clash = await db
      .select({ id: productSubcategories.id })
      .from(productSubcategories)
      .where(
        and(
          eq(productSubcategories.categoryId, categoryId),
          eq(productSubcategories.slug, s),
          ne(productSubcategories.id, excludeSubcategoryId)
        )
      )
      .limit(1);
    if (!clash.length) return s;
    n += 1;
    s = `${root}-${n}`;
  }
  throw new Error("Could not allocate subcategory slug");
}

export async function buildCategoryDisplayLabel(
  db: DbNonNull,
  categoryId: string | null | undefined,
  subCategoryId: string | null | undefined
): Promise<string | null> {
  if (!categoryId) return null;
  const [cat] = await db
    .select()
    .from(productCategories)
    .where(eq(productCategories.id, categoryId))
    .limit(1);
  if (!cat) return null;
  if (!subCategoryId) return cat.name;
  const [sub] = await db
    .select()
    .from(productSubcategories)
    .where(eq(productSubcategories.id, subCategoryId))
    .limit(1);
  if (!sub || sub.categoryId !== categoryId) return cat.name;
  return `${cat.name} › ${sub.name}`;
}

export async function validateSubcategoryForCategory(
  db: DbNonNull,
  categoryId: string | null | undefined,
  subCategoryId: string | null | undefined
): Promise<{ ok: true } | { ok: false; message: string }> {
  if (!subCategoryId) return { ok: true };
  if (!categoryId) return { ok: false, message: "Pick a category before a sub-category." };
  const [sub] = await db
    .select()
    .from(productSubcategories)
    .where(eq(productSubcategories.id, subCategoryId))
    .limit(1);
  if (!sub) return { ok: false, message: "Sub-category not found." };
  if (sub.categoryId !== categoryId) {
    return { ok: false, message: "Sub-category does not belong to the selected category." };
  }
  return { ok: true };
}

export async function countProductsUsingCategory(db: DbNonNull, categoryId: string) {
  const [r] = await db
    .select({ n: count() })
    .from(products)
    .where(eq(products.categoryId, categoryId));
  return Number(r?.n ?? 0);
}

export async function countProductsUsingSubcategory(db: DbNonNull, subCategoryId: string) {
  const [r] = await db
    .select({ n: count() })
    .from(products)
    .where(eq(products.subCategoryId, subCategoryId));
  return Number(r?.n ?? 0);
}

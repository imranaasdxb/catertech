import { asc, desc } from "drizzle-orm";
import AdminProductsTable from "@/components/admin/AdminProductsTable";
import { admin } from "@/components/admin/adminTheme";
import { getDb } from "@/db";
import { productCategories, products } from "@/db/schema";

export const dynamic = "force-dynamic";

const RETRY_DELAYS_MS = [150, 400];

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getErrorText(error: unknown): string {
  if (!error || typeof error !== "object") return String(error);

  const err = error as { message?: unknown; cause?: unknown };
  return `${String(err.message ?? "")} ${getErrorText(err.cause)}`;
}

function isRetryableNeonBusyError(error: unknown) {
  const text = getErrorText(error);
  return (
    text.includes("neon:retryable") ||
    text.includes("Failed to acquire permit") ||
    text.includes("Too many database connection attempts")
  );
}

async function retryBusyDatabase<T>(query: () => Promise<T>) {
  for (let attempt = 0; attempt <= RETRY_DELAYS_MS.length; attempt += 1) {
    try {
      return await query();
    } catch (error) {
      if (!isRetryableNeonBusyError(error) || attempt === RETRY_DELAYS_MS.length) {
        throw error;
      }

      await wait(RETRY_DELAYS_MS[attempt]);
    }
  }

  throw new Error("Database query failed.");
}

export default async function AdminProductsPage() {
  const db = getDb();
  if (!db) {
    return <p className={`${admin.page} ${admin.muted}`}>Configure DATABASE_URL.</p>;
  }

  const selectFields = {
    id: products.id,
    title: products.title,
    slug: products.slug,
    pricePerDayAed: products.pricePerDayAed,
    category: products.category,
    categoryId: products.categoryId,
    published: products.published,
    isFeatured: products.isFeatured,
    isAvailable: products.isAvailable,
    attributes: products.attributes,
    updatedAt: products.updatedAt,
    images: products.images,
  };

  const raw = await retryBusyDatabase(() =>
    db.select(selectFields).from(products).orderBy(desc(products.updatedAt))
  );

  const categories = await retryBusyDatabase(() =>
    db
      .select({
        id: productCategories.id,
        name: productCategories.name,
        slug: productCategories.slug,
      })
      .from(productCategories)
      .orderBy(asc(productCategories.sortOrder), asc(productCategories.name))
  );

  const rows = raw.map((r) => ({
    id: r.id,
    title: r.title,
    slug: r.slug,
    pricePerDayAed: r.pricePerDayAed,
    category: r.category ?? null,
    categoryId: r.categoryId ?? null,
    galleryCount: r.images?.filter(Boolean).length ?? 0,
    published: r.published,
    isFeatured: r.isFeatured,
    isAvailable: r.isAvailable,
    attributes: r.attributes,
    updatedAt: r.updatedAt,
    thumbUrl: r.images?.[0] ?? null,
  }));

  return (
    <div className={admin.page}>
      <div className={admin.headerRow}>
        <div className={admin.headerLead}>
          <h1 className={admin.h1}>Products</h1>
          <p className={`${admin.muted} mt-1`}>Manage catalogue items and publishing.</p>
        </div>
      </div>
      <AdminProductsTable rows={rows} categories={categories} emptyMessage="No products yet." />
    </div>
  );
}

import { asc } from "drizzle-orm";
import AdminProductsTable from "@/components/admin/AdminProductsTable";
import { admin } from "@/components/admin/admin-theme";
import { getDb } from "@/db";
import { productCategories } from "@/db/schema";
import { MAX_SEARCH_LENGTH, MIN_SEARCH_LENGTH, normalizeSearch } from "@/lib/search";

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

export default async function AdminProductsPage({ searchParams }: {
  searchParams: Promise<{ q?: string | string[] }>;
}) {
  const { q } = await searchParams;
  const query = normalizeSearch(typeof q === "string" ? q : "");
  const initialSearch = query.length >= MIN_SEARCH_LENGTH && query.length <= MAX_SEARCH_LENGTH ? query : "";
  const db = getDb();
  if (!db) {
    return <p className={`${admin.page} ${admin.muted}`}>Configure DATABASE_URL.</p>;
  }

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

  return (
    <div className={admin.page}>
      <div className={admin.headerRow}>
        <div className={admin.headerLead}>
          <h1 className={admin.h1}>Products</h1>
          <p className={`${admin.muted} mt-1`}>Manage catalogue items and publishing.</p>
        </div>
      </div>
      <AdminProductsTable key={initialSearch} initialSearch={initialSearch} rows={[]} categories={categories} emptyMessage="No products yet." />
    </div>
  );
}

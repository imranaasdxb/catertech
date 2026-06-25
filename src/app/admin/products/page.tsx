import { asc, desc, ilike, or } from "drizzle-orm";
import Link from "next/link";

export const dynamic = "force-dynamic";
import AdminProductsTable from "@/components/admin/AdminProductsTable";
import { admin } from "@/components/admin/adminTheme";
import { getDb } from "@/db";
import { productCategories, products } from "@/db/schema";

type SearchProps = {
  searchParams?: Promise<{ q?: string }> | { q?: string };
};

export default async function AdminProductsPage({ searchParams }: SearchProps) {
  const sp = searchParams ? await Promise.resolve(searchParams) : {};
  const rawQ = typeof sp.q === "string" ? sp.q.trim() : "";
  const q = rawQ.slice(0, 120);

  const db = getDb();
  if (!db) {
    return <p className={`${admin.page} ${admin.muted}`}>Configure DATABASE_URL.</p>;
  }

  const selectFields = {
    id: products.id,
    title: products.title,
    slug: products.slug,
    category: products.category,
    categoryId: products.categoryId,
    published: products.published,
    isFeatured: products.isFeatured,
    isAvailable: products.isAvailable,
    attributes: products.attributes,
    updatedAt: products.updatedAt,
    images: products.images,
  };

  const [raw, categories] = await Promise.all([
    q
      ? db
          .select(selectFields)
          .from(products)
          .where(
            or(
              ilike(products.title, `%${q}%`),
              ilike(products.slug, `%${q}%`),
              ilike(products.category, `%${q}%`)
            )
          )
          .orderBy(desc(products.updatedAt))
      : db.select(selectFields).from(products).orderBy(desc(products.updatedAt)),
    db
      .select({
        id: productCategories.id,
        name: productCategories.name,
        slug: productCategories.slug,
      })
      .from(productCategories)
      .orderBy(asc(productCategories.sortOrder), asc(productCategories.name)),
  ]);

  const rows = raw.map((r) => ({
    id: r.id,
    title: r.title,
    slug: r.slug,
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
          {q ? (
            <p className={`${admin.muted} mt-1`}>
              Filtered by &ldquo;{q}&rdquo; —{" "}
              <Link href="/admin/products" className={admin.link}>
                Clear
              </Link>
            </p>
          ) : (
            <p className={`${admin.muted} mt-1`}>Manage catalogue items and publishing.</p>
          )}
        </div>
      </div>
      <AdminProductsTable
        rows={rows}
        categories={categories}
        initialSearch={q}
        emptyMessage={q ? "No products match your search." : "No products yet."}
      />
    </div>
  );
}

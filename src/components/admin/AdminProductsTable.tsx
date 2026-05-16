"use client";

import ProductEditClient from "@/app/admin/products/[id]/ProductEditClient";
import { ADMIN_PURPLE, admin, adminCardShadow } from "@/components/admin/adminTheme";
import { AdminPanelModal } from "@/components/admin/AdminPanelModal";
import AdminProductTaxonomyModal from "@/components/admin/AdminProductTaxonomyModal";
import { AdminTypedDeleteDialog } from "@/components/admin/AdminTypedDeleteDialog";
import { products } from "@/db/schema";
import type { InferSelectModel } from "drizzle-orm";
import { Eye, Loader2, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export type AdminProductListRow = {
  id: string;
  title: string;
  slug: string;
  category: string | null;
  /** Gallery image count — compact “bulk” hint in the list. */
  galleryCount: number;
  published: boolean;
  thumbUrl: string | null;
};

type ProductRow = InferSelectModel<typeof products>;

function Thumb({ url }: { url: string | null }) {
  if (!url) {
    return (
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#ede9f7] to-[#e4ddf3] text-[11px] font-semibold text-[#5B2D9B]/45">
        —
      </span>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={url}
      alt=""
      className="h-11 w-11 shrink-0 rounded-xl border border-black/8 object-cover shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
    />
  );
}

export default function AdminProductsTable({
  rows,
  emptyMessage = "No products yet.",
}: {
  rows: AdminProductListRow[];
  emptyMessage?: string;
}) {
  const router = useRouter();
  const [editId, setEditId] = useState<string | null>(null);
  const [viewId, setViewId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminProductListRow | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [editProduct, setEditProduct] = useState<ProductRow | null>(null);
  const [editLoadErr, setEditLoadErr] = useState("");
  const [editLoading, setEditLoading] = useState(false);

  const [viewProduct, setViewProduct] = useState<ProductRow | null>(null);
  const [viewLoadErr, setViewLoadErr] = useState("");
  const [viewLoading, setViewLoading] = useState(false);

  const [taxonomyOpen, setTaxonomyOpen] = useState(false);

  useEffect(() => {
    if (!editId) {
      setEditProduct(null);
      setEditLoadErr("");
      setEditLoading(false);
      return;
    }
    let cancelled = false;
    setEditLoading(true);
    setEditProduct(null);
    setEditLoadErr("");
    fetch(`/api/admin/products/${editId}`)
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((data: ProductRow) => {
        if (!cancelled) setEditProduct(data);
      })
      .catch(() => {
        if (!cancelled) setEditLoadErr("Unable to load this product.");
      })
      .finally(() => {
        if (!cancelled) setEditLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [editId]);

  useEffect(() => {
    if (!viewId) {
      setViewProduct(null);
      setViewLoadErr("");
      setViewLoading(false);
      return;
    }
    let cancelled = false;
    setViewLoading(true);
    setViewProduct(null);
    setViewLoadErr("");
    fetch(`/api/admin/products/${viewId}`)
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((data: ProductRow) => {
        if (!cancelled) setViewProduct(data);
      })
      .catch(() => {
        if (!cancelled) setViewLoadErr("Unable to load this product.");
      })
      .finally(() => {
        if (!cancelled) setViewLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [viewId]);

  const viewRowMeta = rows.find((r) => r.id === viewId);

  return (
    <div className="mx-auto w-full max-w-6xl lg:max-w-7xl">
      <AdminProductTaxonomyModal open={taxonomyOpen} onClose={() => setTaxonomyOpen(false)} />

      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => setTaxonomyOpen(true)}
          className={`${admin.secondaryBtn} shrink-0 justify-center border border-black/12 bg-white py-3 text-sm`}
        >
          Category master
        </button>
        <Link
          href="/admin/products/new"
          className={`${admin.primaryBtn} shrink-0 justify-center py-3 text-sm`}
          style={{ backgroundColor: ADMIN_PURPLE }}
        >
          New product
        </Link>
      </div>

      <AdminPanelModal
        open={Boolean(editId)}
        title="Edit product"
        subtitle="Gallery uploads when you save."
        widthClass="max-w-[min(100%-1rem,46rem)]"
        onClose={() => setEditId(null)}
      >
        {editLoading ? (
          <div className="flex flex-col items-center gap-3 py-20 text-[#1a1a1a]/50">
            <Loader2 className="h-8 w-8 animate-spin text-[#5B2D9B]" aria-hidden />
            <p className="text-sm">Loading editor…</p>
          </div>
        ) : editLoadErr ? (
          <p className={`${admin.error} py-8 text-center`}>{editLoadErr}</p>
        ) : editProduct ? (
          <ProductEditClient
            variant="modal"
            product={editProduct}
            onDeleted={() => {
              setEditId(null);
              void router.refresh();
            }}
          />
        ) : null}
      </AdminPanelModal>

      <AdminPanelModal
        open={Boolean(viewId)}
        title={viewProduct?.title ?? viewRowMeta?.title ?? "View product"}
        subtitle="Read-only catalogue preview"
        widthClass="max-w-[min(100%-1rem,44rem)]"
        onClose={() => setViewId(null)}
      >
        {viewLoading ? (
          <div className="flex flex-col items-center gap-3 py-20 text-[#1a1a1a]/50">
            <Loader2 className="h-8 w-8 animate-spin text-[#5B2D9B]" aria-hidden />
            <p className="text-sm">Loading…</p>
          </div>
        ) : viewLoadErr ? (
          <p className={`${admin.error} py-8 text-center`}>{viewLoadErr}</p>
        ) : viewProduct ? (
          <div className="space-y-5 rounded-xl border border-black/8 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap gap-2 text-xs">
              {viewProduct.category ? (
                <span className={`rounded-full px-3 py-1 ${admin.secondaryBtn} border-black/10`}>
                  {viewProduct.category}
                </span>
              ) : null}
              <span className={`rounded-full px-3 py-1 font-mono ${admin.secondaryBtn} border-black/10`}>
                /{viewProduct.slug}
              </span>
            </div>
            <div className="flex flex-wrap gap-2 text-[11px] font-semibold uppercase tracking-wide">
              <span className={`rounded-full px-2 py-0.5 ${viewProduct.published ? "bg-emerald-50 text-emerald-800" : "bg-neutral-100 text-neutral-600"}`}>
                {viewProduct.published ? "Published" : "Draft"}
              </span>
              {viewProduct.isFeatured ? (
                <span className="rounded-full bg-amber-50 px-2 py-0.5 text-amber-900">Featured</span>
              ) : null}
              <span className={`rounded-full px-2 py-0.5 ${viewProduct.isAvailable ? "bg-emerald-50 text-emerald-800" : "bg-red-50 text-red-700"}`}>
                {viewProduct.isAvailable ? "Available" : "Unavailable"}
              </span>
            </div>
            {viewProduct.images?.length ? (
              <div className="flex flex-wrap gap-2">
                {viewProduct.images.slice(0, 6).map((src) => (
                  <div key={src} className="h-20 w-20 overflow-hidden rounded-lg border border-black/6 bg-neutral-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={src} alt="" className="h-full w-full object-cover" />
                  </div>
                ))}
              </div>
            ) : (
              <p className={`text-xs ${admin.muted}`}>No gallery images</p>
            )}
            <div className={`rounded-lg border border-black/6 bg-[#faf8ff]/50 p-4 text-sm leading-relaxed [&_img]:max-w-full [&_video]:max-w-full`}>
              {viewProduct.description ? (
                <div dangerouslySetInnerHTML={{ __html: viewProduct.description }} />
              ) : (
                <p className={admin.muted}>No description.</p>
              )}
            </div>
          </div>
        ) : null}
      </AdminPanelModal>

      <AdminTypedDeleteDialog
        open={Boolean(deleteTarget)}
        noun="product"
        highlight={deleteTarget?.title}
        onCancel={() => setDeleteTarget(null)}
        onConfirm={async () => {
          if (!deleteTarget) return;
          setDeletingId(deleteTarget.id);
          try {
            const res = await fetch(`/api/admin/products/${deleteTarget.id}`, { method: "DELETE" });
            if (!res.ok) throw new Error();
            router.refresh();
          } finally {
            setDeletingId(null);
          }
        }}
      />

      <div className={admin.tableShell} style={adminCardShadow}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1024px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-black/[0.07] bg-gradient-to-b from-[#faf9fc] via-[#f7f6fa] to-[#f3f1f7]">
                <th
                  scope="col"
                  className="w-14 px-4 py-3.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#1a1a1a]/40"
                >
                  <span className="sr-only">Thumb</span>
                  <span aria-hidden className="text-[#1a1a1a]/30">
                    •
                  </span>
                </th>
                <th
                  scope="col"
                  className="min-w-[200px] max-w-[26%] px-4 py-3.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#1a1a1a]/40"
                >
                  Title
                </th>
                <th
                  scope="col"
                  className="w-[11rem] min-w-[8rem] px-4 py-3.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#1a1a1a]/40"
                >
                  Category
                </th>
                <th
                  scope="col"
                  className="w-[4.75rem] px-2 py-3.5 text-center text-[10px] font-bold uppercase tracking-[0.12em] text-[#1a1a1a]/40"
                  title="Number of gallery images"
                >
                  Photos
                </th>
                <th
                  scope="col"
                  className="w-[6.5rem] px-2 py-3.5 text-center text-[10px] font-bold uppercase tracking-[0.12em] text-[#1a1a1a]/40"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="w-[7.75rem] px-3 py-3.5 text-right text-[10px] font-bold uppercase tracking-[0.12em] text-[#1a1a1a]/40"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {rows.map((r) => (
                <tr
                  key={r.id}
                  className="border-b border-black/[0.05] transition-colors last:border-b-0 hover:bg-[#5B2D9B]/[0.035]"
                >
                  <td className="px-4 py-3 align-middle">
                    <Thumb url={r.thumbUrl} />
                  </td>
                  <td className="max-w-0 px-4 py-3 align-middle">
                    <p className="truncate font-semibold leading-snug text-[#1a1a1a]" title={r.title}>
                      {r.title}
                    </p>
                  </td>
                  <td className="max-w-0 px-4 py-3 align-middle">
                    <p className="truncate text-[13px] leading-snug text-[#1a1a1a]/55" title={r.category ?? undefined}>
                      {r.category ?? "—"}
                    </p>
                  </td>
                  <td className="px-2 py-3 align-middle text-center tabular-nums">
                    <span className="inline-flex min-h-[2rem] min-w-[2rem] items-center justify-center rounded-lg bg-[#f3f1f8] px-2 text-[13px] font-semibold text-[#5B2D9B] ring-1 ring-[#5B2D9B]/10">
                      {r.galleryCount}
                    </span>
                  </td>
                  <td className="px-2 py-3 align-middle text-center">
                    {r.published ? (
                      <span className="inline-flex min-w-[4.25rem] justify-center rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-emerald-800 ring-1 ring-emerald-200/60">
                        Live
                      </span>
                    ) : (
                      <span className="inline-flex min-w-[4.25rem] justify-center rounded-full bg-neutral-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-neutral-600 ring-1 ring-black/6">
                        Draft
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-3 align-middle">
                    <div className="flex items-center justify-end gap-0.5">
                      <button
                        type="button"
                        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[#5B2D9B] transition-colors hover:bg-[#5B2D9B]/12"
                        title="Edit"
                        aria-label={`Edit ${r.title}`}
                        onClick={() => setEditId(r.id)}
                      >
                        <Pencil className="h-4 w-4" aria-hidden />
                      </button>
                      <button
                        type="button"
                        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-[#1a1a1a]/60 transition-colors hover:bg-black/[0.06]"
                        title="View"
                        aria-label={`View ${r.title}`}
                        onClick={() => setViewId(r.id)}
                      >
                        <Eye className="h-4 w-4" aria-hidden />
                      </button>
                      <button
                        type="button"
                        disabled={deletingId === r.id}
                        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-red-600 transition-colors hover:bg-red-50 disabled:opacity-45"
                        title="Delete"
                        aria-label={`Delete ${r.title}`}
                        onClick={() => setDeleteTarget(r)}
                      >
                        <Trash2 className="h-4 w-4" aria-hidden />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={6} className={admin.emptyCell}>
                    {emptyMessage}
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

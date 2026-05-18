"use client";

import ProductEditClient from "@/app/admin/products/[id]/ProductEditClient";
import { ADMIN_PURPLE, admin } from "@/components/admin/adminTheme";
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
  /** Gallery image count — compact "bulk" hint in the list. */
  galleryCount: number;
  published: boolean;
  thumbUrl: string | null;
};

type ProductRow = InferSelectModel<typeof products>;

function Thumb({ url }: { url: string | null }) {
  if (!url) {
    return (
      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-neutral-100 text-xs font-medium text-neutral-400">
        —
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={url} alt="" className="h-10 w-10 rounded-md object-cover" />
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

      <div className="mb-5 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setTaxonomyOpen(true)}
          className={`${admin.secondaryBtn} shrink-0 border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium`}
        >
          Category master
        </button>
        <Link
          href="/admin/products/new"
          className={`${admin.primaryBtn} shrink-0 px-4 py-2.5 text-sm font-medium`}
          style={{ backgroundColor: ADMIN_PURPLE }}
        >
          + New product
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
        subtitle="Product preview"
        widthClass="max-w-[min(100%-1rem,48rem)]"
        onClose={() => setViewId(null)}
      >
        {viewLoading ? (
          <div className="flex flex-col items-center gap-3 py-16">
            <Loader2 className="h-7 w-7 animate-spin text-gray-400" aria-hidden />
            <p className="text-sm text-gray-400">Loading…</p>
          </div>
        ) : viewLoadErr ? (
          <div className="rounded-lg bg-red-50 px-4 py-8 text-center text-sm text-red-600">
            {viewLoadErr}
          </div>
        ) : viewProduct ? (
          <div className="space-y-6">
            {/* Meta Info */}
            <div className="flex flex-wrap items-center gap-2">
              {viewProduct.category && (
                <span className="inline-flex items-center rounded-md bg-purple-100 px-2.5 py-1 text-xs font-medium text-purple-700">
                  {viewProduct.category}
                </span>
              )}
              <span className="inline-flex items-center rounded-md bg-gray-100 px-2.5 py-1 text-xs font-mono text-gray-500">
                /{viewProduct.slug}
              </span>
            </div>

            {/* Status Badges */}
            <div className="flex flex-wrap gap-2">
              <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${viewProduct.published ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-600"}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${viewProduct.published ? "bg-emerald-500" : "bg-gray-400"}`} />
                {viewProduct.published ? "Published" : "Draft"}
              </span>
              {viewProduct.isFeatured && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                  Featured
                </span>
              )}
              <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${viewProduct.isAvailable ? "bg-blue-100 text-blue-700" : "bg-red-100 text-red-700"}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${viewProduct.isAvailable ? "bg-blue-500" : "bg-red-500"}`} />
                {viewProduct.isAvailable ? "Available" : "Unavailable"}
              </span>
            </div>

            {/* Gallery */}
            {viewProduct.images?.length ? (
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-gray-400">Gallery ({viewProduct.images.length})</p>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {viewProduct.images.slice(0, 8).map((src, idx) => (
                    <div
                      key={src}
                      className="group relative aspect-square overflow-hidden rounded-lg bg-gray-100"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={src}
                        alt=""
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      />
                      {idx === 7 && viewProduct.images!.length > 8 && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-sm font-medium text-white">
                          +{viewProduct.images!.length - 8}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-gray-200 py-8 text-center">
                <p className="text-xs text-gray-400">No gallery images</p>
              </div>
            )}

            {/* Description */}
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wider text-gray-400">Description</p>
              <div className="rounded-lg border border-gray-100 bg-gray-50/50 p-4 text-sm leading-relaxed text-gray-700 [&_img]:max-w-full [&_video]:max-w-full">
                {viewProduct.description ? (
                  <div dangerouslySetInnerHTML={{ __html: viewProduct.description }} />
                ) : (
                  <p className="text-gray-400">No description provided.</p>
                )}
              </div>
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

      {/* Modern Card Table Design */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/80">
                <th className="px-4 py-3 text-left">
                  <span className="sr-only">Image</span>
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Product
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Category
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Photos
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Status
                </th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.map((r) => (
                <tr
                  key={r.id}
                  className="transition-colors hover:bg-gray-50/60"
                >
                  <td className="px-4 py-3">
                    <Thumb url={r.thumbUrl} />
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900 truncate max-w-[200px]">{r.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">/{r.slug}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
                      {r.category ?? "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-purple-50 text-xs font-semibold text-purple-700">
                      {r.galleryCount}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {r.published ? (
                      <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">
                        Live
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-500">
                        Draft
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-purple-100 hover:text-purple-700"
                        title="Edit"
                        aria-label={`Edit ${r.title}`}
                        onClick={() => setEditId(r.id)}
                      >
                        <Pencil className="h-3.5 w-3.5" aria-hidden />
                      </button>
                      <button
                        type="button"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100"
                        title="View"
                        aria-label={`View ${r.title}`}
                        onClick={() => setViewId(r.id)}
                      >
                        <Eye className="h-3.5 w-3.5" aria-hidden />
                      </button>
                      <button
                        type="button"
                        disabled={deletingId === r.id}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-40"
                        title="Delete"
                        aria-label={`Delete ${r.title}`}
                        onClick={() => setDeleteTarget(r)}
                      >
                        <Trash2 className="h-3.5 w-3.5" aria-hidden />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-16 text-center text-sm text-gray-400">
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
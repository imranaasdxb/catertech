"use client";

import ProductEditClient from "@/app/admin/products/[id]/ProductEditClient";
import { ADMIN_PURPLE, admin } from "@/components/admin/adminTheme";
import { AdminConfirmDialog } from "@/components/admin/AdminConfirmDialog";
import AdminProductViewEditPanel from "@/components/admin/AdminProductViewEditPanel";
import AdminProductViewPanel from "@/components/admin/AdminProductViewPanel";
import { AdminPanelModal } from "@/components/admin/AdminPanelModal";
import { AdminTypedDeleteDialog } from "@/components/admin/AdminTypedDeleteDialog";
import { notifyProductTaxonomyChanged } from "@/components/admin/ProductCategorySelects";
import { products, type ProductAttributeValue } from "@/db/schema";
import type { InferSelectModel } from "drizzle-orm";
import { Check, Eye, Loader2, Pencil, Search, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

export type AdminProductListRow = {
  id: string;
  title: string;
  slug: string;
  category: string | null;
  galleryCount: number;
  published: boolean;
  isFeatured: boolean;
  isAvailable: boolean;
  attributes: Record<string, ProductAttributeValue>;
  updatedAt: Date | string;
  thumbUrl: string | null;
};

type ProductRow = InferSelectModel<typeof products>;

type FilterKey = "all" | "live" | "draft" | "featured";

type ToggleAction = {
  id: string;
  title: string;
  field: "published" | "isFeatured" | "isAvailable";
  nextValue: boolean;
};

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

function formatAttribute(value: ProductAttributeValue) {
  if (typeof value === "string") return value || "Not set";
  return `${value.value || "Not set"}${value.unit ? ` ${value.unit}` : ""}`;
}

function formatUpdatedAt(value: Date | string) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function Specifications({
  attributes,
}: {
  attributes: Record<string, ProductAttributeValue>;
}) {
  const priority = [
    "dimensions",
    "size",
    "length",
    "width",
    "height",
    "diameter",
    "material",
    "capacity",
    "voltage",
    "power",
    "brand",
    "weight",
  ];
  const priorityIndex = new Map(priority.map((key, index) => [key, index]));
  const entries = Object.entries(attributes)
    .filter(([key]) => key !== "additional_details")
    .sort(([left], [right]) => {
      const leftIndex = priorityIndex.get(left) ?? priority.length;
      const rightIndex = priorityIndex.get(right) ?? priority.length;
      return leftIndex - rightIndex;
    })
    .slice(0, 4);

  if (!entries.length) {
    return <span className="text-xs text-gray-400">No saved specifications</span>;
  }

  return (
    <div className="flex flex-col gap-y-0.5">
      {entries.map(([key, value]) => (
        <p key={key} className="min-w-0 text-xs leading-5 text-gray-600">
          <span className="font-semibold capitalize text-gray-400">{key.replace(/_/g, " ")}:</span>{" "}
          <span className="whitespace-nowrap">{formatAttribute(value)}</span>
        </p>
      ))}
    </div>
  );
}

function VisibilityToggle({
  active,
  label,
  title,
  disabled,
  onClick,
}: {
  active: boolean;
  label: string;
  title: string;
  disabled?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      aria-pressed={active}
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex cursor-pointer items-center gap-1 rounded-lg border px-2 py-1 text-[11px] font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40 sm:gap-1.5 sm:px-2.5 sm:py-1.5 sm:text-xs ${
        active
          ? "border-admin-accent/35 bg-admin-accent/10 text-admin-ink"
          : "border-admin-border bg-white text-admin-ink/50 hover:border-admin-border hover:bg-admin-bg"
      }`}
    >
      <span
        className={`inline-flex h-4 w-4 items-center justify-center rounded border ${
          active ? "border-admin-accent bg-admin-accent text-white" : "border-admin-border bg-white"
        }`}
      >
        {active ? <Check className="h-2.5 w-2.5" strokeWidth={3} aria-hidden /> : null}
      </span>
      {label}
    </button>
  );
}

export default function AdminProductsTable({
  rows,
  initialSearch = "",
  emptyMessage = "No products yet.",
}: {
  rows: AdminProductListRow[];
  initialSearch?: string;
  emptyMessage?: string;
}) {
  const router = useRouter();
  const [localRows, setLocalRows] = useState(rows);
  const [searchInput, setSearchInput] = useState(initialSearch);
  const [filter, setFilter] = useState<FilterKey>("all");
  const [editId, setEditId] = useState<string | null>(null);
  const [viewId, setViewId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminProductListRow | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [toggleAction, setToggleAction] = useState<ToggleAction | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const [editProduct, setEditProduct] = useState<ProductRow | null>(null);
  const [editLoadErr, setEditLoadErr] = useState("");
  const [editLoading, setEditLoading] = useState(false);

  const [viewProduct, setViewProduct] = useState<ProductRow | null>(null);
  const [viewLoadErr, setViewLoadErr] = useState("");
  const [viewLoading, setViewLoading] = useState(false);
  const [viewEditing, setViewEditing] = useState(false);

  useEffect(() => {
    // Refresh the optimistic table copy after a server navigation.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLocalRows(rows);
  }, [rows]);

  useEffect(() => {
    // Keep the submitted server search term in sync after navigation.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSearchInput(initialSearch);
  }, [initialSearch]);

  const filteredRows = useMemo(() => {
    return localRows.filter((r) => {
      if (filter === "live") return r.published;
      if (filter === "draft") return !r.published;
      if (filter === "featured") return r.isFeatured;
      return true;
    });
  }, [localRows, filter]);

  useEffect(() => {
    if (!editId) return;
    let cancelled = false;
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
    if (!viewId) return;
    let cancelled = false;
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

  const viewRowMeta = localRows.find((r) => r.id === viewId);

  function openEdit(id: string) {
    setEditProduct(null);
    setEditLoadErr("");
    setEditLoading(true);
    setEditId(id);
  }

  function closeEdit() {
    setEditId(null);
    setEditProduct(null);
    setEditLoadErr("");
    setEditLoading(false);
  }

  function openView(id: string) {
    setViewProduct(null);
    setViewLoadErr("");
    setViewLoading(true);
    setViewEditing(false);
    setViewId(id);
  }

  function closeView() {
    setViewId(null);
    setViewProduct(null);
    setViewLoadErr("");
    setViewLoading(false);
    setViewEditing(false);
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = searchInput.trim();
    router.push(q ? `/admin/products?q=${encodeURIComponent(q)}` : "/admin/products");
  }

  function toggleCopy(action: ToggleAction) {
    const { field, nextValue, title } = action;
    if (field === "published") {
      return {
        title: nextValue ? "Publish live?" : "Move to draft?",
        message: nextValue
          ? "This product will appear on the public shop."
          : "This product will be hidden from the public shop.",
        confirmLabel: nextValue ? "Publish live" : "Move to draft",
        highlight: title,
      };
    }
    if (field === "isFeatured") {
      return {
        title: nextValue ? "Feature on homepage?" : "Remove from homepage?",
        message: nextValue
          ? "This product will be highlighted on the homepage featured section."
          : "This product will no longer appear in the homepage featured section.",
        confirmLabel: nextValue ? "Feature product" : "Remove feature",
        highlight: title,
      };
    }
    return {
      title: nextValue ? "Mark as available?" : "Mark as unavailable?",
      message: nextValue
        ? "Customers will see this product as available."
        : "Customers will see this product as unavailable.",
      confirmLabel: nextValue ? "Mark available" : "Mark unavailable",
      highlight: title,
    };
  }

  async function applyToggle(action: ToggleAction) {
    setTogglingId(action.id);
    try {
      const res = await fetch(`/api/admin/products/${action.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [action.field]: action.nextValue }),
      });
      if (!res.ok) throw new Error();
      setLocalRows((prev) =>
        prev.map((r) => (r.id === action.id ? { ...r, [action.field]: action.nextValue } : r))
      );
      router.refresh();
    } finally {
      setTogglingId(null);
    }
  }

  const confirmCopy = toggleAction ? toggleCopy(toggleAction) : null;

  return (
    <div className="mx-auto w-full max-w-[1560px] px-1 sm:px-2 lg:px-4">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-center">
          <form onSubmit={handleSearchSubmit} className="relative min-w-0 flex-1 sm:max-w-xs">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
              aria-hidden
            />
            <input
              type="search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search products…"
            className="w-full rounded-lg border border-admin-border bg-white py-2.5 pl-9 pr-3 text-sm text-admin-ink outline-none placeholder:text-admin-ink/40 focus:border-admin-accent/50 focus:ring-2 focus:ring-admin-accent/15"
            />
          </form>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as FilterKey)}
            aria-label="Filter products"
            className="cursor-pointer rounded-lg border border-admin-border bg-white px-3 py-2.5 text-sm text-admin-ink outline-none focus:border-admin-accent/50 focus:ring-2 focus:ring-admin-accent/15"
          >
            <option value="all">All products</option>
            <option value="live">Live only</option>
            <option value="draft">Draft only</option>
            <option value="featured">Featured only</option>
          </select>
          <p className="shrink-0 text-sm text-gray-500">
            <span className="font-semibold text-gray-800">{filteredRows.length}</span>
            {filteredRows.length === 1 ? " product" : " products"}
            {filter !== "all" ? " shown" : ""}
          </p>
        </div>
        <div className="flex shrink-0 items-center justify-end gap-2">
          <Link
            href="/admin/products/categories"
            className={`${admin.secondaryBtn} cursor-pointer border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium`}
          >
            Category master
          </Link>
          <Link
            href="/admin/products/new"
            className={`${admin.primaryBtn} cursor-pointer px-4 py-2.5 text-sm font-medium`}
            style={{ backgroundColor: ADMIN_PURPLE }}
          >
            + New product
          </Link>
        </div>
      </div>

      <AdminConfirmDialog
        open={Boolean(toggleAction)}
        title={confirmCopy?.title ?? ""}
        message={confirmCopy?.message}
        highlight={confirmCopy?.highlight}
        confirmLabel={confirmCopy?.confirmLabel ?? "Confirm"}
        confirmVariant="primary"
        onCancel={() => setToggleAction(null)}
        onConfirm={async () => {
          if (!toggleAction) return;
          await applyToggle(toggleAction);
        }}
      />

      <AdminPanelModal
        open={Boolean(editId)}
        title="Edit product"
        subtitle="Gallery uploads when you save."
        widthClass="max-w-[min(100%-1rem,46rem)]"
        onClose={closeEdit}
      >
        {editLoading ? (
          <div className="flex flex-col items-center gap-3 py-20 text-admin-ink/50">
            <Loader2 className="h-8 w-8 animate-spin text-admin-accent" aria-hidden />
            <p className="text-sm">Loading editor…</p>
          </div>
        ) : editLoadErr ? (
          <p className={`${admin.error} py-8 text-center`}>{editLoadErr}</p>
        ) : editProduct ? (
          <ProductEditClient
            variant="modal"
            product={editProduct}
            onDeleted={() => {
              closeEdit();
              void router.refresh();
            }}
          />
        ) : null}
      </AdminPanelModal>

      <AdminPanelModal
        open={Boolean(viewId)}
        title={viewProduct?.title ?? viewRowMeta?.title ?? "View product"}
        subtitle={
          viewEditing
            ? "Editing product"
            : viewProduct?.productId ?? "Product overview"
        }
        widthClass="max-w-[min(100%-0.75rem,72rem)]"
        maxHeightClass="max-h-[min(94vh,900px)]"
        scrollable
        headerActions={
          viewProduct && !viewLoading && !viewLoadErr && !viewEditing ? (
            <button
              type="button"
              className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full text-admin-ink/45 transition-colors hover:bg-admin-accent/12 hover:text-admin-accent"
              aria-label="Edit product"
              title="Edit product"
              onClick={() => setViewEditing(true)}
            >
              <Pencil className="h-4 w-4" aria-hidden />
            </button>
          ) : null
        }
        onClose={closeView}
      >
        {viewLoading ? (
          <div className="flex flex-col items-center gap-3 py-16">
            <Loader2 className="h-7 w-7 animate-spin text-gray-400" aria-hidden />
            <p className="text-sm text-gray-400">Loading product…</p>
          </div>
        ) : viewLoadErr ? (
          <div className="rounded-lg bg-red-50 px-4 py-8 text-center text-sm text-red-600">
            {viewLoadErr}
          </div>
        ) : viewProduct && viewEditing ? (
          <AdminProductViewEditPanel
            key={`edit-${viewProduct.id}-${viewProduct.updatedAt}`}
            product={viewProduct}
            onCancel={() => setViewEditing(false)}
            onSaved={(updated) => {
              setViewProduct(updated);
              setViewEditing(false);
              setLocalRows((prev) =>
                prev.map((r) =>
                  r.id === updated.id
                    ? {
                        ...r,
                        title: updated.title,
                        slug: updated.slug,
                        category: updated.category,
                        galleryCount: updated.images?.length ?? 0,
                        published: updated.published,
                        isFeatured: updated.isFeatured,
                        isAvailable: updated.isAvailable,
                        attributes: (updated.attributes ?? {}) as Record<string, ProductAttributeValue>,
                        updatedAt: updated.updatedAt,
                        thumbUrl: updated.images?.[0] ?? null,
                      }
                    : r
                )
              );
              router.refresh();
            }}
          />
        ) : viewProduct ? (
          <AdminProductViewPanel product={viewProduct} />
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
            notifyProductTaxonomyChanged();
            router.refresh();
          } finally {
            setDeletingId(null);
          }
        }}
      />

      <div className="overflow-hidden rounded-xl border border-admin-border bg-white shadow-sm">
        <div className="overflow-x-auto sm:overflow-x-hidden [scrollbar-color:rgba(26,26,26,0.22)_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-black/20 [&::-webkit-scrollbar-track]:bg-transparent">
          <table className="w-full table-fixed border-collapse max-sm:min-w-[580px]">
            <thead>
              <tr className="border-b border-admin-border bg-admin-accent-tint/75">
                <th className="w-[44px] px-2 py-3 text-center text-xs font-semibold uppercase tracking-wider text-admin-ink/55 sm:px-3">
                  S.N
                </th>
                <th className="w-[52px] px-2 py-3 text-left sm:px-3">
                  <span className="sr-only">Image</span>
                </th>
                <th className="w-[18%] px-2 py-3 text-left text-xs font-semibold uppercase tracking-wider text-admin-ink/55 sm:px-3">
                  Product
                </th>
                <th className="w-[20%] px-2 py-3 text-left text-xs font-semibold uppercase tracking-wider text-admin-ink/55 sm:px-3">
                  Specifications
                </th>
                <th className="w-[30%] px-2 py-3 text-left text-xs font-semibold uppercase tracking-wider text-admin-ink/55 sm:px-3">
                  Visibility
                </th>
                <th className="w-[14%] min-w-[96px] px-2 py-3 text-right text-xs font-semibold uppercase tracking-wider text-admin-ink/55 sm:px-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((r, index) => (
                <tr
                  key={r.id}
                  className={`min-h-[88px] align-top border-b border-admin-border/60 transition-colors last:border-b-0 ${
                    index % 2 === 0 ? "bg-white" : "bg-admin-bg/90"
                  } hover:bg-admin-accent/[0.07]`}
                >
                  <td className="px-2 py-4 text-center text-xs font-semibold tabular-nums text-gray-400 sm:px-3">
                    {index + 1}
                  </td>
                  <td className="px-2 py-3 sm:px-3">
                    <Thumb url={r.thumbUrl} />
                  </td>
                  <td className="px-2 py-3 sm:px-3">
                    <p className="truncate font-semibold text-gray-900">{r.title}</p>
                    <p className="mt-0.5 truncate text-xs text-gray-400">/{r.slug}</p>
                    {r.category ? (
                      <p className="mt-1 truncate text-xs font-medium text-gray-500">{r.category}</p>
                    ) : null}
                  </td>
                  <td className="px-2 py-3 sm:px-3">
                    <Specifications attributes={r.attributes} />
                  </td>
                  <td className="px-2 py-3 sm:px-3">
                    <div className="flex flex-wrap gap-1 sm:gap-1.5">
                      <VisibilityToggle
                        active={r.published}
                        label="Live"
                        title={r.published ? "Unpublish (move to draft)" : "Publish live"}
                        disabled={togglingId === r.id}
                        onClick={() =>
                          setToggleAction({
                            id: r.id,
                            title: r.title,
                            field: "published",
                            nextValue: !r.published,
                          })
                        }
                      />
                      <VisibilityToggle
                        active={r.isFeatured}
                        label="Featured"
                        title={r.isFeatured ? "Remove from homepage" : "Feature on homepage"}
                        disabled={togglingId === r.id}
                        onClick={() =>
                          setToggleAction({
                            id: r.id,
                            title: r.title,
                            field: "isFeatured",
                            nextValue: !r.isFeatured,
                          })
                        }
                      />
                      <VisibilityToggle
                        active={r.isAvailable}
                        label="Available"
                        title={r.isAvailable ? "Mark unavailable" : "Mark available"}
                        disabled={togglingId === r.id}
                        onClick={() =>
                          setToggleAction({
                            id: r.id,
                            title: r.title,
                            field: "isAvailable",
                            nextValue: !r.isAvailable,
                          })
                        }
                      />
                    </div>
                  </td>
                  <td className="px-2 py-3 sm:px-3">
                    <div className="flex flex-col items-end gap-1.5">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-admin-ink/45 transition-colors hover:bg-admin-accent/15 hover:text-admin-accent"
                          title="Edit"
                          aria-label={`Edit ${r.title}`}
                          onClick={() => openEdit(r.id)}
                        >
                          <Pencil className="h-3.5 w-3.5" aria-hidden />
                        </button>
                        <button
                          type="button"
                          className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-admin-ink/45 transition-colors hover:bg-admin-bg hover:text-admin-ink"
                          title="View"
                          aria-label={`View ${r.title}`}
                          onClick={() => openView(r.id)}
                        >
                          <Eye className="h-3.5 w-3.5" aria-hidden />
                        </button>
                        <button
                          type="button"
                          disabled={deletingId === r.id}
                          className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-admin-ink/35 transition-colors hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
                          title="Delete"
                          aria-label={`Delete ${r.title}`}
                          onClick={() => setDeleteTarget(r)}
                        >
                          <Trash2 className="h-3.5 w-3.5" aria-hidden />
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-admin-ink/40">
                          Updated
                        </p>
                        <p className="whitespace-nowrap text-xs font-medium text-admin-ink/55">
                          {formatUpdatedAt(r.updatedAt)}
                        </p>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredRows.length === 0 ? (
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

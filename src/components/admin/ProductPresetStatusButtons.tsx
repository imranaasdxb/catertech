"use client";

import { AdminPanelModal } from "@/components/admin/AdminPanelModal";
import { admin } from "@/components/admin/adminTheme";
import { Check, ExternalLink, Loader2 } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

type PresetStatusRow = {
  id: string;
  title: string;
  sourceLabel: string;
  created: boolean;
  productId?: string | null;
  productTitle?: string | null;
};

type ModalMode = "created" | "not-created";

function presetSortLabel(preset: PresetStatusRow, mode: ModalMode) {
  if (mode === "created") {
    return preset.productTitle || preset.sourceLabel || preset.title;
  }
  return preset.sourceLabel || preset.title;
}

function sortPresetsAlphabetically(list: PresetStatusRow[], mode: ModalMode) {
  return [...list].sort((a, b) =>
    presetSortLabel(a, mode).localeCompare(presetSortLabel(b, mode), undefined, {
      sensitivity: "base",
    }),
  );
}

type Props = {
  categoryId: string;
  subCategoryId?: string;
  categoryName?: string;
  subCategoryName?: string;
};

export function ProductPresetStatusButtons({
  categoryId,
  subCategoryId = "",
  categoryName,
  subCategoryName,
}: Props) {
  const [modalMode, setModalMode] = useState<ModalMode | null>(null);
  const [presets, setPresets] = useState<PresetStatusRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const scopeLabel = [categoryName, subCategoryName].filter(Boolean).join(" › ") || "this category";

  const loadPresets = useCallback(async () => {
    if (!categoryId) {
      setPresets([]);
      return;
    }

    setLoading(true);
    setError("");

    const params = new URLSearchParams({ categoryId });
    if (subCategoryId) params.set("subCategoryId", subCategoryId);

    try {
      const res = await fetch(`/api/admin/product-presets?${params}`, { cache: "no-store" });
      if (!res.ok) throw new Error("load failed");
      const data = (await res.json()) as { presets?: PresetStatusRow[] };
      setPresets(data.presets ?? []);
    } catch {
      setPresets([]);
      setError("Could not load preset status.");
    } finally {
      setLoading(false);
    }
  }, [categoryId, subCategoryId]);

  useEffect(() => {
    if (!modalMode) return;
    void loadPresets();
  }, [loadPresets, modalMode]);

  useEffect(() => {
    if (!categoryId) return;

    const refresh = () => {
      if (modalMode) void loadPresets();
    };

    window.addEventListener("ct-product-taxonomy-updated", refresh);
    return () => window.removeEventListener("ct-product-taxonomy-updated", refresh);
  }, [categoryId, loadPresets, modalMode]);

  const createdPresets = useMemo(
    () => sortPresetsAlphabetically(
      presets.filter((preset) => preset.created),
      "created",
    ),
    [presets],
  );

  const notCreatedPresets = useMemo(
    () => sortPresetsAlphabetically(
      presets.filter((preset) => !preset.created),
      "not-created",
    ),
    [presets],
  );

  const activeList = modalMode === "created" ? createdPresets : notCreatedPresets;

  function openModal(mode: ModalMode) {
    setModalMode(mode);
  }

  function closeModal() {
    setModalMode(null);
    setError("");
  }

  if (!categoryId) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => openModal("created")}
        className="inline-flex min-h-8 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.06em] text-emerald-800 transition hover:border-emerald-300 hover:bg-emerald-100"
      >
        View created
      </button>
      <button
        type="button"
        onClick={() => openModal("not-created")}
        className="inline-flex min-h-8 items-center justify-center rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.06em] text-amber-800 transition hover:border-amber-300 hover:bg-amber-100"
      >
        Not created
      </button>

      <AdminPanelModal
        open={Boolean(modalMode)}
        title={modalMode === "created" ? "Created catalogue products" : "Presets not created yet"}
        subtitle={
          loading
            ? scopeLabel
            : `${scopeLabel} · ${modalMode === "created" ? createdPresets.length : notCreatedPresets.length} item${activeList.length === 1 ? "" : "s"}`
        }
        onClose={closeModal}
        widthClass="max-w-[min(100%-1rem,40rem)]"
      >
        <div className="rounded-[20px] border border-admin-border bg-white p-4 shadow-sm">
          {loading ? (
            <div className="flex flex-col items-center gap-3 py-12 text-admin-muted">
              <Loader2 className="size-6 animate-spin" aria-hidden />
              <p className="text-sm">Loading preset status…</p>
            </div>
          ) : error ? (
            <p className={`${admin.error} rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm`}>
              {error}
            </p>
          ) : activeList.length === 0 ? (
            <p className="rounded-xl border border-dashed border-admin-border bg-admin-bg/50 px-4 py-10 text-center text-sm text-admin-muted">
              {modalMode === "created"
                ? "No products have been created from these presets yet."
                : "Every preset in this selection already has a product."}
            </p>
          ) : (
            <ul className="max-h-[min(58vh,520px)] space-y-2 overflow-y-auto pr-1 [scrollbar-width:thin]">
              {activeList.map((preset) => (
                <li
                  key={preset.id}
                  className="rounded-xl border border-admin-border/80 bg-admin-bg/35 px-3.5 py-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-admin-ink">{preset.title}</p>
                      {preset.sourceLabel !== preset.title ? (
                        <p className="mt-0.5 truncate text-xs text-admin-muted">{preset.sourceLabel}</p>
                      ) : null}
                      {modalMode === "created" ? (
                        <p className="mt-2 text-xs leading-relaxed text-admin-ink/70">
                          Live product:{" "}
                          <span className="font-semibold text-admin-ink">
                            {preset.productTitle || preset.sourceLabel || preset.title}
                          </span>
                        </p>
                      ) : (
                        <p className="mt-2 text-xs text-admin-muted">
                          This preset is ready to create but has no product yet.
                        </p>
                      )}
                    </div>
                    <span
                      className={`inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-1 text-[10px] font-bold ${
                        modalMode === "created"
                          ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                          : "bg-amber-50 text-amber-700 ring-1 ring-amber-200"
                      }`}
                    >
                      {modalMode === "created" ? (
                        <Check size={11} strokeWidth={2.5} aria-hidden />
                      ) : (
                        <span className="size-2 rounded-full border-2 border-current" aria-hidden />
                      )}
                      {modalMode === "created" ? "Created" : "Not created"}
                    </span>
                  </div>
                  {modalMode === "created" && preset.productId ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Link
                        href={`/admin/products/${preset.productId}`}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-admin-border bg-white px-3 py-1.5 text-xs font-semibold text-admin-ink transition hover:border-admin-accent/30 hover:text-admin-accent"
                      >
                        Open in admin
                        <ExternalLink size={12} aria-hidden />
                      </Link>
                      <Link
                        href="/admin/products"
                        className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-admin-muted transition hover:text-admin-ink"
                      >
                        Products table
                      </Link>
                    </div>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </div>
      </AdminPanelModal>
    </>
  );
}

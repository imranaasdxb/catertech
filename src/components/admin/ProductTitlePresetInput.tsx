"use client";

import { admin } from "@/components/admin/adminTheme";
import {
  incrementProductTaxonomyPresetCount,
  loadProductTaxonomy,
  type TaxonomyRow,
} from "@/components/admin/ProductCategorySelects";
import type { ProductAttributeValue } from "@/lib/category-template";
import { Check, ChevronDown, Loader2, Plus, RotateCcw, Search } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type ProductPreset = {
  id: string;
  title: string;
  sourceLabel: string;
  attributes: Record<string, ProductAttributeValue>;
  created: boolean;
};

type Props = {
  categoryId: string;
  subCategoryId: string;
  categoryName?: string;
  subCategoryName?: string;
  initialTitle?: string;
  initialPresetId?: string | null;
  onPresetSelected: (attributes: Record<string, ProductAttributeValue>) => void;
  onTitleChange?: (title: string) => void;
  onPresetIdentityChange?: (presetId: string | null) => void;
  onAddCustomRequested?: () => void;
  onPresetCreated?: (selection: { categoryId: string; subCategoryId: string }) => void;
  onClearFormRequested?: () => void;
  onCustomPresetSelectionChange?: (selection: {
    categoryId: string;
    subCategoryId: string;
    categoryName: string;
    subCategoryName: string;
    hasSubcategories: boolean;
    subCategoryRequired: boolean;
  }) => void;
};

function normalizePresetTitle(value: string) {
  return value.trim().replace(/\s+/g, " ").toLowerCase();
}

export function ProductTitlePresetInput({
  categoryId,
  subCategoryId,
  categoryName,
  subCategoryName,
  initialTitle = "",
  initialPresetId = null,
  onPresetSelected,
  onTitleChange,
  onPresetIdentityChange,
  onAddCustomRequested,
  onPresetCreated,
  onClearFormRequested,
  onCustomPresetSelectionChange,
}: Props) {
  const blurTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const categoryKeyRef = useRef(`${categoryId}:${subCategoryId}`);
  const onPresetIdentityChangeRef = useRef(onPresetIdentityChange);

  useEffect(() => {
    onPresetIdentityChangeRef.current = onPresetIdentityChange;
  }, [onPresetIdentityChange]);

  const [title, setTitle] = useState(initialTitle);
  const [presets, setPresets] = useState<ProductPreset[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [taxonomy, setTaxonomy] = useState<TaxonomyRow[]>([]);
  const [presetCategoryId, setPresetCategoryId] = useState(categoryId);
  const [presetSubCategoryId, setPresetSubCategoryId] = useState(subCategoryId);
  const [savingPreset, setSavingPreset] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");
  const [saveError, setSaveError] = useState("");
  const [customPresetOpen, setCustomPresetOpen] = useState(false);
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(initialPresetId);

  const loadPresets = useCallback(
    async (
      nextCategoryId: string,
      nextSubCategoryId: string,
      onLoaded: (nextPresets: ProductPreset[]) => void
    ) => {
      if (!nextCategoryId) {
        onLoaded([]);
        return;
      }

      const params = new URLSearchParams({ categoryId: nextCategoryId });
      if (nextSubCategoryId) params.set("subCategoryId", nextSubCategoryId);

      try {
        const res = await fetch(`/api/admin/product-presets?${params}`, { cache: "no-store" });
        if (!res.ok) throw new Error("load failed");
        const data = (await res.json()) as { presets?: ProductPreset[] };
        onLoaded(data.presets ?? []);
      } catch {
        onLoaded([]);
      }
    },
    []
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTitle(initialTitle);
    setSelectedPresetId(initialPresetId);
  }, [initialPresetId, initialTitle]);

  useEffect(() => {
    if (!categoryId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPresets([]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    void loadPresets(categoryId, subCategoryId, (nextPresets) => {
      if (!cancelled) setPresets(nextPresets);
    }).finally(() => {
      if (!cancelled) setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [categoryId, loadPresets, subCategoryId]);

  useEffect(() => {
    if (!categoryId) return;

    let cancelled = false;
    const refreshPresets = () => {
      void loadPresets(categoryId, subCategoryId, (nextPresets) => {
        if (!cancelled) setPresets(nextPresets);
      });
    };

    window.addEventListener("ct-product-taxonomy-updated", refreshPresets);
    return () => {
      cancelled = true;
      window.removeEventListener("ct-product-taxonomy-updated", refreshPresets);
    };
  }, [categoryId, loadPresets, subCategoryId]);

  useEffect(() => {
    let cancelled = false;
    const loadTaxonomy = () => {
      void loadProductTaxonomy()
        .then((categories) => {
          if (!cancelled) setTaxonomy(categories);
        })
        .catch(() => {
          if (!cancelled) setTaxonomy([]);
        });
    };

    loadTaxonomy();
    window.addEventListener("ct-product-taxonomy-updated", loadTaxonomy);

    return () => {
      cancelled = true;
      window.removeEventListener("ct-product-taxonomy-updated", loadTaxonomy);
    };
  }, []);

  useEffect(() => {
    const nextKey = `${categoryId}:${subCategoryId}`;
    const categoryChanged = categoryKeyRef.current !== nextKey;
    categoryKeyRef.current = nextKey;

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPresetCategoryId(categoryId);
    setPresetSubCategoryId(subCategoryId);
    setSaveError("");
    setSaveStatus("");
    if (categoryChanged) {
      setSelectedPresetId(null);
      onPresetIdentityChangeRef.current?.(null);
    }
  }, [categoryId, subCategoryId]);

  const filtered = useMemo(() => {
    const query = title.trim().toLowerCase();
    if (!query) return presets;
    return presets.filter((preset) =>
      `${preset.title} ${preset.sourceLabel}`.toLowerCase().includes(query)
    );
  }, [presets, title]);

  const exactTitleMatch = useMemo(() => {
    if (selectedPresetId) {
      return presets.find((preset) => preset.id === selectedPresetId) ?? null;
    }

    const normalizedTitle = normalizePresetTitle(title);
    if (!normalizedTitle) return null;
    const matches = presets.filter(
      (preset) =>
        normalizePresetTitle(preset.title) === normalizedTitle ||
        normalizePresetTitle(preset.sourceLabel) === normalizedTitle
    );
    return matches.length === 1 ? matches[0] : null;
  }, [presets, selectedPresetId, title]);

  const presetSubcategories = useMemo(() => {
    return taxonomy.find((row) => row.id === presetCategoryId)?.subcategories ?? [];
  }, [presetCategoryId, taxonomy]);

  const presetCategory = useMemo(() => {
    return taxonomy.find((row) => row.id === presetCategoryId);
  }, [presetCategoryId, taxonomy]);

  const selectedCategoryProgress = useMemo(
    () => taxonomy.find((row) => row.id === categoryId),
    [categoryId, taxonomy]
  );

  const presetSubCategory = useMemo(() => {
    return presetSubcategories.find((row) => row.id === presetSubCategoryId);
  }, [presetSubCategoryId, presetSubcategories]);

  useEffect(() => {
    if (!presetSubCategoryId) return;
    if (!presetSubcategories.some((row) => row.id === presetSubCategoryId)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPresetSubCategoryId("");
    }
  }, [presetSubCategoryId, presetSubcategories]);

  useEffect(() => {
    if (!customPresetOpen) return;

    onCustomPresetSelectionChange?.({
      categoryId: presetCategoryId,
      subCategoryId: presetSubCategoryId,
      categoryName: presetCategory?.name ?? "",
      subCategoryName: presetSubCategory?.name ?? "",
      hasSubcategories: presetSubcategories.length > 0,
      subCategoryRequired: false,
    });
  }, [
    customPresetOpen,
    onCustomPresetSelectionChange,
    presetCategory?.name,
    presetCategoryId,
    presetSubCategory?.name,
    presetSubCategoryId,
    presetSubcategories.length,
  ]);

  const canSavePreset = Boolean(title.trim() && presetCategoryId && !savingPreset);

  function selectPreset(preset: ProductPreset) {
    if (preset.created && preset.id !== initialPresetId) return;
    if (blurTimer.current) clearTimeout(blurTimer.current);
    setTitle(preset.title);
    onTitleChange?.(preset.title);
    setOpen(false);
    setCustomPresetOpen(false);
    setSelectedPresetId(preset.id);
    onPresetIdentityChange?.(preset.id);
    onPresetSelected(preset.attributes);
  }

  function requestCustomPreset() {
    if (blurTimer.current) clearTimeout(blurTimer.current);
    setOpen(false);
    setCustomPresetOpen(true);
    setPresetCategoryId("");
    setPresetSubCategoryId("");
    setSaveError("");
    setSaveStatus("");
    setSelectedPresetId(null);
    onPresetIdentityChange?.(null);
    onAddCustomRequested?.();
  }

  async function addPreset() {
    const nextTitle = title.trim();
    if (!nextTitle || !presetCategoryId) return;

    setSavingPreset(true);
    setSaveError("");
    setSaveStatus("");

    const res = await fetch("/api/admin/product-presets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: nextTitle,
        categoryId: presetCategoryId,
        subCategoryId: presetSubCategoryId || null,
      }),
    });

    setSavingPreset(false);

    if (!res.ok) {
      const data = (await res.json().catch(() => ({}))) as { error?: unknown };
      setSaveError(
        typeof data.error === "string"
          ? data.error
          : "Could not save preset. Check category and try again."
      );
      return;
    }

    const data = (await res.json()) as { preset?: ProductPreset; existed?: boolean };
    if (data.preset) {
      setPresets((current) => {
        const exists = current.some((preset) => preset.id === data.preset!.id);
        return exists ? current : [data.preset!, ...current];
      });
      setSelectedPresetId(data.preset.id);
      onPresetIdentityChange?.(data.preset.id);
    }
    if (!data.existed) incrementProductTaxonomyPresetCount(presetCategoryId);
    setSaveStatus(data.existed ? "Preset already exists." : "Preset added.");
    onPresetCreated?.({
      categoryId: presetCategoryId,
      subCategoryId: presetSubCategoryId,
    });
    setOpen(false);
  }

  return (
    <div className="relative">
      <div
        className={
          customPresetOpen
            ? "grid grid-cols-1 gap-3 xl:grid-cols-[minmax(180px,1fr)_minmax(170px,220px)_minmax(160px,200px)_max-content] xl:items-end"
            : "grid grid-cols-1 gap-3"
        }
      >
        <div className="relative">
          <div className="mb-1.5 flex items-center justify-between gap-3">
            <label htmlFor="product-title" className="block text-sm font-semibold text-admin-ink">
              Title *
            </label>
            {customPresetOpen ? (
              <button
                type="button"
                onClick={onClearFormRequested}
                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-black/10 bg-white text-admin-ink/55 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition hover:border-admin-accent/30 hover:bg-admin-bg hover:text-admin-accent"
                aria-label="Clear form and choose category again"
                title="Clear form"
              >
                <RotateCcw size={15} aria-hidden="true" />
              </button>
            ) : null}
          </div>
          <div className="relative">
            <Search
              size={15}
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-admin-ink/35"
            />
            <input
              id="product-title"
              name="title"
              required
              autoComplete="off"
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
                onTitleChange?.(event.target.value);
                setSelectedPresetId(null);
                onPresetIdentityChange?.(null);
                setOpen(true);
                setSaveError("");
                setSaveStatus("");
              }}
              onFocus={() => setOpen(true)}
              onBlur={() => {
                blurTimer.current = setTimeout(() => setOpen(false), 120);
              }}
              placeholder="Type a product name or choose a preset"
              className={`${admin.fieldModern} pl-9 pr-28`}
            />
            {categoryId ? (
              <span
                className="pointer-events-none absolute right-10 top-1/2 -translate-y-1/2 text-xs font-bold tabular-nums text-admin-ink/45"
                aria-label={`${selectedCategoryProgress?.createdPresetCount ?? 0} of ${selectedCategoryProgress?.presetCount ?? 0} product title presets created`}
              >
                ({selectedCategoryProgress?.createdPresetCount ?? 0}/
                {selectedCategoryProgress?.presetCount ?? 0})
              </span>
            ) : null}
            <button
              type="button"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => setOpen((current) => !current)}
              className="absolute right-1 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-admin-ink/55 transition hover:bg-black/5 hover:text-admin-ink"
              aria-label="Show product title presets"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <ChevronDown size={17} />}
            </button>
          </div>
        </div>

        {customPresetOpen ? (
          <>
            <div>
              <label htmlFor="preset-category-id" className={admin.labelModern}>
                Preset category
              </label>
              <select
                id="preset-category-id"
                value={presetCategoryId}
                onChange={(event) => {
                  setPresetCategoryId(event.target.value);
                  setPresetSubCategoryId("");
                  setSaveError("");
                  setSaveStatus("");
                }}
                className={admin.fieldModern}
                title={
                  categoryName
                    ? `Current product category: ${categoryName}${subCategoryName ? ` / ${subCategoryName}` : ""}`
                    : undefined
                }
              >
                <option value="">-- Select --</option>
                {taxonomy.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name} ({category.createdPresetCount}/{category.presetCount})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="preset-subcategory-id" className={admin.labelModern}>
                Preset sub-category
              </label>
              <select
                id="preset-subcategory-id"
                value={presetSubCategoryId}
                disabled={!presetCategoryId}
                onChange={(event) => {
                  setPresetSubCategoryId(event.target.value);
                  setSaveError("");
                  setSaveStatus("");
                }}
                className={admin.fieldModern}
              >
                <option value="">-- Optional --</option>
                {presetSubcategories.map((subCategory) => (
                  <option key={subCategory.id} value={subCategory.id}>
                    {subCategory.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              disabled={!canSavePreset}
              onClick={() => void addPreset()}
              className={`${admin.primaryBtn} min-h-11 justify-center gap-2 whitespace-nowrap bg-admin-accent px-4 shadow-[0_8px_20px_rgba(248,121,65,0.24)] hover:bg-[#ec6326] disabled:cursor-not-allowed disabled:opacity-55`}
            >
              {savingPreset ? (
                <Loader2 size={15} className="animate-spin" />
              ) : saveStatus ? (
                <Check size={15} />
              ) : (
                <Plus size={15} />
              )}
              Save preset
            </button>
          </>
        ) : null}
      </div>

      {saveError ? <p className={`${admin.error} mt-2 text-sm`}>{saveError}</p> : null}
      {saveStatus ? (
        <p className="mt-2 text-xs font-semibold text-emerald-700">{saveStatus}</p>
      ) : null}

      {open && !loading ? (
        <div className="absolute z-30 mt-2 max-h-72 w-full overflow-y-auto rounded-xl border border-black/10 bg-white p-1.5 shadow-[0_18px_48px_rgba(0,0,0,0.14)] xl:max-w-[calc(100%-410px)]">
          {filtered.length ? (
            filtered.map((preset) => {
              const isCreatedLocked = preset.created && preset.id !== initialPresetId;
              return (
              <button
                key={preset.id}
                type="button"
                disabled={isCreatedLocked}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => selectPreset(preset)}
                className={`flex w-full items-center justify-between gap-4 rounded-lg px-3 py-2.5 text-left transition ${
                  isCreatedLocked
                    ? "cursor-not-allowed opacity-55"
                    : "hover:bg-admin-bg"
                }`}
              >
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold text-admin-ink">
                    {preset.title}
                  </span>
                  {preset.sourceLabel !== preset.title ? (
                    <span className="mt-0.5 block truncate text-xs text-admin-ink/50">
                      {preset.sourceLabel}
                    </span>
                  ) : null}
                </span>
                <span
                  className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold ${
                    preset.created
                      ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                      : "bg-amber-50 text-amber-700 ring-1 ring-amber-200"
                  }`}
                >
                  {preset.created ? (
                    <Check size={12} strokeWidth={2.5} aria-hidden />
                  ) : (
                    <span className="size-2.5 rounded-full border-2 border-current" aria-hidden />
                  )}
                  {preset.created ? "Created" : "Not created"}
                </span>
              </button>
            );
            })
          ) : (
            <p className="rounded-lg px-3 py-2.5 text-sm text-admin-ink/50">
              No matching preset.
            </p>
          )}
          {title.trim() ? (
            exactTitleMatch ? (
              exactTitleMatch.created && exactTitleMatch.id !== initialPresetId ? (
                <div className="mt-1 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-xs font-semibold text-emerald-700">
                  This title already has a product. Choose a different title or preset.
                </div>
              ) : (
                <div className="mt-1 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs font-semibold text-amber-700">
                  This title already exists. Select it from the results above.
                </div>
              )
            ) : (
              <div className="mt-1 flex items-center justify-between gap-3 rounded-lg border-t border-black/6 px-3 py-2.5">
                <p className="min-w-0 truncate text-xs text-admin-ink/50">
                  Add “{title.trim()}” as a new title
                </p>
                <button
                  type="button"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={requestCustomPreset}
                  className="inline-flex h-9 shrink-0 items-center justify-center rounded-lg bg-admin-accent px-3 text-xs font-bold text-white shadow-[0_6px_16px_rgba(248,121,65,0.22)] transition hover:bg-[#ec6326]"
                >
                  Add this
                </button>
              </div>
            )
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

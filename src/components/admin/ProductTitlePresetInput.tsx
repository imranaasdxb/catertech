"use client";

import { admin } from "@/components/admin/adminTheme";
import type { ProductAttributeValue } from "@/lib/category-template";
import { Check, ChevronDown, Loader2, Plus, RotateCcw, Search } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

type ProductPreset = {
  id: string;
  title: string;
  sourceLabel: string;
  attributes: Record<string, ProductAttributeValue>;
};

type Props = {
  categoryId: string;
  subCategoryId: string;
  categoryName?: string;
  subCategoryName?: string;
  onPresetSelected: (attributes: Record<string, ProductAttributeValue>) => void;
  onTitleChange?: (title: string) => void;
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

type TaxonomyRow = {
  id: string;
  name: string;
  subcategories: { id: string; name: string }[];
};

export function ProductTitlePresetInput({
  categoryId,
  subCategoryId,
  categoryName,
  subCategoryName,
  onPresetSelected,
  onTitleChange,
  onAddCustomRequested,
  onPresetCreated,
  onClearFormRequested,
  onCustomPresetSelectionChange,
}: Props) {
  const blurTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [title, setTitle] = useState("");
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

  useEffect(() => {
    if (!categoryId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPresets([]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    const params = new URLSearchParams({ categoryId });
    if (subCategoryId) params.set("subCategoryId", subCategoryId);

    void fetch(`/api/admin/product-presets?${params}`)
      .then(async (res) => {
        if (!res.ok) throw new Error("load failed");
        return (await res.json()) as { presets?: ProductPreset[] };
      })
      .then((data) => {
        if (!cancelled) setPresets(data.presets ?? []);
      })
      .catch(() => {
        if (!cancelled) setPresets([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [categoryId, subCategoryId]);

  useEffect(() => {
    let cancelled = false;
    void fetch("/api/admin/product-categories")
      .then(async (res) => {
        if (!res.ok) throw new Error("load failed");
        return (await res.json()) as { categories?: TaxonomyRow[] };
      })
      .then((data) => {
        if (!cancelled) setTaxonomy(data.categories ?? []);
      })
      .catch(() => {
        if (!cancelled) setTaxonomy([]);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPresetCategoryId(categoryId);
    setPresetSubCategoryId(subCategoryId);
    setSaveError("");
    setSaveStatus("");
  }, [categoryId, subCategoryId]);

  const filtered = useMemo(() => {
    const query = title.trim().toLowerCase();
    if (!query) return presets;
    return presets.filter((preset) =>
      `${preset.title} ${preset.sourceLabel}`.toLowerCase().includes(query)
    );
  }, [presets, title]);

  const presetSubcategories = useMemo(() => {
    return taxonomy.find((row) => row.id === presetCategoryId)?.subcategories ?? [];
  }, [presetCategoryId, taxonomy]);

  const presetCategory = useMemo(() => {
    return taxonomy.find((row) => row.id === presetCategoryId);
  }, [presetCategoryId, taxonomy]);

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
    if (blurTimer.current) clearTimeout(blurTimer.current);
    setTitle(preset.title);
    onTitleChange?.(preset.title);
    setOpen(false);
    setCustomPresetOpen(false);
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
    }
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
            <label htmlFor="product-title" className="block text-sm font-semibold text-[#1a1a1a]">
              Title *
            </label>
            {customPresetOpen ? (
              <button
                type="button"
                onClick={onClearFormRequested}
                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-black/10 bg-white text-[#1a1a1a]/55 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition hover:border-[#5B2D9B]/30 hover:bg-[#F5F5F7] hover:text-[#5B2D9B]"
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
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#1a1a1a]/35"
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
                setOpen(true);
                setSaveError("");
                setSaveStatus("");
              }}
              onFocus={() => setOpen(true)}
              onBlur={() => {
                blurTimer.current = setTimeout(() => setOpen(false), 120);
              }}
              placeholder="Type a product name or choose a preset"
              className={`${admin.fieldModern} pl-9 pr-11`}
            />
            <button
              type="button"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => setOpen((current) => !current)}
              className="absolute right-1 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-[#1a1a1a]/55 transition hover:bg-black/5 hover:text-[#1a1a1a]"
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
                    {category.name}
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
              className={`${admin.primaryBtn} min-h-11 justify-center gap-2 whitespace-nowrap bg-[#5B2D9B] px-4 shadow-[0_8px_20px_rgba(91,45,155,0.24)] hover:bg-[#4b2586] disabled:cursor-not-allowed disabled:opacity-55`}
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
            filtered.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => selectPreset(preset)}
                className="block w-full rounded-lg px-3 py-2.5 text-left transition hover:bg-[#F5F5F7]"
              >
                <span className="block text-sm font-semibold text-[#1a1a1a]">{preset.title}</span>
                {preset.sourceLabel !== preset.title ? (
                  <span className="mt-0.5 block text-xs text-[#1a1a1a]/50">
                    {preset.sourceLabel}
                  </span>
                ) : null}
              </button>
            ))
          ) : (
            <div className="flex items-center justify-between gap-3 rounded-lg px-3 py-2.5">
              <p className="min-w-0 text-sm text-[#1a1a1a]/50">
                No matching preset.
              </p>
              <button
                type="button"
                disabled={!title.trim()}
                onMouseDown={(event) => event.preventDefault()}
                onClick={requestCustomPreset}
                className="inline-flex h-9 shrink-0 items-center justify-center rounded-lg bg-[#5B2D9B] px-3 text-xs font-bold text-white shadow-[0_6px_16px_rgba(91,45,155,0.22)] transition hover:bg-[#4b2586] disabled:cursor-not-allowed disabled:opacity-45"
              >
                Add this
              </button>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}

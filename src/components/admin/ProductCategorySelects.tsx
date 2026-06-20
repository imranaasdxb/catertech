"use client";

import { admin } from "@/components/admin/adminTheme";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Check, ChevronDown } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export type TaxonomyRow = {
  id: string;
  name: string;
  subcategories: { id: string; name: string }[];
  presetCount: number;
  createdPresetCount: number;
};

let cachedTaxonomy: TaxonomyRow[] | null = null;
let taxonomyRequest: Promise<TaxonomyRow[]> | null = null;
let taxonomyCacheVersion = 0;

export function loadProductTaxonomy() {
  if (cachedTaxonomy) return Promise.resolve(cachedTaxonomy);
  if (taxonomyRequest) return taxonomyRequest;

  const requestVersion = taxonomyCacheVersion;
  const request = fetch("/api/admin/product-categories", { cache: "no-store" })
    .then(async (res) => {
      if (!res.ok) throw new Error("Could not load categories.");
      const data = (await res.json()) as { categories?: TaxonomyRow[] };
      const categories = data.categories ?? [];
      if (requestVersion === taxonomyCacheVersion) cachedTaxonomy = categories;
      return categories;
    })
    .finally(() => {
      if (taxonomyRequest === request) taxonomyRequest = null;
    });

  taxonomyRequest = request;
  return request;
}

export function invalidateProductTaxonomyCache() {
  taxonomyCacheVersion += 1;
  cachedTaxonomy = null;
  taxonomyRequest = null;
}

function dispatchProductTaxonomyChanged() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("ct-product-taxonomy-updated"));
  }
}

export function incrementProductTaxonomyPresetCount(categoryId: string) {
  if (!cachedTaxonomy) return;
  cachedTaxonomy = cachedTaxonomy.map((category) =>
    category.id === categoryId
      ? { ...category, presetCount: category.presetCount + 1 }
      : category
  );
  dispatchProductTaxonomyChanged();
}

export function incrementProductTaxonomyCreatedPresetCount(categoryId: string) {
  if (!cachedTaxonomy) return;
  cachedTaxonomy = cachedTaxonomy.map((category) =>
    category.id === categoryId
      ? {
          ...category,
          createdPresetCount: Math.min(
            category.createdPresetCount + 1,
            category.presetCount
          ),
        }
      : category
  );
  dispatchProductTaxonomyChanged();
}

type Props = {
  initialCategoryId?: string | null;
  initialSubCategoryId?: string | null;
  selectedCategoryId?: string | null;
  selectedSubCategoryId?: string | null;
  hint?: string;
  /** Top toolbar: category + sub-category in one row */
  layout?: "default" | "row";
  onSelectionChange?: (selection: {
    categoryId: string;
    subCategoryId: string;
    categoryName: string;
    subCategoryName: string;
    hasSubcategories: boolean;
    subCategoryRequired: boolean;
  }) => void;
};

export function notifyProductTaxonomyChanged() {
  invalidateProductTaxonomyCache();
  dispatchProductTaxonomyChanged();
}

export function ProductCategorySelects({
  initialCategoryId = null,
  initialSubCategoryId = null,
  selectedCategoryId,
  selectedSubCategoryId,
  hint,
  layout = "default",
  onSelectionChange,
}: Props) {
  const [taxonomy, setTaxonomy] = useState<TaxonomyRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadErr, setLoadErr] = useState("");
  const [categoryId, setCategoryId] = useState(initialCategoryId ?? "");
  const [subCategoryId, setSubCategoryId] = useState(initialSubCategoryId ?? "");
  const onSelectionChangeRef = useRef(onSelectionChange);

  useEffect(() => {
    onSelectionChangeRef.current = onSelectionChange;
  }, [onSelectionChange]);

  const load = useCallback(async () => {
    setLoadErr("");
    setLoading(true);
    try {
      const categories = await loadProductTaxonomy();
      setTaxonomy(categories);
    } catch {
      setLoadErr("Could not load categories.");
      setTaxonomy([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  useEffect(() => {
    const onEvt = () => void load();
    window.addEventListener("ct-product-taxonomy-updated", onEvt);
    return () => window.removeEventListener("ct-product-taxonomy-updated", onEvt);
  }, [load]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCategoryId(selectedCategoryId ?? initialCategoryId ?? "");
    setSubCategoryId(selectedSubCategoryId ?? initialSubCategoryId ?? "");
  }, [initialCategoryId, initialSubCategoryId, selectedCategoryId, selectedSubCategoryId]);

  const selectedCategory = useMemo(
    () => taxonomy.find((category) => category.id === categoryId),
    [categoryId, taxonomy]
  );
  const subs = useMemo(() => selectedCategory?.subcategories ?? [], [selectedCategory]);

  useEffect(() => {
    if (!subCategoryId) return;
    const ok = subs.some((s) => s.id === subCategoryId);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!ok) setSubCategoryId("");
  }, [subs, subCategoryId]);

  useEffect(() => {
    const category = taxonomy.find((x) => x.id === categoryId);
    const subCategory = subs.find((x) => x.id === subCategoryId);
    const hasSubcategories = subs.length > 0;
    onSelectionChangeRef.current?.({
      categoryId,
      subCategoryId,
      categoryName: category?.name ?? "",
      subCategoryName: subCategory?.name ?? "",
      hasSubcategories,
      subCategoryRequired: hasSubcategories,
    });
  }, [categoryId, subCategoryId, subs, taxonomy]);

  const isRow = layout === "row";
  const fieldGrid = isRow
    ? "flex flex-col gap-3 sm:flex-row sm:items-end"
    : "grid grid-cols-1 gap-4 sm:grid-cols-2";
  const fieldWrap = isRow ? "min-w-0 flex-1 sm:max-w-[240px]" : "";

  return (
    <div className={isRow ? "space-y-2" : "space-y-3"}>
      <input type="hidden" name="categoryId" value={categoryId} readOnly />
      <input type="hidden" name="subCategoryId" value={subCategoryId} readOnly />

      {loadErr ? (
        <p className={`${admin.error} text-sm`}>{loadErr}</p>
      ) : null}
      {loading ? (
        <p className={`${admin.hint}`}>Loading categories…</p>
      ) : (
        <div className={fieldGrid}>
          <div className={fieldWrap}>
            <label htmlFor="product-category-id" className={admin.labelModern}>
              Category
            </label>
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button
                  id="product-category-id"
                  type="button"
                  className={`${admin.fieldModern} flex items-center gap-3 text-left`}
                  aria-label="Select product category"
                >
                  <span className="min-w-0 flex-1 truncate">
                    {selectedCategory?.name ?? "— Select —"}
                  </span>
                  {selectedCategory ? (
                    <span className="shrink-0 text-xs font-bold tabular-nums text-admin-ink/50">
                      ({selectedCategory.createdPresetCount}/{selectedCategory.presetCount})
                    </span>
                  ) : null}
                  <ChevronDown size={15} className="shrink-0 text-admin-ink/45" aria-hidden />
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  align="start"
                  sideOffset={5}
                  className="z-50 min-w-[var(--radix-dropdown-menu-trigger-width)] overflow-hidden rounded-xl border border-black/10 bg-white p-1.5 shadow-[0_16px_40px_rgba(0,0,0,0.14)]"
                >
                  {taxonomy.map((category) => (
                    <DropdownMenu.Item
                      key={category.id}
                      onSelect={() => {
                        setCategoryId(category.id);
                        setSubCategoryId("");
                      }}
                      className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-admin-ink outline-none transition data-[highlighted]:bg-admin-bg"
                    >
                      <span className="min-w-0 flex-1 truncate font-semibold">
                        {category.name}
                      </span>
                      <span className="shrink-0 font-bold tabular-nums text-admin-ink/50">
                        ({category.createdPresetCount}/{category.presetCount})
                      </span>
                      <span className="grid size-4 shrink-0 place-items-center text-admin-accent">
                        {category.id === categoryId ? (
                          <Check size={13} strokeWidth={2.5} aria-hidden />
                        ) : null}
                      </span>
                    </DropdownMenu.Item>
                  ))}
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          </div>
          <div className={fieldWrap}>
            <label htmlFor="product-subcategory-id" className={admin.labelModern}>
              Sub-category
              {!isRow ? (
                subs.length === 0 ? (
                  <span className="ml-1 font-normal normal-case tracking-normal text-admin-ink/40">
                    (optional — none defined)
                  </span>
                ) : (
                  <span className="ml-1 font-normal normal-case tracking-normal text-admin-ink/40">
                    (optional)
                  </span>
                )
              ) : null}
            </label>
            <select
              id="product-subcategory-id"
              value={subCategoryId}
              disabled={!categoryId}
              onChange={(e) => setSubCategoryId(e.target.value)}
              className={admin.fieldModern}
            >
              <option value="">— Optional —</option>
              {subs.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
      {hint ? <p className={admin.hint}>{hint}</p> : null}
    </div>
  );
}

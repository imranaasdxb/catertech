"use client";

import { admin } from "@/components/admin/adminTheme";
import { useCallback, useEffect, useMemo, useState } from "react";

export type TaxonomyRow = {
  id: string;
  name: string;
  subcategories: { id: string; name: string }[];
};

type Props = {
  initialCategoryId?: string | null;
  initialSubCategoryId?: string | null;
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
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("ct-product-taxonomy-updated"));
  }
}

export function ProductCategorySelects({
  initialCategoryId = null,
  initialSubCategoryId = null,
  hint,
  layout = "default",
  onSelectionChange,
}: Props) {
  const [taxonomy, setTaxonomy] = useState<TaxonomyRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadErr, setLoadErr] = useState("");
  const [categoryId, setCategoryId] = useState(initialCategoryId ?? "");
  const [subCategoryId, setSubCategoryId] = useState(initialSubCategoryId ?? "");

  const load = useCallback(async () => {
    setLoadErr("");
    const res = await fetch("/api/admin/product-categories");
    if (!res.ok) {
      setLoadErr("Could not load categories.");
      setTaxonomy([]);
      setLoading(false);
      return;
    }
    const data = (await res.json()) as { categories?: TaxonomyRow[] };
    setTaxonomy(data.categories ?? []);
    setLoading(false);
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
    setCategoryId(initialCategoryId ?? "");
    setSubCategoryId(initialSubCategoryId ?? "");
  }, [initialCategoryId, initialSubCategoryId]);

  const subs = useMemo(() => {
    const c = taxonomy.find((x) => x.id === categoryId);
    return c?.subcategories ?? [];
  }, [taxonomy, categoryId]);

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
    onSelectionChange?.({
      categoryId,
      subCategoryId,
      categoryName: category?.name ?? "",
      subCategoryName: subCategory?.name ?? "",
      hasSubcategories,
      subCategoryRequired: hasSubcategories,
    });
  }, [categoryId, onSelectionChange, subCategoryId, subs, taxonomy]);

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
            <select
              id="product-category-id"
              value={categoryId}
              onChange={(e) => {
                setCategoryId(e.target.value);
                setSubCategoryId("");
              }}
              className={admin.fieldModern}
            >
              <option value="">— Select —</option>
              {taxonomy.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className={fieldWrap}>
            <label htmlFor="product-subcategory-id" className={admin.labelModern}>
              Sub-category
              {!isRow ? (
                subs.length === 0 ? (
                  <span className="ml-1 font-normal normal-case tracking-normal text-[#1a1a1a]/40">
                    (optional — none defined)
                  </span>
                ) : (
                  <span className="ml-1 font-normal normal-case tracking-normal text-[#1a1a1a]/40">
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

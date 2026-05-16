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
    void load();
  }, [load]);

  useEffect(() => {
    const onEvt = () => void load();
    window.addEventListener("ct-product-taxonomy-updated", onEvt);
    return () => window.removeEventListener("ct-product-taxonomy-updated", onEvt);
  }, [load]);

  useEffect(() => {
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
    if (!ok) setSubCategoryId("");
  }, [subs, subCategoryId]);

  return (
    <div className="space-y-3">
      <input type="hidden" name="categoryId" value={categoryId} readOnly />
      <input type="hidden" name="subCategoryId" value={subCategoryId} readOnly />

      {loadErr ? (
        <p className={`${admin.error} text-sm`}>{loadErr}</p>
      ) : null}
      {loading ? (
        <p className={`${admin.hint}`}>Loading categories…</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
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
              <option value="">— None —</option>
              {taxonomy.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="product-subcategory-id" className={admin.labelModern}>
              Sub-category
            </label>
            <select
              id="product-subcategory-id"
              value={subCategoryId}
              disabled={!categoryId}
              onChange={(e) => setSubCategoryId(e.target.value)}
              className={admin.fieldModern}
            >
              <option value="">— None —</option>
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

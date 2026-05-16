"use client";

import { admin, ADMIN_PURPLE } from "@/components/admin/adminTheme";
import { AdminPanelModal } from "@/components/admin/AdminPanelModal";
import { notifyProductTaxonomyChanged, type TaxonomyRow } from "@/components/admin/ProductCategorySelects";
import { ChevronDown, Loader2, Pencil, Trash2 } from "lucide-react";
import { FormEvent, useCallback, useEffect, useState } from "react";

type Props = { open: boolean; onClose: () => void };

export default function AdminProductTaxonomyModal({ open, onClose }: Props) {
  const [categories, setCategories] = useState<TaxonomyRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [newCatName, setNewCatName] = useState("");
  const [subDraft, setSubDraft] = useState<Record<string, string>>({});
  const [busyCat, setBusyCat] = useState<string | null>(null);
  const [busySub, setBusySub] = useState<string | null>(null);

  const load = useCallback(async () => {
    setErr("");
    setLoading(true);
    const res = await fetch("/api/admin/product-categories");
    setLoading(false);
    if (!res.ok) {
      setErr("Could not load master data.");
      return;
    }
    const data = (await res.json()) as { categories?: TaxonomyRow[] };
    setCategories(data.categories ?? []);
  }, []);

  useEffect(() => {
    if (open) void load();
  }, [open, load]);

  async function AddCategory(e: FormEvent) {
    e.preventDefault();
    const name = newCatName.trim();
    if (!name) return;
    const res = await fetch("/api/admin/product-categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (!res.ok) {
      const j = (await res.json().catch(() => ({}))) as { error?: unknown };
      setErr(typeof j?.error === "string" ? j.error : "Could not create category.");
      return;
    }
    setNewCatName("");
    notifyProductTaxonomyChanged();
    await load();
  }

  async function deleteCategory(id: string) {
    if (!confirm("Delete this category and all its sub-categories?")) return;
    setBusyCat(id);
    setErr("");
    const res = await fetch(`/api/admin/product-categories/${id}`, { method: "DELETE" });
    setBusyCat(null);
    if (!res.ok) {
      const j = (await res.json().catch(() => ({}))) as { error?: string };
      setErr(j?.error ?? "Delete failed.");
      return;
    }
    notifyProductTaxonomyChanged();
    await load();
  }

  async function renameCategory(id: string, current: string) {
    const next = prompt("Rename category", current)?.trim();
    if (!next || next === current) return;
    setBusyCat(id);
    const res = await fetch(`/api/admin/product-categories/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: next }),
    });
    setBusyCat(null);
    if (!res.ok) {
      const j = (await res.json().catch(() => ({}))) as { error?: string };
      setErr(j?.error ?? "Update failed.");
      return;
    }
    notifyProductTaxonomyChanged();
    await load();
  }

  async function AddSub(categoryId: string) {
    const name = (subDraft[categoryId] ?? "").trim();
    if (!name) return;
    const res = await fetch("/api/admin/product-subcategories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ categoryId, name }),
    });
    if (!res.ok) {
      const j = (await res.json().catch(() => ({}))) as { error?: string };
      setErr(j?.error ?? "Could not create sub-category.");
      return;
    }
    setSubDraft((prev) => ({ ...prev, [categoryId]: "" }));
    notifyProductTaxonomyChanged();
    await load();
  }

  async function renameSub(id: string, current: string) {
    const next = prompt("Rename sub-category", current)?.trim();
    if (!next || next === current) return;
    setBusySub(id);
    const res = await fetch(`/api/admin/product-subcategories/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: next }),
    });
    setBusySub(null);
    if (!res.ok) {
      const j = (await res.json().catch(() => ({}))) as { error?: string };
      setErr(j?.error ?? "Update failed.");
      return;
    }
    notifyProductTaxonomyChanged();
    await load();
  }

  async function deleteSub(id: string) {
    if (!confirm("Remove this sub-category?")) return;
    setBusySub(id);
    setErr("");
    const res = await fetch(`/api/admin/product-subcategories/${id}`, {
      method: "DELETE",
    });
    setBusySub(null);
    if (!res.ok) {
      const j = (await res.json().catch(() => ({}))) as { error?: string };
      setErr(j?.error ?? "Delete failed.");
      return;
    }
    notifyProductTaxonomyChanged();
    await load();
  }

  return (
    <AdminPanelModal
      open={open}
      title="Category master"
      subtitle="Add categories first; then nest sub-categories under each. Deletes are blocked while products reference a row."
      widthClass="max-w-[min(100%-1rem,46rem)]"
      onClose={onClose}
    >
      {/* Match edit-product modal footprint: predictable min-height, scroll handled by AdminPanelModal body */}
      <div className="flex min-h-[min(560px,calc(100vh-11rem))] flex-col gap-6 pb-1">
        {err ? (
          <p className={`${admin.error} rounded-xl border border-red-100 bg-red-50 px-3 py-2.5 text-sm`}>
            {err}
          </p>
        ) : null}

        <section className="shrink-0 space-y-3" aria-labelledby="taxonomy-section-categories">
          <header>
            <h3 id="taxonomy-section-categories" className={`${admin.formSectionTitle}`}>
              Categories
            </h3>
            <p className={`${admin.formSectionDesc} mb-0`}>Top-level options in the product form dropdown.</p>
          </header>

          <form
            onSubmit={(e) => void AddCategory(e)}
            className="rounded-[20px] border border-black/6 bg-white p-5 shadow-[0px_8px_32px_rgba(0,0,0,0.04)]"
          >
            <label htmlFor="taxonomy-new-category" className={admin.labelModern}>
              New category name
            </label>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:gap-3">
              <input
                id="taxonomy-new-category"
                placeholder="e.g. Kitchen equipment"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                className={`${admin.fieldModern} min-w-0 flex-1`}
              />
              <button
                type="submit"
                className={`${admin.primaryBtn} w-full shrink-0 px-6 py-3 text-sm sm:w-auto`}
                style={{ backgroundColor: ADMIN_PURPLE }}
              >
                Add category
              </button>
            </div>
          </form>
        </section>

        <section className="flex min-h-0 flex-1 flex-col gap-3" aria-labelledby="taxonomy-section-list">
          <header className="flex shrink-0 flex-wrap items-baseline gap-2">
            <h3 id="taxonomy-section-list" className={`${admin.formSectionTitle}`}>
              Your categories & sub-categories
            </h3>
            {!loading ? (
              <span className={`${admin.label} mb-0 text-[10px] normal-case tracking-normal text-[#1a1a1a]/40`}>
                {categories.length} categor{categories.length === 1 ? "y" : "ies"}
              </span>
            ) : null}
          </header>

          {loading ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded-[20px] border border-black/6 bg-[#faf8ff]/50 py-16 text-[#1a1a1a]/45">
              <Loader2 className="h-8 w-8 animate-spin text-[#5B2D9B]" aria-hidden />
              <p className="text-sm font-medium">Loading master data…</p>
            </div>
          ) : categories.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-2 rounded-[20px] border border-dashed border-black/10 bg-white/70 px-6 py-16 text-center">
              <ChevronDown className="h-10 w-10 text-[#5B2D9B]/30" aria-hidden />
              <p className={`text-sm font-semibold text-[#1a1a1a]/70`}>No categories yet</p>
              <p className={`${admin.hint} max-w-sm text-center`}>
                Use <strong className="font-semibold text-[#1a1a1a]/55">Categories</strong> above to create your first
                category. Sub-categories appear inside each category block below.
              </p>
            </div>
          ) : (
            <ul className="flex flex-1 flex-col gap-4 pb-2">
              {categories.map((c) => (
                <li
                  key={c.id}
                  className="overflow-hidden rounded-[20px] border border-black/7 bg-white shadow-[0px_6px_28px_rgba(0,0,0,0.05)]"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3 border-b border-black/6 bg-linear-to-br from-white to-[#faf8ff]/80 px-5 py-4">
                    <div className="min-w-0">
                      <p className="mb-2 flex flex-wrap items-center gap-2">
                        <span className="inline-flex shrink-0 items-center rounded-full bg-[#5B2D9B]/12 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#5B2D9B]">
                          Category
                        </span>
                        <span className="truncate text-base font-semibold tracking-tight text-[#1a1a1a]" title={c.name}>
                          {c.name}
                        </span>
                      </p>
                      <p className={`${admin.hint}`}>Sub-categories nest under this name in the shop form.</p>
                    </div>
                    <div className="flex shrink-0 items-center gap-1 self-center">
                      <button
                        type="button"
                        className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-[#5B2D9B] transition-colors hover:bg-[#5B2D9B]/12"
                        title="Rename category"
                        disabled={busyCat === c.id}
                        onClick={() => void renameCategory(c.id, c.name)}
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-red-600 transition-colors hover:bg-red-50 disabled:opacity-45"
                        title="Delete category"
                        disabled={busyCat === c.id}
                        onClick={() => void deleteCategory(c.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {/* Sub-categories nest — labelled panel */}
                  <div className="space-y-3 px-5 py-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-l-[3px] border-[#5B2D9B]/35 pl-3">
                      <h4 className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#1a1a1a]/50">
                        Sub-categories
                      </h4>
                      <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] font-semibold tabular-nums text-[#1a1a1a]/55 ring-1 ring-black/5">
                        {(c.subcategories ?? []).length} total
                      </span>
                    </div>

                    {(c.subcategories ?? []).length === 0 ? (
                      <p className={`rounded-xl border border-black/5 bg-[#f7f7f9]/70 px-3 py-2.5 text-xs ${admin.muted}`}>
                        No sub-categories yet — add one below under this category.
                      </p>
                    ) : (
                      <ul className="space-y-1.5" aria-label={`Sub-categories for ${c.name}`}>
                        {(c.subcategories ?? []).map((s) => (
                          <li
                            key={s.id}
                            className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-[#5B2D9B]/12 bg-[#faf8ff]/60 px-3 py-2.5 text-sm text-[#1a1a1a]/92"
                          >
                            <span className="flex min-w-0 items-center gap-2">
                              <span className="inline-flex shrink-0 rounded-md bg-[#5B2D9B]/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#5B2D9B]/90">
                                Sub
                              </span>
                              <span className="truncate font-medium" title={s.name}>
                                {s.name}
                              </span>
                            </span>
                            <div className="flex shrink-0 items-center gap-1">
                              <button
                                type="button"
                                className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[#5B2D9B] transition-colors hover:bg-[#5B2D9B]/10"
                                disabled={busySub === s.id}
                                onClick={() => void renameSub(s.id, s.name)}
                                title="Rename sub-category"
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </button>
                              <button
                                type="button"
                                className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-red-600 transition-colors hover:bg-red-50 disabled:opacity-45"
                                disabled={busySub === s.id}
                                onClick={() => void deleteSub(s.id)}
                                title="Remove sub-category"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}

                    <div className="border-t border-black/5 pt-3">
                      <label htmlFor={`taxonomy-sub-${c.id}`} className={admin.label}>
                        Add sub-category under “{c.name}”
                      </label>
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-2">
                        <input
                          id={`taxonomy-sub-${c.id}`}
                          placeholder="e.g. Ovens"
                          value={subDraft[c.id] ?? ""}
                          onChange={(e) => setSubDraft((p) => ({ ...p, [c.id]: e.target.value }))}
                          className={`${admin.fieldModern} min-w-0 flex-1`}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              void AddSub(c.id);
                            }
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => void AddSub(c.id)}
                          className={`${admin.secondaryBtn} w-full shrink-0 border-black/12 py-2.5 text-sm sm:w-auto`}
                        >
                          Add sub-category
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </AdminPanelModal>
  );
}

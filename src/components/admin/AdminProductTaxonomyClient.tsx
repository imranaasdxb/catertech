"use client";

import { admin, ADMIN_PURPLE } from "@/components/admin/admin-theme";
import { AdminConfirmDialog } from "@/components/admin/AdminConfirmDialog";
import { AdminProductPresetsPanel } from "@/components/admin/AdminProductPresetsPanel";
import { notifyProductTaxonomyChanged, type TaxonomyRow } from "@/components/admin/ProductCategorySelects";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ListTree,
  Loader2,
  PackageSearch,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import Link from "next/link";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";

const PAGE_SIZE = 4;

type SubFilter = "all" | "with-subs" | "without-subs";
type MasterView = "presets" | "taxonomy";

type SubRow = { id: string; name: string };

type DeleteTarget =
  | { kind: "category"; id: string; name: string }
  | { kind: "sub"; categoryId: string; id: string; name: string };

function matchesSearch(c: TaxonomyRow, q: string): boolean {
  if (!q) return true;
  const needle = q.toLowerCase();
  if (c.name.toLowerCase().includes(needle)) return true;
  return (c.subcategories ?? []).some((s) => s.name.toLowerCase().includes(needle));
}

function matchesFilter(c: TaxonomyRow, filter: SubFilter): boolean {
  const subCount = (c.subcategories ?? []).length;
  if (filter === "with-subs") return subCount > 0;
  if (filter === "without-subs") return subCount === 0;
  return true;
}

function mapCategory(row: { id: string; name: string }, subs: SubRow[] = []): TaxonomyRow {
  return {
    id: row.id,
    name: row.name,
    subcategories: subs,
    presetCount: 0,
    createdPresetCount: 0,
  };
}

export default function AdminProductTaxonomyClient() {
  const [categories, setCategories] = useState<TaxonomyRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [newCatName, setNewCatName] = useState("");
  const [newSubNames, setNewSubNames] = useState<string[]>([]);
  const [subDraft, setSubDraft] = useState<Record<string, string>>({});
  const [busyCat, setBusyCat] = useState<string | null>(null);
  const [busySub, setBusySub] = useState<string | null>(null);
  const [addingSubFor, setAddingSubFor] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [search, setSearch] = useState("");
  const [subFilter, setSubFilter] = useState<SubFilter>("all");
  const [page, setPage] = useState(0);
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);
  const [activeView, setActiveView] = useState<MasterView>("presets");

  const filteredCategories = useMemo(() => {
    const q = search.trim();
    return categories.filter((c) => matchesSearch(c, q) && matchesFilter(c, subFilter));
  }, [categories, search, subFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredCategories.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages - 1);

  const pageItems = useMemo(() => {
    const start = safePage * PAGE_SIZE;
    return filteredCategories.slice(start, start + PAGE_SIZE);
  }, [filteredCategories, safePage]);

  const rangeStart = filteredCategories.length === 0 ? 0 : safePage * PAGE_SIZE + 1;
  const rangeEnd = Math.min((safePage + 1) * PAGE_SIZE, filteredCategories.length);

  const load = useCallback(async () => {
    setErr("");
    setLoading(true);
    const res = await fetch("/api/admin/product-categories");
    setLoading(false);
    if (!res.ok) {
      setErr("Could not load categories.");
      return;
    }
    const data = (await res.json()) as { categories?: TaxonomyRow[] };
    setCategories(data.categories ?? []);
  }, []);

  useEffect(() => {
    // Initial synchronization with the Neon-backed taxonomy API.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void load();
  }, [load]);

  function upsertCategory(categoryId: string, patch: (c: TaxonomyRow) => TaxonomyRow) {
    setCategories((prev) => prev.map((c) => (c.id === categoryId ? patch(c) : c)));
  }

  async function addCategory(e: FormEvent) {
    e.preventDefault();
    const name = newCatName.trim();
    if (!name) return;

    setAdding(true);
    setErr("");
    const res = await fetch("/api/admin/product-categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    if (!res.ok) {
      const j = (await res.json().catch(() => ({}))) as { error?: unknown };
      setErr(typeof j?.error === "string" ? j.error : "Could not create category.");
      setAdding(false);
      return;
    }

    const created = (await res.json()) as { id: string; name: string };
    const subNames = newSubNames.map((s) => s.trim()).filter(Boolean);
    const createdSubs: SubRow[] = [];

    for (const subName of subNames) {
      const subRes = await fetch("/api/admin/product-subcategories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categoryId: created.id, name: subName }),
      });
      if (!subRes.ok) {
        const j = (await subRes.json().catch(() => ({}))) as { error?: string };
        setErr(j?.error ?? `Category created, but "${subName}" sub-category failed.`);
        break;
      }
      const subRow = (await subRes.json()) as { id: string; name: string };
      createdSubs.push({ id: subRow.id, name: subRow.name });
    }

    setCategories((prev) => [...prev, mapCategory(created, createdSubs)]);
    setNewCatName("");
    setNewSubNames([]);
    setAdding(false);
    notifyProductTaxonomyChanged();
  }

  async function runDeleteCategory(id: string) {
    setBusyCat(id);
    setErr("");
    const res = await fetch(`/api/admin/product-categories/${id}`, { method: "DELETE" });
    setBusyCat(null);
    if (!res.ok) {
      const j = (await res.json().catch(() => ({}))) as { error?: string };
      setErr(j?.error ?? "Delete failed.");
      throw new Error("delete failed");
    }
    setCategories((prev) => prev.filter((c) => c.id !== id));
    notifyProductTaxonomyChanged();
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
    upsertCategory(id, (c) => ({ ...c, name: next }));
    notifyProductTaxonomyChanged();
  }

  async function addSub(categoryId: string) {
    const name = (subDraft[categoryId] ?? "").trim();
    if (!name) return;

    setAddingSubFor(categoryId);
    setErr("");
    const res = await fetch("/api/admin/product-subcategories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ categoryId, name }),
    });
    setAddingSubFor(null);

    if (!res.ok) {
      const j = (await res.json().catch(() => ({}))) as { error?: string };
      setErr(j?.error ?? "Could not create sub-category.");
      return;
    }

    const row = (await res.json()) as { id: string; name: string };
    upsertCategory(categoryId, (c) => ({
      ...c,
      subcategories: [...(c.subcategories ?? []), { id: row.id, name: row.name }],
    }));
    setSubDraft((prev) => ({ ...prev, [categoryId]: "" }));
    notifyProductTaxonomyChanged();
  }

  async function renameSub(categoryId: string, id: string, current: string) {
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
    upsertCategory(categoryId, (c) => ({
      ...c,
      subcategories: (c.subcategories ?? []).map((s) => (s.id === id ? { ...s, name: next } : s)),
    }));
    notifyProductTaxonomyChanged();
  }

  async function runDeleteSub(categoryId: string, id: string) {
    setBusySub(id);
    setErr("");
    const res = await fetch(`/api/admin/product-subcategories/${id}`, { method: "DELETE" });
    setBusySub(null);
    if (!res.ok) {
      const j = (await res.json().catch(() => ({}))) as { error?: string };
      setErr(j?.error ?? "Delete failed.");
      throw new Error("delete failed");
    }
    upsertCategory(categoryId, (c) => ({
      ...c,
      subcategories: (c.subcategories ?? []).filter((s) => s.id !== id),
    }));
    notifyProductTaxonomyChanged();
  }

  function addNewSubSlot() {
    setNewSubNames((prev) => [...prev, ""]);
  }

  function updateNewSub(index: number, value: string) {
    setNewSubNames((prev) => prev.map((s, i) => (i === index ? value : s)));
  }

  function removeNewSub(index: number) {
    setNewSubNames((prev) => prev.filter((_, i) => i !== index));
  }

  const searchQuery = search.trim();

  return (
    <>
      <AdminConfirmDialog
        open={Boolean(deleteTarget)}
        title="Are you sure?"
        highlight={deleteTarget?.name}
        message={
          deleteTarget?.kind === "category"
            ? "This category and all its sub-categories will be removed. Products using it must be reassigned first."
            : "This sub-category will be removed."
        }
        onCancel={() => setDeleteTarget(null)}
        onConfirm={async () => {
          if (!deleteTarget) return;
          if (deleteTarget.kind === "category") {
            await runDeleteCategory(deleteTarget.id);
          } else {
            await runDeleteSub(deleteTarget.categoryId, deleteTarget.id);
          }
        }}
      />

      <div className={`${admin.page} min-h-full w-full px-4 py-6 md:px-8 md:py-8`}>
        <div className="mx-auto w-full max-w-7xl">
          <div className="mb-5">
            <Link
              href="/admin/products"
              className={`${admin.link} inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide`}
            >
              <ArrowLeft size={14} aria-hidden />
              Products
            </Link>
            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h1 className={admin.h1}>Category master</h1>
              <div className="flex flex-wrap items-center gap-1 border border-black/8 bg-white p-1">
                <button
                  type="button"
                  onClick={() => setActiveView("presets")}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold transition ${
                    activeView === "presets"
                      ? "bg-admin-ink text-white"
                      : "text-admin-ink/60 hover:bg-admin-bg hover:text-admin-ink"
                  }`}
                >
                  <PackageSearch className="h-3.5 w-3.5" />
                  Product presets
                </button>
                <button
                  type="button"
                  onClick={() => setActiveView("taxonomy")}
                  className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold transition ${
                    activeView === "taxonomy"
                      ? "bg-admin-ink text-white"
                      : "text-admin-ink/60 hover:bg-admin-bg hover:text-admin-ink"
                  }`}
                >
                  <ListTree className="h-3.5 w-3.5" />
                  Categories & sub-categories
                </button>
              </div>
            </div>
          </div>

          {activeView === "presets" ? (
            <AdminProductPresetsPanel categories={categories} />
          ) : (
          <div className="overflow-hidden rounded-[24px] border border-black/6 bg-white shadow-[0px_20px_64px_rgba(0,0,0,0.06)]">
            <div className="space-y-3 border-b border-black/6 bg-admin-bg/60 px-4 py-4 sm:px-6">
              <form
                onSubmit={(e) => void addCategory(e)}
                className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-end"
              >
                <div className="w-full lg:w-[200px] lg:shrink-0">
                  <label htmlFor="taxonomy-new-category" className={admin.labelModern}>
                    Category
                  </label>
                  <input
                    id="taxonomy-new-category"
                    placeholder="Furniture"
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    className={admin.fieldModern}
                  />
                </div>

                {newSubNames.map((subName, index) => (
                  <div key={`new-sub-${index}`} className="w-full lg:w-[200px] lg:shrink-0">
                    <label htmlFor={`taxonomy-new-sub-${index}`} className={admin.labelModern}>
                      Sub-category {newSubNames.length > 1 ? index + 1 : ""}
                    </label>
                    <div className="relative">
                      <input
                        id={`taxonomy-new-sub-${index}`}
                        placeholder="Tables"
                        value={subName}
                        onChange={(e) => updateNewSub(index, e.target.value)}
                        className={`${admin.fieldModern} pr-9`}
                        autoFocus={index === newSubNames.length - 1}
                      />
                      <button
                        type="button"
                        onClick={() => removeNewSub(index)}
                        className="absolute right-2 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-admin-ink/40 hover:bg-black/5 hover:text-admin-ink"
                        title="Remove"
                        aria-label={`Remove sub-category ${index + 1}`}
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={addNewSubSlot}
                  className={`${admin.secondaryBtn} w-full gap-1.5 px-4 py-3 text-sm lg:w-auto lg:shrink-0`}
                >
                  <Plus className="h-4 w-4" aria-hidden />
                  Add sub-category
                </button>

                <button
                  type="submit"
                  disabled={adding}
                  className={`${admin.primaryBtn} w-full px-5 py-3 text-sm lg:w-auto lg:shrink-0`}
                  style={{ backgroundColor: ADMIN_PURPLE }}
                >
                  {adding ? "Creating…" : "Create"}
                </button>
              </form>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative min-w-0 flex-1">
                  <Search
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-admin-ink/35"
                    aria-hidden
                  />
                  <input
                    type="search"
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setPage(0);
                    }}
                    placeholder="Search categories or sub-categories…"
                    className={`${admin.fieldModern} w-full py-2.5 pl-9 text-sm`}
                    aria-label="Search categories"
                  />
                </div>
                <div className="w-full sm:w-[180px] sm:shrink-0">
                  <label htmlFor="taxonomy-filter" className="sr-only">
                    Filter
                  </label>
                  <select
                    id="taxonomy-filter"
                    value={subFilter}
                    onChange={(e) => {
                      setSubFilter(e.target.value as SubFilter);
                      setPage(0);
                    }}
                    className={`${admin.fieldModern} w-full py-2.5 text-sm`}
                  >
                    <option value="all">All categories</option>
                    <option value="with-subs">With sub-categories</option>
                    <option value="without-subs">No sub-categories</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="px-4 py-4 sm:px-6 sm:py-5">
              {err ? (
                <p className={`${admin.error} mb-4 rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-sm`}>
                  {err}
                </p>
              ) : null}

              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-semibold text-admin-ink">
                  {loading ? "…" : `${categories.length} total`}
                  {!loading && filteredCategories.length !== categories.length ? (
                    <span className="font-normal text-admin-ink/45">
                      {" "}
                      · {filteredCategories.length} matched
                    </span>
                  ) : null}
                  {!loading && filteredCategories.length > 0 ? (
                    <span className="font-normal text-admin-ink/45">
                      {" "}
                      · showing {rangeStart}–{rangeEnd}
                    </span>
                  ) : null}
                </p>
                {!loading && filteredCategories.length > PAGE_SIZE ? (
                  <span className="text-xs font-medium text-admin-ink/40">
                    Page {safePage + 1} of {totalPages}
                  </span>
                ) : null}
              </div>

              {loading ? (
                <div className="flex min-h-[280px] items-center justify-center gap-2 text-admin-ink/45">
                  <Loader2 className="h-6 w-6 animate-spin text-admin-accent" />
                  Loading…
                </div>
              ) : filteredCategories.length === 0 ? (
                <div className="flex min-h-[280px] items-center justify-center text-sm text-admin-ink/45">
                  {categories.length === 0
                    ? "No categories yet — add one above."
                    : searchQuery || subFilter !== "all"
                      ? "No matches — try another search or filter."
                      : "No categories found."}
                </div>
              ) : (
                <>
                  <ul className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    {pageItems.map((c) => {
                      const subs = c.subcategories ?? [];
                      const visibleSubs =
                        searchQuery && !c.name.toLowerCase().includes(searchQuery.toLowerCase())
                          ? subs.filter((s) =>
                              s.name.toLowerCase().includes(searchQuery.toLowerCase())
                            )
                          : subs;

                      return (
                        <li
                          key={c.id}
                          className="flex flex-col rounded-2xl border border-black/6 bg-[#fafafa]/90"
                        >
                          <div className="flex items-start justify-between gap-2 border-b border-black/5 px-4 py-3">
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-base font-semibold text-admin-ink" title={c.name}>
                                {c.name}
                              </p>
                              <p className="mt-0.5 text-xs text-admin-ink/40">
                                {subs.length} sub-categor{subs.length === 1 ? "y" : "ies"}
                              </p>
                            </div>
                            <div className="flex shrink-0 items-center gap-0.5">
                              <button
                                type="button"
                                className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-admin-accent hover:bg-admin-accent/10"
                                disabled={busyCat === c.id}
                                onClick={() => void renameCategory(c.id, c.name)}
                                title="Rename"
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </button>
                              <button
                                type="button"
                                className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-red-600 hover:bg-red-50"
                                disabled={busyCat === c.id}
                                onClick={() =>
                                  setDeleteTarget({ kind: "category", id: c.id, name: c.name })
                                }
                                title="Delete"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>

                          <div className="flex flex-col gap-2 px-4 py-3">
                            <div className="flex items-center gap-2">
                              <span className="w-[72px] shrink-0 text-[10px] font-bold uppercase tracking-wide text-admin-accent/80">
                                Subs
                              </span>
                              <input
                                placeholder="Name"
                                value={subDraft[c.id] ?? ""}
                                onChange={(e) =>
                                  setSubDraft((p) => ({ ...p, [c.id]: e.target.value }))
                                }
                                className="min-w-0 flex-1 rounded-lg border border-black/10 bg-white px-2.5 py-1.5 text-xs text-admin-ink outline-none placeholder:text-admin-ink/35 focus:border-admin-accent/40"
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    e.preventDefault();
                                    void addSub(c.id);
                                  }
                                }}
                              />
                              <button
                                type="button"
                                disabled={addingSubFor === c.id}
                                onClick={() => void addSub(c.id)}
                                className={`${admin.secondaryBtn} h-8 shrink-0 px-2.5 py-0 text-[11px] disabled:opacity-50`}
                              >
                                {addingSubFor === c.id ? "…" : "Add"}
                              </button>
                            </div>

                            {visibleSubs.length > 0 ? (
                              <ul
                                className="max-h-[132px] space-y-1 overflow-y-auto overscroll-contain pr-0.5"
                                aria-label={`Sub-categories for ${c.name}`}
                              >
                                {visibleSubs.map((s) => (
                                  <li
                                    key={s.id}
                                    className="flex items-center justify-between gap-2 rounded-lg bg-white px-2 py-1 text-xs"
                                  >
                                    <span className="min-w-0 truncate text-admin-ink/85" title={s.name}>
                                      {s.name}
                                    </span>
                                    <div className="flex shrink-0 items-center">
                                      <button
                                        type="button"
                                        className="inline-flex h-6 w-6 items-center justify-center rounded text-admin-accent hover:bg-admin-accent/10"
                                        disabled={busySub === s.id}
                                        onClick={() => void renameSub(c.id, s.id, s.name)}
                                      >
                                        <Pencil className="h-3 w-3" />
                                      </button>
                                      <button
                                        type="button"
                                        className="inline-flex h-6 w-6 items-center justify-center rounded text-red-600 hover:bg-red-50"
                                        disabled={busySub === s.id}
                                        onClick={() =>
                                          setDeleteTarget({
                                            kind: "sub",
                                            categoryId: c.id,
                                            id: s.id,
                                            name: s.name,
                                          })
                                        }
                                      >
                                        <Trash2 className="h-3 w-3" />
                                      </button>
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-[10px] text-admin-ink/35">Optional — none yet</p>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>

                  {filteredCategories.length > PAGE_SIZE ? (
                    <div className="mt-5 flex items-center justify-between gap-3 border-t border-black/6 pt-4">
                      <button
                        type="button"
                        disabled={safePage <= 0}
                        onClick={() => setPage((p) => Math.max(0, p - 1))}
                        className={`${admin.secondaryBtn} gap-1.5 px-4 py-2.5 text-sm disabled:opacity-40`}
                      >
                        <ChevronLeft className="h-4 w-4" aria-hidden />
                        Back
                      </button>
                      <span className="text-xs font-semibold tabular-nums text-admin-ink/45">
                        {safePage + 1} / {totalPages}
                      </span>
                      <button
                        type="button"
                        disabled={safePage >= totalPages - 1}
                        onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                        className={`${admin.secondaryBtn} gap-1.5 px-4 py-2.5 text-sm disabled:opacity-40`}
                      >
                        Next
                        <ChevronRight className="h-4 w-4" aria-hidden />
                      </button>
                    </div>
                  ) : null}
                </>
              )}
            </div>
          </div>
          )}
        </div>
      </div>
    </>
  );
}

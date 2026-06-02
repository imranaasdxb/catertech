"use client";

import { admin } from "@/components/admin/adminTheme";
import type { TaxonomyRow } from "@/components/admin/ProductCategorySelects";
import type {
  ProductAttributeValue,
  TemplateFieldDef,
} from "@/lib/category-template";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Pencil,
  Plus,
  Search,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const PAGE_SIZE = 20;

type PresetRow = {
  id: string;
  categoryId: string;
  subCategoryId: string | null;
  title: string;
  sourceLabel: string;
  attributes: Record<string, ProductAttributeValue>;
  categoryName: string;
  subCategoryName: string | null;
};

type EditDraft = {
  id: string;
  title: string;
  attributes: Record<string, ProductAttributeValue>;
};

type Pagination = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

type CategoryCount = {
  categoryId: string;
  categoryName: string;
  count: number;
};

const EMPTY_PAGINATION: Pagination = {
  page: 1,
  pageSize: PAGE_SIZE,
  total: 0,
  totalPages: 1,
};

function fieldLabel(key: string) {
  return key.replace(/_/g, " ");
}

function formatAttribute(value: ProductAttributeValue) {
  if (typeof value === "string") return value || "Not set";
  return `${value.value || "Not set"}${value.unit ? ` ${value.unit}` : ""}`;
}

function readAttribute(value: ProductAttributeValue | undefined) {
  if (typeof value === "string") return { value, unit: "" };
  return { value: value?.value ?? "", unit: value?.unit ?? "" };
}

function cloneAttributes(attributes: Record<string, ProductAttributeValue>) {
  return Object.fromEntries(
    Object.entries(attributes).map(([key, value]) => [
      key,
      typeof value === "string" ? value : { ...value },
    ])
  );
}

export function AdminProductPresetsPanel({
  categories,
}: {
  categories: TaxonomyRow[];
}) {
  const [rows, setRows] = useState<PresetRow[]>([]);
  const [pagination, setPagination] = useState(EMPTY_PAGINATION);
  const [categoryCounts, setCategoryCounts] = useState<CategoryCount[]>([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [subCategoryId, setSubCategoryId] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [editDraft, setEditDraft] = useState<EditDraft | null>(null);
  const [templateFields, setTemplateFields] = useState<TemplateFieldDef[]>([]);
  const [loadingTemplate, setLoadingTemplate] = useState(false);
  const [saving, setSaving] = useState(false);

  const selectedCategory = useMemo(
    () => categories.find((category) => category.id === categoryId),
    [categories, categoryId]
  );
  const subcategories = selectedCategory?.subcategories ?? [];

  useEffect(() => {
    const timer = setTimeout(() => {
      const nextSearch = search.trim();
      if (nextSearch !== debouncedSearch) {
        setLoading(true);
        setPage(1);
        setDebouncedSearch(nextSearch);
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [debouncedSearch, search]);

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams({
      mode: "manage",
      page: String(page),
      pageSize: String(PAGE_SIZE),
    });
    if (categoryId) params.set("categoryId", categoryId);
    if (subCategoryId) params.set("subCategoryId", subCategoryId);
    if (debouncedSearch) params.set("search", debouncedSearch);

    void fetch(`/api/admin/product-presets?${params}`, {
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) throw new Error("Could not load product presets.");
        return (await response.json()) as {
          presets?: PresetRow[];
          pagination?: Pagination;
          categoryCounts?: CategoryCount[];
        };
      })
      .then((data) => {
        setRows(data.presets ?? []);
        setPagination(data.pagination ?? EMPTY_PAGINATION);
        setCategoryCounts(data.categoryCounts ?? []);
      })
      .catch((error: unknown) => {
        if ((error as { name?: string }).name !== "AbortError") {
          setErr("Could not load product presets.");
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [categoryId, debouncedSearch, page, subCategoryId]);

  function startEdit(row: PresetRow) {
    setEditDraft({
      id: row.id,
      title: row.title,
      attributes: cloneAttributes(row.attributes),
    });
    setTemplateFields([]);
    setLoadingTemplate(true);

    const params = new URLSearchParams({ categoryId: row.categoryId });
    if (row.subCategoryId) params.set("subCategoryId", row.subCategoryId);
    void fetch(`/api/admin/category-templates?${params}`)
      .then(async (response) => {
        if (!response.ok) throw new Error("Could not load fields.");
        return (await response.json()) as { fields?: TemplateFieldDef[] };
      })
      .then((data) => setTemplateFields(data.fields ?? []))
      .catch(() => setTemplateFields([]))
      .finally(() => setLoadingTemplate(false));
  }

  function updateAttribute(key: string, value: ProductAttributeValue) {
    setEditDraft((current) =>
      current
        ? {
            ...current,
            attributes: { ...current.attributes, [key]: value },
          }
        : current
    );
  }

  function removeAttribute(key: string) {
    setEditDraft((current) => {
      if (!current) return current;
      const attributes = { ...current.attributes };
      delete attributes[key];
      return { ...current, attributes };
    });
  }

  function addAttribute(key: string) {
    const field = templateFields.find((item) => item.key === key);
    if (!field) return;
    updateAttribute(key, field.type === "dimension" ? { value: "", unit: "" } : "");
  }

  async function saveEdit() {
    if (!editDraft?.title.trim()) return;
    setSaving(true);
    setErr("");
    const response = await fetch(`/api/admin/product-presets/${editDraft.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: editDraft.title.trim(),
        attributes: editDraft.attributes,
      }),
    });
    setSaving(false);
    if (!response.ok) {
      setErr("Could not save preset changes.");
      return;
    }

    const updated = (await response.json()) as Pick<
      PresetRow,
      "id" | "title" | "attributes"
    >;
    setRows((current) =>
      current.map((row) => (row.id === updated.id ? { ...row, ...updated } : row))
    );
    setEditDraft(null);
    setTemplateFields([]);
  }

  const unusedFields = useMemo(() => {
    if (!editDraft) return [];
    return templateFields.filter((field) => !(field.key in editDraft.attributes));
  }, [editDraft, templateFields]);

  function selectCategoryChip(nextCategoryId: string) {
    setLoading(true);
    setErr("");
    setCategoryId(nextCategoryId);
    setSubCategoryId("");
    setPage(1);
  }

  return (
    <section className="overflow-hidden border border-black/6 bg-white">
      <div className="flex flex-col gap-3 border-b border-black/6 bg-[#F5F5F7]/60 px-4 py-4 sm:px-6 lg:flex-row lg:items-center">
        <div className="relative min-w-0 flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#1a1a1a]/35"
            aria-hidden
          />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search product preset titles..."
            className={`${admin.fieldModern} py-2.5 pl-9 text-sm`}
            aria-label="Search product preset titles"
          />
        </div>
        <select
          value={categoryId}
          onChange={(event) => {
            setLoading(true);
            setErr("");
            setCategoryId(event.target.value);
            setSubCategoryId("");
            setPage(1);
          }}
          className={`${admin.fieldModern} py-2.5 text-sm lg:w-[220px]`}
          aria-label="Filter product presets by category"
        >
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <select
          value={subCategoryId}
          onChange={(event) => {
            setLoading(true);
            setErr("");
            setSubCategoryId(event.target.value);
            setPage(1);
          }}
          disabled={!categoryId || subcategories.length === 0}
          className={`${admin.fieldModern} py-2.5 text-sm disabled:bg-[#F5F5F7] disabled:text-[#1a1a1a]/35 lg:w-[220px]`}
          aria-label="Filter product presets by sub-category"
        >
          <option value="">All sub-categories</option>
          {subcategories.map((subcategory) => (
            <option key={subcategory.id} value={subcategory.id}>
              {subcategory.name}
            </option>
          ))}
        </select>
      </div>
      <div className="overflow-x-auto border-b border-black/6 bg-white px-3 py-2.5 [scrollbar-color:rgba(26,26,26,0.22)_transparent] [scrollbar-width:thin] sm:px-4 [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-black/20 [&::-webkit-scrollbar-track]:bg-transparent">
        <div className="flex min-w-max items-center gap-1.5">
          <button
            type="button"
            onClick={() => selectCategoryChip("")}
            className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1.5 text-[11px] font-semibold transition ${
              categoryId === ""
                ? "border-[#1a1a1a] bg-[#1a1a1a] text-white"
                : "border-black/10 bg-white text-[#1a1a1a]/65 hover:border-black/25 hover:text-[#1a1a1a]"
            }`}
          >
            <span>All</span>
            <span className={categoryId === "" ? "text-white/70" : "text-[#1a1a1a]/38"}>
              {categoryCounts.reduce((total, category) => total + category.count, 0)}
            </span>
          </button>
          {categoryCounts.map((category) => {
            const active = category.categoryId === categoryId;
            return (
              <button
                key={category.categoryId}
                type="button"
                onClick={() => selectCategoryChip(category.categoryId)}
                className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1.5 text-[11px] font-semibold transition ${
                  active
                    ? "border-[#1a1a1a] bg-[#1a1a1a] text-white"
                    : "border-black/10 bg-white text-[#1a1a1a]/65 hover:border-black/25 hover:text-[#1a1a1a]"
                }`}
              >
                <span>{category.categoryName}</span>
                <span className={active ? "text-white/70" : "text-[#1a1a1a]/38"}>
                  {category.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {err ? (
        <p className="border-b border-red-100 bg-red-50 px-4 py-2 text-sm text-red-600 sm:px-6">
          {err}
        </p>
      ) : null}

      <div className="flex items-center justify-between gap-3 border-b border-black/6 px-4 py-3 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-[#1a1a1a]/45">
          {loading ? "Loading..." : `${pagination.total} product presets`}
        </p>
        <p className="text-xs font-medium tabular-nums text-[#1a1a1a]/40">
          Page {pagination.page} of {pagination.totalPages}
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1080px] table-fixed text-left text-sm">
          <thead className="border-b border-black/6 bg-[#F5F5F7]/75">
            <tr>
              <th className="w-[58px] px-3 py-3 text-center text-xs font-semibold uppercase tracking-wide text-[#1a1a1a]/45">
                S.N
              </th>
              <th className="w-[220px] px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[#1a1a1a]/45 sm:px-6">
                Title
              </th>
              <th className="w-[180px] px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[#1a1a1a]/45">
                Category
              </th>
              <th className="w-[180px] px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[#1a1a1a]/45">
                Sub-category
              </th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[#1a1a1a]/45">
                Specifications
              </th>
              <th className="w-[96px] px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-[#1a1a1a]/45">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="h-64 text-center text-[#1a1a1a]/45">
                  <Loader2 className="mx-auto h-5 w-5 animate-spin" aria-label="Loading" />
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="h-64 text-center text-sm text-[#1a1a1a]/45">
                  No product presets match these filters.
                </td>
              </tr>
            ) : (
              rows.map((row, index) => {
                const isEditing = editDraft?.id === row.id;
                const attributes = isEditing ? editDraft.attributes : row.attributes;
                const fieldMap = new Map(templateFields.map((field) => [field.key, field]));

                return (
                  <tr
                    key={row.id}
                    className="group border-b border-black/6 align-top transition-colors last:border-b-0 hover:bg-[#F5F5F7]/50"
                  >
                    <td className="px-3 py-4 text-center text-xs font-semibold tabular-nums text-[#1a1a1a]/40">
                      {(pagination.page - 1) * pagination.pageSize + index + 1}
                    </td>
                    <td className="px-4 py-4 sm:px-6">
                      {isEditing ? (
                        <input
                          value={editDraft.title}
                          onChange={(event) =>
                            setEditDraft((current) =>
                              current ? { ...current, title: event.target.value } : current
                            )
                          }
                          className={`${admin.fieldModern} px-3 py-2 text-sm`}
                          aria-label="Preset title"
                        />
                      ) : (
                        <span className="font-semibold text-[#1a1a1a]">{row.title}</span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-sm text-[#1a1a1a]/70">{row.categoryName}</td>
                    <td className="px-4 py-4 text-sm text-[#1a1a1a]/55">
                      {row.subCategoryName ?? "—"}
                    </td>
                    <td className="px-4 py-4">
                      {isEditing ? (
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-2 xl:grid-cols-3">
                            {Object.entries(attributes).map(([key, raw]) => {
                              const field = fieldMap.get(key);
                              const value = readAttribute(raw);
                              const isDimension =
                                field?.type === "dimension" || typeof raw === "object";
                              return (
                                <div key={key} className="border-b border-black/8 pb-2">
                                  <div className="mb-1 flex items-center justify-between gap-1">
                                    <label className="text-[10px] font-bold uppercase tracking-wide text-[#1a1a1a]/45">
                                      {field?.label ?? fieldLabel(key)}
                                    </label>
                                    <button
                                      type="button"
                                      onClick={() => removeAttribute(key)}
                                      className="grid h-5 w-5 place-items-center text-[#1a1a1a]/35 hover:text-red-600"
                                      title={`Remove ${field?.label ?? fieldLabel(key)}`}
                                    >
                                      <X className="h-3 w-3" />
                                    </button>
                                  </div>
                                  {isDimension ? (
                                    <div className="flex gap-1">
                                      <input
                                        value={value.value}
                                        onChange={(event) =>
                                          updateAttribute(key, {
                                            value: event.target.value,
                                            unit: value.unit,
                                          })
                                        }
                                        className="min-w-0 flex-1 border border-black/10 bg-white px-2 py-1.5 text-xs outline-none focus:border-black/35"
                                        aria-label={`${field?.label ?? fieldLabel(key)} value`}
                                      />
                                      <select
                                        value={value.unit}
                                        onChange={(event) =>
                                          updateAttribute(key, {
                                            value: value.value,
                                            unit: event.target.value,
                                          })
                                        }
                                        className="w-[70px] border border-black/10 bg-white px-1 py-1.5 text-xs outline-none focus:border-black/35"
                                        aria-label={`${field?.label ?? fieldLabel(key)} unit`}
                                      >
                                        <option value="">Unit</option>
                                        {(field?.unitOptions ?? ["mm", "cm", "m", "ft"]).map(
                                          (unit) => (
                                            <option key={unit} value={unit}>
                                              {unit}
                                            </option>
                                          )
                                        )}
                                      </select>
                                    </div>
                                  ) : (
                                    <input
                                      value={value.value}
                                      onChange={(event) => updateAttribute(key, event.target.value)}
                                      className="w-full border border-black/10 bg-white px-2 py-1.5 text-xs outline-none focus:border-black/35"
                                      aria-label={field?.label ?? fieldLabel(key)}
                                    />
                                  )}
                                </div>
                              );
                            })}
                          </div>
                          {loadingTemplate ? (
                            <p className="flex items-center gap-1 text-xs text-[#1a1a1a]/40">
                              <Loader2 className="h-3 w-3 animate-spin" />
                              Loading available fields...
                            </p>
                          ) : unusedFields.length ? (
                            <label className="relative inline-flex items-center gap-1.5 text-xs font-semibold text-[#1a1a1a]/65">
                              <Plus className="h-3.5 w-3.5" />
                              Add field
                              <select
                                value=""
                                onChange={(event) => addAttribute(event.target.value)}
                                className="absolute inset-0 cursor-pointer opacity-0"
                                aria-label="Add specification field"
                              >
                                <option value="">Choose field</option>
                                {unusedFields.map((field) => (
                                  <option key={field.key} value={field.key}>
                                    {field.label}
                                  </option>
                                ))}
                              </select>
                            </label>
                          ) : null}
                        </div>
                      ) : Object.keys(attributes).length ? (
                        <div className="flex flex-wrap gap-x-4 gap-y-1.5">
                          {Object.entries(attributes).map(([key, value]) => (
                            <span key={key} className="text-xs text-[#1a1a1a]/65">
                              <strong className="font-semibold capitalize text-[#1a1a1a]/45">
                                {fieldLabel(key)}:
                              </strong>{" "}
                              {formatAttribute(value)}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs text-[#1a1a1a]/35">No saved specifications</span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex justify-end gap-1">
                        {isEditing ? (
                          <>
                            <button
                              type="button"
                              disabled={saving}
                              onClick={() => void saveEdit()}
                              className="grid h-8 w-8 place-items-center text-emerald-700 hover:bg-emerald-50 disabled:opacity-40"
                              title="Save preset"
                              aria-label="Save preset"
                            >
                              {saving ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Check className="h-4 w-4" />
                              )}
                            </button>
                            <button
                              type="button"
                              disabled={saving}
                              onClick={() => setEditDraft(null)}
                              className="grid h-8 w-8 place-items-center text-[#1a1a1a]/55 hover:bg-black/5"
                              title="Cancel editing"
                              aria-label="Cancel editing"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </>
                        ) : (
                          <button
                            type="button"
                            onClick={() => startEdit(row)}
                            className="grid h-8 w-8 place-items-center text-[#1a1a1a]/45 opacity-60 transition hover:bg-black/5 hover:text-[#1a1a1a] group-hover:opacity-100"
                            title="Edit preset"
                            aria-label={`Edit ${row.title}`}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-black/6 px-4 py-3 sm:px-6">
        <button
          type="button"
          disabled={page <= 1 || loading}
          onClick={() => {
            setLoading(true);
            setPage((current) => Math.max(1, current - 1));
          }}
          className={`${admin.secondaryBtn} gap-1.5 px-3 py-2 text-xs disabled:opacity-40`}
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          Back
        </button>
        <span className="text-xs font-semibold tabular-nums text-[#1a1a1a]/45">
          {pagination.total === 0
            ? "0 rows"
            : `${(pagination.page - 1) * pagination.pageSize + 1}–${Math.min(
                pagination.page * pagination.pageSize,
                pagination.total
              )} of ${pagination.total}`}
        </span>
        <button
          type="button"
          disabled={page >= pagination.totalPages || loading}
          onClick={() => {
            setLoading(true);
            setPage((current) => current + 1);
          }}
          className={`${admin.secondaryBtn} gap-1.5 px-3 py-2 text-xs disabled:opacity-40`}
        >
          Next
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </section>
  );
}

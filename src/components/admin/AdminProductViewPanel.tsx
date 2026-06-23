"use client";

import { ADMIN_PURPLE, admin } from "@/components/admin/adminTheme";
import { products } from "@/db/schema";
import type { ProductAttributeValue, TemplateFieldDef } from "@/lib/category-template";
import type { InferSelectModel } from "drizzle-orm";
import {
  Check,
  ExternalLink,
  FileText,
  Globe,
  Hash,
  ImageIcon,
  Loader2,
  Package,
  Pencil,
  Search,
  Sparkles,
  Tag,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type ProductRow = InferSelectModel<typeof products>;

function formatDate(value: Date | string | null | undefined) {
  if (!value) return "—";
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatDateTime(value: Date | string | null | undefined) {
  if (!value) return "—";
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatAttrValue(raw: ProductAttributeValue | undefined): string {
  if (raw == null || raw === "") return "—";
  if (typeof raw === "string") return raw;
  const v = raw.value?.trim();
  if (!v) return "—";
  return raw.unit ? `${v} ${raw.unit}` : v;
}

function Flag({
  on,
  onLabel,
  offLabel,
  tone,
}: {
  on: boolean;
  onLabel: string;
  offLabel: string;
  tone: "green" | "amber" | "blue";
}) {
  const tones = {
    green: on ? "bg-emerald-50 text-emerald-700 ring-emerald-200/80" : "bg-gray-50 text-gray-500 ring-gray-200/80",
    amber: on ? "bg-amber-50 text-amber-800 ring-amber-200/80" : "bg-gray-50 text-gray-500 ring-gray-200/80",
    blue: on ? "bg-sky-50 text-sky-700 ring-sky-200/80" : "bg-red-50 text-red-600 ring-red-200/80",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-semibold uppercase tracking-wide ring-1 sm:text-[11px] ${tones[tone]}`}
    >
      {on ? <Check className="h-3 w-3 shrink-0" strokeWidth={2.5} aria-hidden /> : <X className="h-3 w-3 shrink-0" strokeWidth={2.5} aria-hidden />}
      {on ? onLabel : offLabel}
    </span>
  );
}

function Cell({ label, value, mono }: { label: string; value: React.ReactNode; mono?: boolean }) {
  return (
    <div className="min-w-0 rounded-lg border border-black/6 bg-white px-2.5 py-2 sm:px-3 sm:py-2.5">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-admin-ink/40">{label}</p>
      <p className={`mt-0.5 text-xs font-medium text-admin-ink sm:text-[13px] ${mono ? "break-all font-mono" : "truncate"}`}>
        {value}
      </p>
    </div>
  );
}

export default function AdminProductViewPanel({
  product,
  onEdit,
}: {
  product: ProductRow;
  onEdit?: () => void;
}) {
  const [templateFields, setTemplateFields] = useState<TemplateFieldDef[]>([]);
  const [templateLoading, setTemplateLoading] = useState(Boolean(product.categoryId));
  const [templateErr, setTemplateErr] = useState("");

  useEffect(() => {
    if (!product.categoryId) {
      setTemplateFields([]);
      setTemplateLoading(false);
      return;
    }

    let cancelled = false;
    setTemplateLoading(true);
    setTemplateErr("");

    const params = new URLSearchParams({ categoryId: product.categoryId });
    if (product.subCategoryId) params.set("subCategoryId", product.subCategoryId);

    void fetch(`/api/admin/category-templates?${params}`)
      .then(async (res) => {
        if (!res.ok) throw new Error("load failed");
        const data = (await res.json()) as { fields?: TemplateFieldDef[] };
        if (!cancelled) setTemplateFields(data.fields ?? []);
      })
      .catch(() => {
        if (!cancelled) setTemplateErr("Could not load specs.");
      })
      .finally(() => {
        if (!cancelled) setTemplateLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [product.categoryId, product.subCategoryId]);

  const attrs = product.attributes ?? {};
  const templateKeys = new Set(templateFields.map((f) => f.key));

  const specRows = useMemo(() => {
    const fromTemplate = templateFields.map((field) => ({
      key: field.key,
      label: field.label,
      value: formatAttrValue(attrs[field.key]),
    }));
    const extras = Object.entries(attrs)
      .filter(([key]) => !templateKeys.has(key) && key !== "additional_details")
      .map(([key, value]) => ({
        key,
        label: key.replace(/_/g, " "),
        value: formatAttrValue(value),
      }));
    return [...fromTemplate, ...extras].filter((row) => row.value !== "—");
  }, [templateFields, attrs, templateKeys]);

  const categoryParts = product.category?.split(" › ") ?? [];
  const categoryName = categoryParts[0] ?? "Uncategorised";
  const subCategoryName = categoryParts.length > 1 ? categoryParts.slice(1).join(" › ") : null;
  const images = product.images ?? [];
  const keywords = product.searchKeywords?.filter(Boolean) ?? [];
  const hasDescription = Boolean(product.description?.trim());

  return (
    <div className="grid items-start gap-3 sm:gap-3.5 lg:grid-cols-12 lg:items-stretch lg:gap-4">
      {/* Identity + status band */}
      <div className="overflow-hidden rounded-xl border border-black/[0.07] bg-white lg:col-span-12">
        <div className="grid gap-3 p-3 sm:grid-cols-[64px_minmax(0,1fr)] sm:items-center sm:gap-4 sm:p-4 lg:grid-cols-[72px_minmax(0,1fr)_auto] xl:grid-cols-[80px_minmax(0,1fr)_minmax(220px,280px)]">
          <div className="mx-auto h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-admin-bg ring-1 ring-black/6 sm:mx-0 sm:h-[72px] sm:w-[72px]">
            {images[0] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={images[0]} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-admin-ink/25">
                <Package className="h-7 w-7" aria-hidden />
              </div>
            )}
          </div>

          <div className="min-w-0 text-center sm:text-left">
            <h3 className="truncate text-base font-bold tracking-tight text-admin-ink sm:text-lg">
              {product.title}
            </h3>
            <p className="mt-0.5 break-all font-mono text-[11px] text-admin-ink/45 sm:text-xs">{product.productId}</p>
            <p className="mt-0.5 truncate font-mono text-[11px] text-admin-ink/35 sm:text-xs">/{product.slug}</p>
            <div className="mt-2 flex flex-wrap items-center justify-center gap-1.5 sm:justify-start">
              <span className="inline-flex items-center gap-1 rounded-md bg-admin-accent/10 px-2 py-0.5 text-[10px] font-semibold text-admin-accent sm:text-[11px]">
                <Tag className="h-3 w-3" aria-hidden />
                {categoryName}
              </span>
              {subCategoryName ? (
                <span className="rounded-md bg-admin-bg px-2 py-0.5 text-[10px] font-medium text-admin-ink/60 ring-1 ring-black/6 sm:text-[11px]">
                  {subCategoryName}
                </span>
              ) : null}
            </div>
          </div>

          <div className="flex flex-col gap-2 border-t border-black/6 pt-3 sm:col-span-2 sm:border-t-0 sm:pt-0 lg:col-span-1 lg:border-l lg:border-t-0 lg:pl-4 lg:pt-0">
            <div className="flex flex-wrap justify-center gap-1.5 lg:justify-end">
              <Flag on={product.published} onLabel="Live" offLabel="Draft" tone="green" />
              <Flag on={product.isFeatured} onLabel="Featured" offLabel="Standard" tone="amber" />
              <Flag on={product.isAvailable} onLabel="Available" offLabel="Unavailable" tone="blue" />
            </div>
            <div className="grid grid-cols-2 gap-2 text-center lg:text-right">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-admin-ink/40">Created</p>
                <p className="text-[11px] font-medium text-admin-ink/70">{formatDate(product.createdAt)}</p>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-admin-ink/40">Updated</p>
                <p className="text-[11px] font-medium text-admin-ink/70">{formatDate(product.updatedAt)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery strip */}
      <div className="rounded-xl border border-black/[0.07] bg-white p-3 sm:p-3.5 lg:col-span-5 xl:col-span-4">
        <div className="mb-2 flex items-center justify-between gap-2">
          <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-admin-ink/55">
            <ImageIcon className="h-3.5 w-3.5 text-admin-accent" aria-hidden />
            Gallery
          </p>
          <span
            className="rounded-full px-2 py-0.5 text-[10px] font-bold tabular-nums text-white"
            style={{ backgroundColor: ADMIN_PURPLE }}
          >
            {images.length}
          </span>
        </div>
        {images.length ? (
          <div className="flex gap-2 overflow-x-auto pb-0.5">
            {images.map((src, idx) => (
              <a
                key={`${src}-${idx}`}
                href={src}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative h-14 w-14 shrink-0 overflow-hidden rounded-lg ring-1 ring-black/8 sm:h-16 sm:w-16"
                title={`Open image ${idx + 1}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" className="h-full w-full object-cover transition group-hover:scale-105" />
                <span className="absolute inset-x-0 bottom-0 bg-black/50 py-0.5 text-center text-[9px] font-semibold text-white">
                  {idx + 1}
                </span>
              </a>
            ))}
          </div>
        ) : (
          <p className="rounded-lg border border-dashed border-black/10 py-5 text-center text-xs text-admin-ink/40">
            No images uploaded
          </p>
        )}
      </div>

      {/* Quick facts */}
      <div className="rounded-xl border border-black/[0.07] bg-white p-3 sm:p-3.5 lg:col-span-7 xl:col-span-8">
        <p className="mb-2 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-admin-ink/55">
          <Sparkles className="h-3.5 w-3.5 text-admin-accent" aria-hidden />
          Quick facts
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-4">
          <Cell label="Product ID" value={product.productId} mono />
          <Cell label="Photos" value={images.length} />
          <Cell label="Keywords" value={keywords.length || "—"} />
          <Cell label="Last edit" value={formatDateTime(product.updatedAt)} mono />
        </div>
      </div>

      {/* Left: specs + description stack | Right: SEO full height */}
      <div className="flex h-full flex-col gap-3 sm:gap-3.5 lg:col-span-7 lg:min-w-0">
        {/* Specifications — height fits content */}
        <div className="rounded-xl border border-black/[0.07] bg-white p-3 sm:p-3.5">
          <p className="mb-2 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-admin-ink/55">
            <Package className="h-3.5 w-3.5 text-admin-accent" aria-hidden />
            Specifications
          </p>
          {templateLoading ? (
            <div className="flex items-center gap-2 py-4 text-xs text-admin-ink/45">
              <Loader2 className="h-4 w-4 animate-spin text-admin-accent" aria-hidden />
              Loading specs…
            </div>
          ) : templateErr ? (
            <p className="py-3 text-xs text-red-600">{templateErr}</p>
          ) : specRows.length ? (
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {specRows.map((row) => (
                <Cell key={row.key} label={row.label} value={row.value} />
              ))}
            </div>
          ) : (
            <p className="rounded-lg border border-dashed border-black/10 py-4 text-center text-xs text-admin-ink/40">
              No specifications saved
            </p>
          )}
        </div>

        {/* Description — real HTML, below specs */}
        <div className="flex flex-1 flex-col rounded-xl border border-black/[0.07] bg-white p-3 sm:p-3.5">
          <p className="mb-2 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-admin-ink/55">
            <FileText className="h-3.5 w-3.5 text-admin-accent" aria-hidden />
            Description
          </p>
          {hasDescription ? (
            <div
              className="prose prose-sm max-w-none flex-1 text-sm leading-relaxed text-admin-ink/85 [&_img]:max-w-full [&_li]:my-0.5 [&_p]:my-1.5 [&_ul]:my-1.5 [&_video]:max-w-full"
              dangerouslySetInnerHTML={{ __html: product.description! }}
            />
          ) : (
            <p className="text-xs text-admin-ink/40">No description provided.</p>
          )}
          {product.published ? (
            <div className="mt-4 border-t border-black/6 pt-3">
              <a
                href={`/shop/${product.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg bg-admin-accent/10 px-3 py-2 text-[11px] font-semibold uppercase tracking-wide text-admin-accent ring-1 ring-admin-accent/25 transition hover:bg-admin-accent/15 sm:text-xs"
              >
                View live on shop
                <ExternalLink className="h-3.5 w-3.5" aria-hidden />
              </a>
            </div>
          ) : null}
        </div>
      </div>

      {/* SEO — right column, stretches with left stack */}
      <div className="flex h-full flex-col rounded-xl border border-black/[0.07] bg-white p-3 sm:p-3.5 lg:col-span-5">
        <p className="mb-2 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-admin-ink/55">
          <Globe className="h-3.5 w-3.5 text-admin-accent" aria-hidden />
          SEO &amp; search
        </p>
        <div className="space-y-2">
          <Cell label="SEO title" value={product.seoTitle?.trim() || "—"} />
          <Cell
            label="SEO description"
            value={
              product.seoDescription?.trim() ? (
                <span className="whitespace-normal">{product.seoDescription.trim()}</span>
              ) : (
                "—"
              )
            }
          />
          <div className="rounded-lg border border-black/6 bg-white px-2.5 py-2 sm:px-3 sm:py-2.5">
            <p className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-admin-ink/40">
              <Search className="h-3 w-3" aria-hidden />
              Search keywords
            </p>
            {keywords.length ? (
              <div className="mt-1.5 flex flex-wrap gap-1">
                {keywords.map((kw) => (
                  <span
                    key={kw}
                    className="inline-flex items-center gap-0.5 rounded-md bg-admin-bg px-1.5 py-0.5 text-[10px] font-medium text-admin-ink/65 ring-1 ring-black/5"
                  >
                    <Hash className="h-2.5 w-2.5 text-admin-ink/35" aria-hidden />
                    {kw}
                  </span>
                ))}
              </div>
            ) : (
              <p className="mt-0.5 text-xs text-admin-ink/40">—</p>
            )}
          </div>
        </div>
      </div>

      {onEdit ? (
        <div className="sticky bottom-0 z-10 -mx-3 border-t border-black/8 bg-[#fafafa]/95 px-3 py-3 backdrop-blur-sm sm:-mx-5 sm:px-5 lg:col-span-12">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onEdit}
              className={`${admin.primaryBtn} cursor-pointer gap-2 px-5 py-2 text-xs`}
            >
              <Pencil className="h-3.5 w-3.5" aria-hidden />
              Edit product
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

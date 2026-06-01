"use client";

import { admin } from "@/components/admin/adminTheme";
import { products } from "@/db/schema";
import type { ProductAttributeValue, TemplateFieldDef } from "@/lib/category-template";
import type { InferSelectModel } from "drizzle-orm";
import {
  Calendar,
  Clock,
  Globe,
  Home,
  ImagePlus,
  Layers,
  Loader2,
  Package,
  Tag,
} from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";

type ProductRow = InferSelectModel<typeof products>;

function formatWhen(value: Date | string | null | undefined) {
  if (!value) return "—";
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function formatAttrValue(raw: ProductAttributeValue | undefined): string {
  if (raw == null || raw === "") return "—";
  if (typeof raw === "string") return raw;
  const v = raw.value?.trim();
  if (!v) return "—";
  return raw.unit ? `${v} ${raw.unit}` : v;
}

function Section({
  icon,
  title,
  children,
}: {
  icon: ReactNode;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-black/6 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="flex items-center gap-2 border-b border-black/5 bg-[#F5F5F7]/70 px-4 py-3 sm:px-5">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-[#5B2D9B] shadow-sm ring-1 ring-black/5">
          {icon}
        </span>
        <h3 className="text-sm font-bold text-[#1a1a1a]">{title}</h3>
      </div>
      <div className="px-4 py-4 sm:px-5 sm:py-5">{children}</div>
    </section>
  );
}

function DetailRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="grid gap-1 sm:grid-cols-[140px_minmax(0,1fr)] sm:items-start sm:gap-4">
      <dt className="text-xs font-semibold uppercase tracking-wide text-[#1a1a1a]/45">
        {label}
      </dt>
      <dd className="text-sm text-[#1a1a1a] break-words">{value}</dd>
    </div>
  );
}

function StatusBadge({
  active,
  activeLabel,
  inactiveLabel,
  activeClass,
  inactiveClass,
  icon,
}: {
  active: boolean;
  activeLabel: string;
  inactiveLabel: string;
  activeClass: string;
  inactiveClass: string;
  icon?: ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
        active ? activeClass : inactiveClass
      }`}
    >
      {icon}
      {active ? activeLabel : inactiveLabel}
    </span>
  );
}

export default function AdminProductViewPanel({ product }: { product: ProductRow }) {
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
        if (!cancelled) setTemplateErr("Could not load category field labels.");
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

  const templateRows = useMemo(() => {
    return templateFields.map((field) => ({
      key: field.key,
      label: field.label,
      value: formatAttrValue(attrs[field.key]),
    }));
  }, [templateFields, attrs]);

  const extraAttrRows = useMemo(() => {
    return Object.entries(attrs)
      .filter(([key]) => !templateKeys.has(key))
      .map(([key, value]) => ({
        key,
        label: key.replace(/_/g, " "),
        value: formatAttrValue(value),
      }));
  }, [attrs, templateKeys]);

  const categoryParts = product.category?.split(" › ") ?? [];
  const categoryName = categoryParts[0] ?? null;
  const subCategoryName = categoryParts.length > 1 ? categoryParts.slice(1).join(" › ") : null;

  return (
    <div className="space-y-4">
      <Section icon={<Package size={16} aria-hidden />} title="Product details">
        <dl className="space-y-4">
          <DetailRow label="Title" value={<span className="font-semibold">{product.title}</span>} />
          <DetailRow
            label="Slug"
            value={
              <code className="rounded-md bg-[#F5F5F7] px-2 py-1 font-mono text-xs text-[#1a1a1a]/80">
                /{product.slug}
              </code>
            }
          />
          <DetailRow
            label="Category"
            value={
              product.category ? (
                <div className="flex flex-wrap items-center gap-2">
                  {categoryName ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#5B2D9B]/10 px-3 py-1 text-xs font-semibold text-[#5B2D9B]">
                      <Tag size={12} aria-hidden />
                      {categoryName}
                    </span>
                  ) : null}
                  {subCategoryName ? (
                    <span className="inline-flex items-center rounded-full bg-[#F5F5F7] px-3 py-1 text-xs font-semibold text-[#1a1a1a]/70 ring-1 ring-black/8">
                      {subCategoryName}
                    </span>
                  ) : null}
                </div>
              ) : (
                "—"
              )
            }
          />
        </dl>
      </Section>

      <Section icon={<Globe size={16} aria-hidden />} title="Publishing & visibility">
        <div className="flex flex-wrap gap-2">
          <StatusBadge
            active={product.published}
            activeLabel="Live on shop"
            inactiveLabel="Draft"
            activeClass="bg-emerald-100 text-emerald-700"
            inactiveClass="bg-gray-100 text-gray-600"
            icon={
              <span
                className={`h-1.5 w-1.5 rounded-full ${product.published ? "bg-emerald-500" : "bg-gray-400"}`}
              />
            }
          />
          <StatusBadge
            active={product.isFeatured}
            activeLabel="Featured on homepage"
            inactiveLabel="Not featured"
            activeClass="bg-amber-100 text-amber-700"
            inactiveClass="bg-gray-100 text-gray-500"
            icon={<Home className="h-3 w-3" aria-hidden />}
          />
          <StatusBadge
            active={product.isAvailable}
            activeLabel="Available"
            inactiveLabel="Unavailable"
            activeClass="bg-blue-100 text-blue-700"
            inactiveClass="bg-red-100 text-red-700"
            icon={
              <span
                className={`h-1.5 w-1.5 rounded-full ${product.isAvailable ? "bg-blue-500" : "bg-red-500"}`}
              />
            }
          />
        </div>
      </Section>

      <Section icon={<ImagePlus size={16} aria-hidden />} title={`Gallery (${product.images?.length ?? 0})`}>
        {product.images?.length ? (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
            {product.images.map((src, idx) => (
              <a
                key={`${src}-${idx}`}
                href={src}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative aspect-square overflow-hidden rounded-xl bg-[#F5F5F7] ring-1 ring-black/6 transition hover:ring-[#5B2D9B]/30"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={`${product.title} image ${idx + 1}`}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
                <span className="absolute left-2 top-2 rounded-md bg-black/55 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                  {idx + 1}
                </span>
              </a>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-black/10 py-10 text-center text-sm text-[#1a1a1a]/40">
            No gallery images uploaded.
          </div>
        )}
      </Section>

      <Section icon={<Layers size={16} aria-hidden />} title="Category fields">
        {templateLoading ? (
          <div className="flex items-center gap-2 text-sm text-[#1a1a1a]/50">
            <Loader2 className="h-4 w-4 animate-spin text-[#5B2D9B]" aria-hidden />
            Loading field definitions…
          </div>
        ) : templateErr ? (
          <p className={`${admin.error} text-sm`}>{templateErr}</p>
        ) : templateRows.length || extraAttrRows.length ? (
          <dl className="grid gap-4 sm:grid-cols-2">
            {[...templateRows, ...extraAttrRows].map((row) => (
              <div
                key={row.key}
                className="rounded-xl border border-black/5 bg-[#F5F5F7]/50 px-3.5 py-3"
              >
                <dt className="text-[11px] font-bold uppercase tracking-wide text-[#1a1a1a]/40">
                  {row.label}
                </dt>
                <dd className="mt-1 text-sm font-medium text-[#1a1a1a]">{row.value}</dd>
              </div>
            ))}
          </dl>
        ) : (
          <p className="text-sm text-[#1a1a1a]/40">No category template fields for this product.</p>
        )}
      </Section>

      <Section icon={<Package size={16} aria-hidden />} title="Description">
        {product.description ? (
          <div className="prose prose-sm max-w-none rounded-xl border border-black/5 bg-[#F5F5F7]/40 p-4 text-sm leading-relaxed text-[#1a1a1a]/85 [&_img]:max-w-full [&_video]:max-w-full">
            <div dangerouslySetInnerHTML={{ __html: product.description }} />
          </div>
        ) : (
          <p className="text-sm text-[#1a1a1a]/40">No description provided.</p>
        )}
      </Section>

      <Section icon={<Clock size={16} aria-hidden />} title="Timeline">
        <dl className="space-y-4">
          <DetailRow
            label="Created"
            value={
              <span className="inline-flex items-center gap-1.5 text-[#1a1a1a]/70">
                <Calendar className="h-3.5 w-3.5" aria-hidden />
                {formatWhen(product.createdAt)}
              </span>
            }
          />
          <DetailRow
            label="Last updated"
            value={
              <span className="inline-flex items-center gap-1.5 text-[#1a1a1a]/70">
                <Clock className="h-3.5 w-3.5" aria-hidden />
                {formatWhen(product.updatedAt)}
              </span>
            }
          />
        </dl>
      </Section>
    </div>
  );
}

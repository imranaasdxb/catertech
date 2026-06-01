"use client";

import { admin } from "@/components/admin/adminTheme";
import {
  DIMENSION_UNITS,
  parseProductAttributes,
  type ProductAttributeValue,
  type TemplateFieldDef,
} from "@/lib/category-template";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

type Props = {
  categoryId: string;
  subCategoryId: string;
  initialAttributes?: Record<string, ProductAttributeValue>;
  onFieldsLoaded?: (fields: TemplateFieldDef[]) => void;
};

function readAttr(
  attrs: Record<string, ProductAttributeValue> | undefined,
  key: string
): { value: string; unit: string } {
  const raw = attrs?.[key];
  if (!raw) return { value: "", unit: "cm" };
  if (typeof raw === "string") return { value: raw, unit: "cm" };
  return { value: raw.value ?? "", unit: raw.unit ?? "cm" };
}

export function ProductTemplateFields({
  categoryId,
  subCategoryId,
  initialAttributes,
  onFieldsLoaded,
}: Props) {
  const [fields, setFields] = useState<TemplateFieldDef[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!categoryId) {
      setFields([]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setErr("");

    const params = new URLSearchParams({ categoryId });
    if (subCategoryId) params.set("subCategoryId", subCategoryId);

    void fetch(`/api/admin/category-templates?${params}`)
      .then(async (res) => {
        if (!res.ok) throw new Error("load failed");
        const data = (await res.json()) as { fields?: TemplateFieldDef[] };
        const loaded = data.fields ?? [];
        if (!cancelled) {
          setFields(loaded);
          onFieldsLoaded?.(loaded);
        }
      })
      .catch(() => {
        if (!cancelled) setErr("Could not load category template.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [categoryId, subCategoryId, onFieldsLoaded]);

  if (loading) {
    return (
      <div className="flex items-center gap-2 rounded-2xl border border-black/6 bg-[#F5F5F7]/60 px-4 py-6 text-sm text-[#1a1a1a]/50">
        <Loader2 className="h-4 w-4 animate-spin text-[#5B2D9B]" />
        Loading category fields…
      </div>
    );
  }

  if (err) {
    return <p className={`${admin.error} text-sm`}>{err}</p>;
  }

  if (!fields.length) return null;

  return (
    <section className="space-y-3">
      <p className={`${admin.formSectionTitle} mb-0`}>Category fields</p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {fields.map((field) => {
          const id = `attr-${field.key}`;

          if (field.type === "dimension") {
            const { value, unit } = readAttr(initialAttributes, field.key);
            const units = field.unitOptions?.length ? field.unitOptions : [...DIMENSION_UNITS];
            return (
              <div key={field.key} className="sm:col-span-2">
                <label htmlFor={id} className={admin.labelModern}>
                  {field.label}
                  {field.required ? " *" : ""}
                </label>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <input
                    id={id}
                    name={`attr_${field.key}`}
                    defaultValue={value}
                    required={field.required}
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                    className={`${admin.fieldModern} min-w-0 flex-1`}
                  />
                  <select
                    name={`attr_${field.key}_unit`}
                    defaultValue={units.includes(unit) ? unit : units[0]}
                    className={`${admin.fieldModern} w-full sm:w-32`}
                    aria-label={`${field.label} unit`}
                  >
                    {units.map((u) => (
                      <option key={u} value={u}>
                        {u}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            );
          }

          if (field.type === "select") {
            const { value } = readAttr(initialAttributes, field.key);
            return (
              <div key={field.key}>
                <label htmlFor={id} className={admin.labelModern}>
                  {field.label}
                  {field.required ? " *" : ""}
                </label>
                <select
                  id={id}
                  name={`attr_${field.key}`}
                  defaultValue={value}
                  required={field.required}
                  className={admin.fieldModern}
                >
                  <option value="">— Select —</option>
                  {(field.options ?? []).map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            );
          }

          if (field.type === "textarea") {
            const { value } = readAttr(initialAttributes, field.key);
            return (
              <div key={field.key} className="sm:col-span-2">
                <label htmlFor={id} className={admin.labelModern}>
                  {field.label}
                  {field.required ? " *" : ""}
                </label>
                <textarea
                  id={id}
                  name={`attr_${field.key}`}
                  defaultValue={value}
                  required={field.required}
                  rows={3}
                  className={admin.fieldModern}
                />
              </div>
            );
          }

          const { value } = readAttr(initialAttributes, field.key);
          return (
            <div key={field.key}>
              <label htmlFor={id} className={admin.labelModern}>
                {field.label}
                {field.required ? " *" : ""}
              </label>
              <input
                id={id}
                name={`attr_${field.key}`}
                defaultValue={value}
                required={field.required}
                className={admin.fieldModern}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}

export { parseProductAttributes };

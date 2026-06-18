"use client";

import { admin } from "@/components/admin/adminTheme";
import {
  DIMENSION_UNITS,
  parseProductAttributes,
  type ProductAttributeValue,
  type TemplateFieldDef,
} from "@/lib/category-template";
import { Loader2, Plus, X } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

type Props = {
  categoryId: string;
  /** Kept for form compatibility; does not reload template fields when changed */
  subCategoryId?: string;
  initialAttributes?: Record<string, ProductAttributeValue>;
  initialFieldKeys?: string[];
  onFieldsLoaded?: (fields: TemplateFieldDef[]) => void;
  onAttributesChange?: (attributes: Record<string, ProductAttributeValue>) => void;
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
  subCategoryId: _subCategoryId,
  initialAttributes,
  initialFieldKeys,
  onFieldsLoaded,
  onAttributesChange,
}: Props) {
  const [fields, setFields] = useState<TemplateFieldDef[]>([]);
  const [availableFields, setAvailableFields] = useState<TemplateFieldDef[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!categoryId) return;

    let cancelled = false;

    const params = new URLSearchParams({ categoryId });

    void fetch(`/api/admin/category-templates?${params}`)
      .then(async (res) => {
        if (!res.ok) throw new Error("load failed");
        const data = (await res.json()) as { fields?: TemplateFieldDef[] };
        const loaded = data.fields ?? [];
        if (!cancelled) {
          const visible =
            initialFieldKeys === undefined
              ? loaded
              : loaded.filter((field) => initialFieldKeys.includes(field.key));
          setAvailableFields(loaded);
          setFields(visible);
          onFieldsLoaded?.(visible);
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
  }, [categoryId, initialFieldKeys, onFieldsLoaded]);

  const remainingFields = useMemo(() => {
    const activeKeys = new Set(fields.map((field) => field.key));
    return availableFields.filter((field) => !activeKeys.has(field.key));
  }, [availableFields, fields]);

  const updateFields = useCallback(
    (next: TemplateFieldDef[]) => {
      setFields(next);
      onFieldsLoaded?.(next);
    },
    [onFieldsLoaded]
  );

  function removeField(key: string) {
    updateFields(fields.filter((field) => field.key !== key));
  }

  function addField(key: string) {
    const selected = availableFields.find((field) => field.key === key);
    if (!selected) return;
    updateFields(
      [...fields, selected].sort((a, b) => a.sortOrder - b.sortOrder)
    );
  }

  function emitAttributeChange(
    key: string,
    value: ProductAttributeValue | null
  ) {
    if (!onAttributesChange) return;
    onAttributesChange({
      ...(initialAttributes ?? {}),
      [key]: value ?? "",
    });
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 rounded-2xl border border-black/6 bg-admin-bg/60 px-4 py-6 text-sm text-admin-ink/50">
        <Loader2 className="h-4 w-4 animate-spin text-admin-accent" />
        Loading category fields…
      </div>
    );
  }

  if (err) {
    return <p className={`${admin.error} text-sm`}>{err}</p>;
  }

  return (
    <section className="space-y-3">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className={`${admin.formSectionTitle} mb-0`}>Category fields</p>
          <p className="mt-1 text-xs text-admin-ink/45">
            Preset values stay editable. Remove fields you do not need or add another field.
          </p>
        </div>
        {remainingFields.length ? (
          <label className="relative inline-flex items-center gap-2 rounded-xl border border-black/10 bg-white px-3 py-2 text-xs font-semibold text-admin-ink shadow-sm transition hover:border-black/20">
            <Plus size={14} aria-hidden="true" />
            Add field
            <select
              value=""
              onChange={(event) => addField(event.target.value)}
              className="absolute inset-0 cursor-pointer opacity-0"
              aria-label="Add category field"
            >
              <option value="">Choose a field</option>
              {remainingFields.map((field) => (
                <option key={field.key} value={field.key}>
                  {field.label}
                </option>
              ))}
            </select>
          </label>
        ) : null}
      </div>

      {fields.length ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {fields.map((field) => {
          const id = `attr-${field.key}`;
          const fieldLabel = (
            <div className="mb-1.5 flex items-center justify-between gap-2">
              <label htmlFor={id} className={`${admin.labelModern} mb-0`}>
                {field.label}
                {field.required ? " *" : ""}
              </label>
              <button
                type="button"
                onClick={() => removeField(field.key)}
                className="grid h-6 w-6 shrink-0 place-items-center rounded-md text-admin-ink/35 transition hover:bg-black/5 hover:text-admin-ink"
                aria-label={`Remove ${field.label}`}
                title={`Remove ${field.label}`}
              >
                <X size={14} aria-hidden="true" />
              </button>
            </div>
          );

          if (field.type === "dimension") {
            const { value, unit } = readAttr(initialAttributes, field.key);
            const units = field.unitOptions?.length ? field.unitOptions : [...DIMENSION_UNITS];
            return (
              <div key={field.key} className="sm:col-span-2">
                {fieldLabel}
                <div className="flex flex-col gap-2 sm:flex-row">
                  <input
                    id={id}
                    name={`attr_${field.key}`}
                    defaultValue={value}
                    onChange={(event) =>
                      emitAttributeChange(field.key, {
                        value: event.target.value,
                        unit,
                      })
                    }
                    required={field.required}
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                    className={`${admin.fieldModern} min-w-0 flex-1`}
                  />
                  <select
                    name={`attr_${field.key}_unit`}
                    defaultValue={unit === "" || units.includes(unit) ? unit : units[0]}
                    onChange={(event) =>
                      emitAttributeChange(field.key, {
                        value,
                        unit: event.target.value,
                      })
                    }
                    className={`${admin.fieldModern} w-full sm:w-32`}
                    aria-label={`${field.label} unit`}
                  >
                    <option value="">Choose unit</option>
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
                {fieldLabel}
                <select
                  id={id}
                  name={`attr_${field.key}`}
                  defaultValue={value}
                  onChange={(event) => emitAttributeChange(field.key, event.target.value)}
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
                {fieldLabel}
                <textarea
                  id={id}
                  name={`attr_${field.key}`}
                  defaultValue={value}
                  onChange={(event) => emitAttributeChange(field.key, event.target.value)}
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
              {fieldLabel}
              <input
                id={id}
                name={`attr_${field.key}`}
                defaultValue={value}
                onChange={(event) => emitAttributeChange(field.key, event.target.value)}
                required={field.required}
                className={admin.fieldModern}
              />
            </div>
          );
        })}
        </div>
      ) : (
        <p className="rounded-xl border border-dashed border-black/10 bg-admin-bg/45 px-4 py-5 text-sm text-admin-ink/45">
          This preset has no saved specification fields. Add only the fields needed for this product.
        </p>
      )}
    </section>
  );
}

export { parseProductAttributes };

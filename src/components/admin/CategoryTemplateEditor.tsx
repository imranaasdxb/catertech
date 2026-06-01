"use client";

import { admin, ADMIN_PURPLE } from "@/components/admin/adminTheme";
import { AdminPanelModal } from "@/components/admin/AdminPanelModal";
import {
  DEFAULT_TEMPLATE_FIELDS,
  DIMENSION_UNITS,
  fieldKeyFromLabel,
  normalizeTemplateFields,
  type TemplateFieldDef,
  type TemplateFieldType,
} from "@/lib/category-template";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

type Props = {
  open: boolean;
  categoryId: string;
  subCategoryId?: string | null;
  categoryName: string;
  subCategoryName?: string;
  onClose: () => void;
  onSaved?: () => void;
};

const FIELD_TYPES: { value: TemplateFieldType; label: string }[] = [
  { value: "text", label: "Text" },
  { value: "textarea", label: "Long text" },
  { value: "dimension", label: "Size + unit" },
  { value: "select", label: "Dropdown" },
];

function emptyDraft(): TemplateFieldDef {
  return { key: "", label: "", type: "text", sortOrder: 0 };
}

export function CategoryTemplateEditor({
  open,
  categoryId,
  subCategoryId = null,
  categoryName,
  subCategoryName,
  onClose,
  onSaved,
}: Props) {
  const [fields, setFields] = useState<TemplateFieldDef[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const scopeLabel = subCategoryName
    ? `${categoryName} › ${subCategoryName}`
    : categoryName;

  const load = useCallback(async () => {
    if (!categoryId) return;
    setLoading(true);
    setErr("");
    const params = new URLSearchParams({ categoryId });
    if (subCategoryId) params.set("subCategoryId", subCategoryId);
    const res = await fetch(`/api/admin/category-templates?${params}`);
    setLoading(false);
    if (!res.ok) {
      setErr("Could not load template.");
      return;
    }
    const data = (await res.json()) as {
      ownFields?: TemplateFieldDef[] | null;
      fields?: TemplateFieldDef[];
    };
    setFields(
      normalizeTemplateFields(
        data.ownFields?.length ? data.ownFields : data.fields ?? DEFAULT_TEMPLATE_FIELDS
      )
    );
  }, [categoryId, subCategoryId]);

  useEffect(() => {
    if (open) void load();
  }, [open, load]);

  function updateField(index: number, patch: Partial<TemplateFieldDef>) {
    setFields((prev) =>
      prev.map((f, i) => {
        if (i !== index) return f;
        const next = { ...f, ...patch };
        if (patch.label && (!f.key || f.key === fieldKeyFromLabel(f.label))) {
          next.key = fieldKeyFromLabel(patch.label);
        }
        if (patch.type === "dimension" && !next.unitOptions?.length) {
          next.unitOptions = [...DIMENSION_UNITS];
        }
        return next;
      })
    );
  }

  function addField() {
    setFields((prev) => [
      ...prev,
      { ...emptyDraft(), sortOrder: prev.length, key: `field_${prev.length + 1}` },
    ]);
  }

  function removeField(index: number) {
    setFields((prev) => prev.filter((_, i) => i !== index).map((f, i) => ({ ...f, sortOrder: i })));
  }

  function loadDefaults() {
    setFields(normalizeTemplateFields(DEFAULT_TEMPLATE_FIELDS));
  }

  async function save() {
    setSaving(true);
    setErr("");
    const res = await fetch("/api/admin/category-templates", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        categoryId,
        subCategoryId: subCategoryId ?? null,
        fields: normalizeTemplateFields(fields),
      }),
    });
    setSaving(false);
    if (!res.ok) {
      const j = (await res.json().catch(() => ({}))) as { error?: unknown };
      setErr(typeof j.error === "string" ? j.error : "Save failed.");
      return;
    }
    onSaved?.();
    onClose();
  }

  return (
    <AdminPanelModal
      open={open}
      title={`Template — ${scopeLabel}`}
      widthClass="max-w-[min(100%-1rem,40rem)]"
      onClose={onClose}
    >
      {err ? (
        <p className={`${admin.error} mb-4 rounded-xl border border-red-100 bg-red-50 px-3 py-2 text-sm`}>
          {err}
        </p>
      ) : null}

      {loading ? (
        <div className="flex items-center justify-center gap-2 py-16 text-[#1a1a1a]/50">
          <Loader2 className="h-6 w-6 animate-spin text-[#5B2D9B]" />
          Loading…
        </div>
      ) : (
        <div className="space-y-3">
          {fields.map((field, index) => (
            <div
              key={`${field.key}-${index}`}
              className="rounded-xl border border-black/6 bg-white p-3"
            >
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-semibold text-[#1a1a1a]/40">Field {index + 1}</span>
                <button
                  type="button"
                  onClick={() => removeField(index)}
                  className="inline-flex h-7 w-7 items-center justify-center rounded-md text-red-600 hover:bg-red-50"
                  title="Remove"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-[#1a1a1a]/55">Name</label>
                  <input
                    value={field.label}
                    onChange={(e) => updateField(index, { label: e.target.value })}
                    placeholder="Dimensions"
                    className={`${admin.fieldModern} py-2 text-sm`}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-semibold text-[#1a1a1a]/55">Type</label>
                  <select
                    value={field.type}
                    onChange={(e) =>
                      updateField(index, { type: e.target.value as TemplateFieldType })
                    }
                    className={`${admin.fieldModern} py-2 text-sm`}
                  >
                    {FIELD_TYPES.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {field.type === "dimension" ? (
                <div className="mt-2">
                  <label className="mb-1 block text-xs font-semibold text-[#1a1a1a]/55">Units</label>
                  <input
                    value={(field.unitOptions ?? DIMENSION_UNITS).join(", ")}
                    onChange={(e) =>
                      updateField(index, {
                        unitOptions: e.target.value
                          .split(",")
                          .map((s) => s.trim())
                          .filter(Boolean),
                      })
                    }
                    placeholder="cm, m, ft"
                    className={`${admin.fieldModern} py-2 text-sm`}
                  />
                </div>
              ) : null}

              {field.type === "select" ? (
                <div className="mt-2">
                  <label className="mb-1 block text-xs font-semibold text-[#1a1a1a]/55">Options</label>
                  <input
                    value={(field.options ?? []).join(", ")}
                    onChange={(e) =>
                      updateField(index, {
                        options: e.target.value
                          .split(",")
                          .map((s) => s.trim())
                          .filter(Boolean),
                      })
                    }
                    placeholder="Small, Medium, Large"
                    className={`${admin.fieldModern} py-2 text-sm`}
                  />
                </div>
              ) : null}

              <label className="mt-2 flex cursor-pointer items-center gap-2 text-xs text-[#1a1a1a]/65">
                <input
                  type="checkbox"
                  checked={Boolean(field.required)}
                  onChange={(e) => updateField(index, { required: e.target.checked })}
                  className={admin.checkbox}
                />
                Required
              </label>
            </div>
          ))}

          <button
            type="button"
            onClick={addField}
            className={`${admin.secondaryBtn} w-full gap-2 border-dashed py-2.5 text-sm`}
          >
            <Plus className="h-4 w-4" />
            Add field
          </button>
        </div>
      )}

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-black/6 pt-4">
        <button type="button" onClick={loadDefaults} className={`${admin.link} text-xs`}>
          Reset defaults
        </button>
        <div className="flex gap-2">
          <button type="button" onClick={onClose} className={`${admin.secondaryBtn} py-2.5 text-sm`}>
            Cancel
          </button>
          <button
            type="button"
            disabled={saving || loading || fields.length === 0}
            onClick={() => void save()}
            className={`${admin.primaryBtn} py-2.5 text-sm`}
            style={{ backgroundColor: ADMIN_PURPLE }}
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </AdminPanelModal>
  );
}

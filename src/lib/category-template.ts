export type TemplateFieldType = "text" | "textarea" | "dimension" | "select";

export type TemplateFieldDef = {
  key: string;
  label: string;
  type: TemplateFieldType;
  required?: boolean;
  unitOptions?: string[];
  options?: string[];
  sortOrder: number;
};

export type ProductAttributeValue =
  | string
  | {
      value: string;
      unit?: string;
    };

export const DIMENSION_UNITS = ["cm", "m", "ft"] as const;

export const DEFAULT_TEMPLATE_FIELDS: TemplateFieldDef[] = [
  {
    key: "dimensions",
    label: "Dimensions",
    type: "dimension",
    unitOptions: [...DIMENSION_UNITS],
    sortOrder: 0,
  },
  {
    key: "size",
    label: "Size",
    type: "dimension",
    unitOptions: [...DIMENSION_UNITS],
    sortOrder: 1,
  },
  {
    key: "color",
    label: "Color",
    type: "text",
    sortOrder: 2,
  },
  {
    key: "material",
    label: "Material",
    type: "text",
    sortOrder: 3,
  },
];

export function normalizeTemplateFields(fields: TemplateFieldDef[]): TemplateFieldDef[] {
  return [...fields]
    .map((f, i) => ({
      ...f,
      key: f.key.trim(),
      label: f.label.trim(),
      sortOrder: f.sortOrder ?? i,
    }))
    .filter((f) => f.key && f.label)
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export function fieldKeyFromLabel(label: string): string {
  return label
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "")
    .slice(0, 48);
}

export function buildDefaultProductTitle(
  categoryName: string,
  subCategoryName: string
): string {
  if (subCategoryName) {
    return categoryName ? `${categoryName} — ${subCategoryName}` : subCategoryName;
  }
  return categoryName;
}

export function parseProductAttributes(
  fd: FormData,
  fields: TemplateFieldDef[]
): Record<string, ProductAttributeValue> {
  const out: Record<string, ProductAttributeValue> = {};

  for (const field of fields) {
    const raw = fd.get(`attr_${field.key}`);
    const value = typeof raw === "string" ? raw.trim() : "";
    if (!value) continue;

    if (field.type === "dimension") {
      const unitRaw = fd.get(`attr_${field.key}_unit`);
      const unit = typeof unitRaw === "string" ? unitRaw.trim() : "";
      out[field.key] = unit ? { value, unit } : value;
    } else {
      out[field.key] = value;
    }
  }

  return out;
}

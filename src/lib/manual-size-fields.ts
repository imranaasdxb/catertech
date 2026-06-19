import type { TemplateFieldDef } from "./category-template";

const SIZE_UNITS = ["mm", "cm", "m", "ft"];

export const MANUAL_SIZE_FIELDS: TemplateFieldDef[] = [
  {
    key: "dimensions",
    label: "Dimensions",
    type: "dimension",
    unitOptions: SIZE_UNITS,
    sortOrder: 0,
  },
  {
    key: "size",
    label: "Size",
    type: "dimension",
    unitOptions: SIZE_UNITS,
    sortOrder: 1,
  },
  {
    key: "length",
    label: "Length",
    type: "dimension",
    unitOptions: SIZE_UNITS,
    sortOrder: 2,
  },
  {
    key: "width",
    label: "Width",
    type: "dimension",
    unitOptions: SIZE_UNITS,
    sortOrder: 3,
  },
  {
    key: "height",
    label: "Height",
    type: "dimension",
    unitOptions: SIZE_UNITS,
    sortOrder: 4,
  },
  {
    key: "diameter",
    label: "Diameter",
    type: "dimension",
    unitOptions: SIZE_UNITS,
    sortOrder: 5,
  },
];

export function getAvailableManualSizeFields(activeFields: Array<{ key: string }>) {
  const activeKeys = new Set(activeFields.map((field) => field.key));
  return MANUAL_SIZE_FIELDS.filter((field) => !activeKeys.has(field.key));
}

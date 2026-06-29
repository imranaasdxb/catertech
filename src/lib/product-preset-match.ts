import { cleanPresetProductTitle } from "@/lib/catalog/canonical-catalog";
import type { ProductAttributeValue } from "@/db/schema";

export type PresetMatchRow = {
  id: string;
  title: string;
  sourceLabel: string;
  attributes: Record<string, ProductAttributeValue>;
  subCategoryId?: string | null;
};

export type ProductMatchInput = {
  title: string;
  productTitlePresetId?: string | null;
  attributes: Record<string, ProductAttributeValue>;
  subCategoryId?: string | null;
};

export function normalizeMatchText(value: string) {
  return value.trim().replace(/\s+/g, " ").toLowerCase();
}

export function normalizeAttributeValue(value: ProductAttributeValue | undefined) {
  if (!value) return "";
  if (typeof value === "string") return normalizeMatchText(value);
  return normalizeMatchText(`${value.value ?? ""} ${value.unit ?? ""}`);
}

export function attributesMatch(
  productAttributes: Record<string, ProductAttributeValue>,
  presetAttributes: Record<string, ProductAttributeValue>
) {
  const presetEntries = Object.entries(presetAttributes).filter(([, value]) =>
    Boolean(normalizeAttributeValue(value))
  );
  if (!presetEntries.length) return false;

  return presetEntries.every(([key, presetValue]) => {
    const productValue = normalizeAttributeValue(productAttributes[key]);
    const normalizedPresetValue = normalizeAttributeValue(presetValue);
    return (
      Boolean(productValue) &&
      (productValue === normalizedPresetValue ||
        productValue.includes(normalizedPresetValue) ||
        normalizedPresetValue.includes(productValue))
    );
  });
}

export function productTitleMatchesPreset(
  productTitle: string,
  preset: Pick<PresetMatchRow, "title" | "sourceLabel">
) {
  const normalizedProduct = normalizeMatchText(productTitle);
  if (!normalizedProduct) return false;

  const normalizedTitle = normalizeMatchText(preset.title);
  const normalizedSource = normalizeMatchText(preset.sourceLabel);
  const cleanedSource = normalizeMatchText(cleanPresetProductTitle(preset.sourceLabel));

  return (
    normalizedProduct === normalizedTitle ||
    normalizedProduct === normalizedSource ||
    normalizedProduct === cleanedSource
  );
}

function narrowPresetCandidates(
  candidates: PresetMatchRow[],
  product: ProductMatchInput
) {
  if (!candidates.length) return candidates;

  let next = candidates;
  if (product.subCategoryId) {
    const subMatches = next.filter(
      (preset) => !preset.subCategoryId || preset.subCategoryId === product.subCategoryId
    );
    if (subMatches.length) next = subMatches;
  }

  const attributeMatches = next.filter((preset) =>
    attributesMatch(product.attributes, preset.attributes)
  );
  if (attributeMatches.length) return attributeMatches;

  const sourceExact = next.filter(
    (preset) => normalizeMatchText(preset.sourceLabel) === normalizeMatchText(product.title)
  );
  if (sourceExact.length) return sourceExact;

  return next;
}

export function resolveProductPresetMatch(
  product: ProductMatchInput,
  presets: PresetMatchRow[]
): PresetMatchRow | null {
  if (product.productTitlePresetId) {
    const byId = presets.find((preset) => preset.id === product.productTitlePresetId);
    if (byId) return byId;
  }

  const normalizedProduct = normalizeMatchText(product.title);
  if (!normalizedProduct) return null;

  const sourceExact = presets.filter(
    (preset) => normalizeMatchText(preset.sourceLabel) === normalizedProduct
  );
  if (sourceExact.length === 1) return sourceExact[0];
  if (sourceExact.length > 1) {
    const narrowed = narrowPresetCandidates(sourceExact, product);
    if (narrowed.length === 1) return narrowed[0];
  }

  const titleMatches = presets.filter((preset) =>
    productTitleMatchesPreset(product.title, preset)
  );
  if (!titleMatches.length) return null;
  if (titleMatches.length === 1) return titleMatches[0];

  const narrowed = narrowPresetCandidates(titleMatches, product);
  if (narrowed.length === 1) return narrowed[0];

  return null;
}

export function collectCreatedPresetIds(
  products: ProductMatchInput[],
  presets: PresetMatchRow[]
) {
  const createdPresetIds = new Set<string>();

  for (const product of products) {
    if (product.productTitlePresetId) {
      if (presets.some((preset) => preset.id === product.productTitlePresetId)) {
        createdPresetIds.add(product.productTitlePresetId);
      }
      continue;
    }

    const match = resolveProductPresetMatch(product, presets);
    if (match) createdPresetIds.add(match.id);
  }

  return createdPresetIds;
}

export function presetIsCreated(
  presetId: string,
  products: ProductMatchInput[],
  presets: PresetMatchRow[]
) {
  return products.some((product) => {
    const match = resolveProductPresetMatch(product, presets);
    return match?.id === presetId;
  });
}

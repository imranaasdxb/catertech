import {
  cleanPresetProductTitle,
  inferPresetAttributes,
} from "@/lib/catalog/canonical-catalog";
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

export function categoryLabelMatches(
  categoryLabel: string | null | undefined,
  categoryName: string
) {
  const normalizedLabel = normalizeMatchText(categoryLabel ?? "");
  const normalizedName = normalizeMatchText(categoryName);
  if (!normalizedLabel || !normalizedName) return false;
  if (normalizedLabel === normalizedName) return true;
  if (!normalizedLabel.startsWith(normalizedName)) return false;

  const suffix = normalizedLabel.slice(normalizedName.length).trimStart();
  return (
    suffix.startsWith(">") ||
    suffix.startsWith("\u203a") ||
    suffix.startsWith("\u00e2\u20ac\u00ba")
  );
}

export function normalizeAttributeValue(value: ProductAttributeValue | undefined) {
  if (!value) return "";
  if (typeof value === "string") return normalizeMatchText(value);
  return normalizeMatchText(`${value.value ?? ""} ${value.unit ?? ""}`);
}

function attributesWithTitleInferences(
  title: string,
  attributes: Record<string, ProductAttributeValue>
) {
  return {
    ...inferPresetAttributes(title),
    ...attributes,
  };
}

export function attributesMatch(
  productAttributes: Record<string, ProductAttributeValue>,
  presetAttributes: Record<string, ProductAttributeValue>
) {
  const presetEntries = Object.entries(presetAttributes).filter(([key, value]) =>
    key !== "additional_details" && Boolean(normalizeAttributeValue(value))
  );
  if (!presetEntries.length) return false;

  let matched = 0;
  let conflict = false;

  for (const [key, presetValue] of presetEntries) {
    const productValue = normalizeAttributeValue(productAttributes[key]);
    const normalizedPresetValue = normalizeAttributeValue(presetValue);
    if (!productValue) continue;

    if (
      productValue === normalizedPresetValue ||
      productValue.includes(normalizedPresetValue) ||
      normalizedPresetValue.includes(productValue)
    ) {
      matched += 1;
    } else {
      conflict = true;
    }
  }

  return matched > 0 && !conflict;
}

export function productTitleMatchesPreset(
  productTitle: string,
  preset: Pick<PresetMatchRow, "title" | "sourceLabel">
) {
  const normalizedProduct = normalizeMatchText(productTitle);
  if (!normalizedProduct) return false;

  const cleanedProduct = normalizeMatchText(cleanPresetProductTitle(productTitle));
  const normalizedTitle = normalizeMatchText(preset.title);
  const normalizedSource = normalizeMatchText(preset.sourceLabel);
  const cleanedSource = normalizeMatchText(cleanPresetProductTitle(preset.sourceLabel));

  return (
    normalizedProduct === normalizedTitle ||
    normalizedProduct === normalizedSource ||
    normalizedProduct === cleanedSource ||
    cleanedProduct === normalizedTitle ||
    cleanedProduct === normalizedSource ||
    cleanedProduct === cleanedSource
  );
}

function titleTokens(value: string) {
  return normalizeMatchText(cleanPresetProductTitle(value))
    .replace(/[^a-z0-9]+/g, " ")
    .split(" ")
    .map((token) => token.replace(/s$/, ""))
    .filter(Boolean);
}

function editDistance(a: string, b: string) {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  const previous = Array.from({ length: b.length + 1 }, (_, index) => index);
  const current = new Array<number>(b.length + 1);

  for (let i = 1; i <= a.length; i += 1) {
    current[0] = i;
    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      current[j] = Math.min(
        current[j - 1] + 1,
        previous[j] + 1,
        previous[j - 1] + cost
      );
    }
    previous.splice(0, previous.length, ...current);
  }

  return previous[b.length];
}

function tokenMatches(productToken: string, presetToken: string) {
  if (productToken === presetToken) return true;
  if (productToken.length < 4 || presetToken.length < 4) return false;
  return editDistance(productToken, presetToken) <= 1;
}

function productTitleFuzzyMatchesPreset(
  productTitle: string,
  preset: Pick<PresetMatchRow, "title" | "sourceLabel">
) {
  const productTokens = titleTokens(productTitle);
  if (productTokens.length < 2) return false;

  const presetTokenSets = [titleTokens(preset.title), titleTokens(preset.sourceLabel)];
  return presetTokenSets.some((presetTokens) => {
    if (presetTokens.length < productTokens.length) return false;
    return productTokens.every((productToken) =>
      presetTokens.some((presetToken) => tokenMatches(productToken, presetToken))
    );
  });
}

function narrowPresetCandidates(
  candidates: PresetMatchRow[],
  product: ProductMatchInput
) {
  if (!candidates.length) return candidates;

  const productAttributes = attributesWithTitleInferences(
    product.title,
    product.attributes
  );

  const attributeMatches = candidates.filter((preset) =>
    attributesMatch(
      productAttributes,
      attributesWithTitleInferences(preset.sourceLabel || preset.title, preset.attributes)
    )
  );
  if (attributeMatches.length) return attributeMatches;

  const sourceExact = candidates.filter(
    (preset) => normalizeMatchText(preset.sourceLabel) === normalizeMatchText(product.title)
  );
  if (sourceExact.length) return sourceExact;

  return candidates;
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
  if (titleMatches.length === 1) return titleMatches[0];

  if (titleMatches.length > 1) {
    const narrowed = narrowPresetCandidates(titleMatches, product);
    if (narrowed.length === 1) return narrowed[0];
  }

  const fuzzyMatches = presets.filter((preset) =>
    productTitleFuzzyMatchesPreset(product.title, preset)
  );
  if (fuzzyMatches.length === 1) return fuzzyMatches[0];
  if (fuzzyMatches.length > 1) {
    const narrowed = narrowPresetCandidates(fuzzyMatches, product);
    if (narrowed.length === 1) return narrowed[0];
  }

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
        continue;
      }
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

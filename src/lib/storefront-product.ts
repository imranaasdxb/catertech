import type { ShopProductDetail } from "@/lib/shop-products";
import type { StorefrontProductCardData } from "@/components/shop/StorefrontProductCard";
import type { CatalogueProductRow } from "@/lib/catalogue-presets";
import type { ProductAttributeValue } from "@/lib/category-template";

type DbProductRow = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  category: string | null;
  categoryId: string | null;
  subCategoryId: string | null;
  images: string[];
  isFeatured: boolean;
  attributes: CatalogueProductRow["attributes"];
};

type SpecRow = { label: string; value: string };

const KNOWN_SPEC_LABELS = [
  "brand",
  "voltage",
  "power",
  "water tank capacity",
  "tank capacity",
  "water tank",
  "water consumption",
  "net weight",
  "gross weight",
  "capacity",
  "weight",
  "dimensions",
  "dimension",
  "size",
  "length",
  "height",
  "width",
  "depth",
  "diameter",
  "material",
  "materials",
  "finish",
  "color",
  "colour",
  "volume",
];

const DIMENSION_LABEL_PATTERN =
  /dimension|size|length|height|width|depth|diameter|weight|capacity|tank|consumption|volume/i;

export function plainText(value: string | null) {
  return (value ?? "")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function formatAttributeValue(value: ProductAttributeValue) {
  if (typeof value === "string") return value.trim();

  const rawValue = value.value.trim();
  const unit = value.unit?.trim();
  if (!rawValue) return "";
  return unit ? `${rawValue} ${unit}` : rawValue;
}

function humanizeAttributeKey(key: string) {
  return key
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function normalizeSpecLabel(label: string) {
  return label.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function pushUniqueSpecRow(rows: SpecRow[], seen: Set<string>, row: SpecRow) {
  const label = row.label.trim();
  const value = row.value.replace(/\s+/g, " ").trim();
  if (!label || !value) return;

  const key = normalizeSpecLabel(label);
  if (!key || seen.has(key)) return;

  seen.add(key);
  rows.push({ label, value });
}

function extractAttributeSpecRows(attributes: Record<string, ProductAttributeValue>) {
  const rows: SpecRow[] = [];
  const seen = new Set<string>();

  for (const [key, rawValue] of Object.entries(attributes ?? {})) {
    const value = formatAttributeValue(rawValue);
    pushUniqueSpecRow(rows, seen, {
      label: humanizeAttributeKey(key),
      value,
    });
  }

  return rows;
}

function extractTextSpecRows(text: string, seen: Set<string>) {
  const rows: SpecRow[] = [];
  const segments = text
    .replace(/\s+/g, " ")
    .split(/[,;|\n]+/)
    .map((segment) => segment.trim())
    .filter(Boolean);

  for (const segment of segments) {
    let foundKnownLabel = false;

    for (const label of KNOWN_SPEC_LABELS) {
      const pattern = new RegExp(
        `(?:^|[^a-z0-9])(${escapeRegExp(label)})\\s*[-:]\\s*([^,;|]+)`,
        "i",
      );
      const match = segment.match(pattern);
      if (!match) continue;

      foundKnownLabel = true;
      pushUniqueSpecRow(rows, seen, {
        label: humanizeAttributeKey(match[1]),
        value: match[2],
      });
    }

    if (foundKnownLabel) continue;

    const genericMatch = segment.match(/^([A-Za-z][A-Za-z0-9 /&().]{1,36})\s*[-:]\s*(.{1,90})$/);
    if (!genericMatch || /[-:]/.test(genericMatch[2])) continue;

    pushUniqueSpecRow(rows, seen, {
      label: genericMatch[1],
      value: genericMatch[2],
    });
  }

  return rows;
}

function buildProductSpecRows(product: DbProductRow, description: string) {
  const rows = extractAttributeSpecRows(product.attributes);
  const seen = new Set(rows.map((row) => normalizeSpecLabel(row.label)));

  for (const row of extractTextSpecRows(product.title, seen)) {
    rows.push(row);
  }

  for (const row of extractTextSpecRows(description, seen)) {
    rows.push(row);
  }

  return rows;
}

function splitSpecRows(rows: SpecRow[], shortDescription: string) {
  const dimensionRows = rows.filter((row) => DIMENSION_LABEL_PATTERN.test(row.label));
  const detailRows = rows.filter((row) => !DIMENSION_LABEL_PATTERN.test(row.label));

  if (!dimensionRows.length) {
    dimensionRows.push({
      label: "Specification",
      value: shortDescription || "Final specification confirmed with quotation",
    });
  }

  if (!detailRows.length) {
    detailRows.push({
      label: "Commercial use",
      value: "Final material and finish confirmed with quotation",
    });
  }

  return { dimensionRows, detailRows };
}

export function numericIdFromSlug(slug: string) {
  return Math.abs(
    [...slug].reduce((value, character) => (value * 31 + character.charCodeAt(0)) | 0, 0),
  );
}

export function toStorefrontProductCard(row: CatalogueProductRow): StorefrontProductCardData {
  return {
    id: row.id,
    slug: row.slug,
    name: row.title,
    category: row.categoryName ?? "",
    subCategoryName: row.subCategoryName,
    description: row.description,
    attributes: row.attributes,
    image: row.image,
    tag: row.tag,
  };
}

export function toProductDetail(product: DbProductRow): ShopProductDetail {
  const description = plainText(product.description);
  const shortDescription =
    description || "Product details available on request.";
  const specRows = buildProductSpecRows(product, description);
  const { dimensionRows, detailRows } = splitSpecRows(specRows, shortDescription);
  const height =
    dimensionRows.find((row) => /height/i.test(row.label))?.value ??
    dimensionRows[0]?.value ??
    "Final specification confirmed with quotation";
  const width =
    dimensionRows.find((row) => /width/i.test(row.label))?.value ??
    dimensionRows.find((row) => row.value !== height)?.value ??
    dimensionRows[0]?.value ??
    "Final specification confirmed with quotation";
  const material =
    detailRows.find((row) => /material|finish|color|colour/i.test(row.label)) ??
    detailRows[0];
  const secondaryDetail =
    detailRows.find((row) => row.label !== material?.label) ??
    detailRows[0];

  return {
    id: numericIdFromSlug(product.slug),
    slug: product.slug,
    name: product.title,
    category: product.category || "Catering equipment",
    familyId: product.subCategoryId || product.categoryId || product.slug,
    cardSubtitle: shortDescription,
    equipmentFilters: [],
    price: "Quote",
    tag: product.isFeatured ? "Popular" : null,
    image: product.images[0] || "",
    shortDescription,
    longDescription: description || shortDescription,
    rating: 5,
    reviewCountLabel: "Quote-ready product",
    colors: [],
    sizes: [],
    packaging: "Packaging and handling details are confirmed with your quotation.",
    shipping: "Delivery and installation options are confirmed after order review.",
    specs: {
      height,
      width,
      materialLine1: material ? `${material.label}: ${material.value}` : "Commercial hospitality specification",
      materialLine2: secondaryDetail
        ? `${secondaryDetail.label}: ${secondaryDetail.value}`
        : "Final specification confirmed with quotation",
      dimensionRows,
      detailRows,
    },
    reviews: [],
    galleryImages: product.images.slice(1),
  };
}

export type ProductTitleVariant = {
  slug: string;
  card: StorefrontProductCardData;
  detail: ShopProductDetail;
};

export function mapTitleVariants(rows: CatalogueProductRow[]): ProductTitleVariant[] {
  return rows.map((row) => ({
    slug: row.slug,
    card: toStorefrontProductCard(row),
    detail: toProductDetail({
      id: row.id,
      slug: row.slug,
      title: row.title,
      description: row.description,
      category: row.categoryName,
      categoryId: row.categoryId,
      subCategoryId: row.subCategoryId,
      images: row.images ?? (row.image ? [row.image] : []),
      isFeatured: row.tag === "Popular",
      attributes: row.attributes,
    }),
  }));
}

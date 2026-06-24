import type { ShopProductDetail } from "@/lib/shop-products";
import type { StorefrontProductCardData } from "@/components/shop/StorefrontProductCard";
import type { CatalogueProductRow } from "@/lib/catalogue-presets";

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
      height: "See product description",
      width: "See product description",
      materialLine1: "Commercial hospitality specification",
      materialLine2: "Final specification confirmed with quotation",
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

import { eq } from "drizzle-orm";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDb } from "@/db";
import {
  productCategories,
  productSubcategories,
  productTitlePresets,
} from "@/db/schema";
import ProductEquipmentDetail from "@/components/shop/ProductEquipmentDetail";
import {
  SHOP_PRODUCT_CARDS,
  type ProductSize,
  type ShopProductDetail,
} from "@/lib/shop-products";
import type { ProductAttributeValue } from "@/lib/category-template";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function numericIdFromUuid(id: string) {
  return Math.abs(
    id.split("").reduce((hash, char) => ((hash << 5) - hash + char.charCodeAt(0)) | 0, 0)
  );
}

function formatAttributeValue(value: ProductAttributeValue) {
  if (typeof value === "string") return value;
  return `${value.value}${value.unit ? ` ${value.unit}` : ""}`.trim();
}

function attributeSizes(attributes: Record<string, ProductAttributeValue>): ProductSize[] {
  const sizes = Object.entries(attributes)
    .map(([key, value]) => {
      const label = formatAttributeValue(value);
      return label ? { id: key, label: `${key.replace(/_/g, " ")}: ${label}` } : null;
    })
    .filter((item): item is ProductSize => Boolean(item));

  return sizes.length ? sizes : [{ id: "standard", label: "Catalogue format" }];
}

async function getPresetProduct(id: string): Promise<ShopProductDetail | null> {
  const db = getDb();
  if (!db) return null;

  const [preset] = await db
    .select({
      id: productTitlePresets.id,
      title: productTitlePresets.title,
      sourceLabel: productTitlePresets.sourceLabel,
      attributes: productTitlePresets.attributes,
      categoryName: productCategories.name,
      subCategoryName: productSubcategories.name,
    })
    .from(productTitlePresets)
    .innerJoin(productCategories, eq(productTitlePresets.categoryId, productCategories.id))
    .leftJoin(productSubcategories, eq(productTitlePresets.subCategoryId, productSubcategories.id))
    .where(eq(productTitlePresets.id, id))
    .limit(1);

  if (!preset) return null;

  const numericId = numericIdFromUuid(preset.id);
  const fallback = SHOP_PRODUCT_CARDS[numericId % SHOP_PRODUCT_CARDS.length];
  const attrEntries = Object.entries(preset.attributes ?? {});
  const specsText = attrEntries
    .map(([key, value]) => `${key.replace(/_/g, " ")}: ${formatAttributeValue(value)}`)
    .join(" · ");

  return {
    id: numericId,
    name: preset.title,
    category: preset.categoryName,
    familyId: `preset-${preset.id}`,
    cardSubtitle: preset.subCategoryName ?? undefined,
    equipmentFilters: [preset.subCategoryName ?? preset.categoryName],
    price: "Quote",
    tag: null,
    image: fallback.image,
    shortDescription:
      preset.subCategoryName
        ? `${preset.title} from ${preset.subCategoryName}. Configure quantity and add it to your quote basket.`
        : `${preset.title}. Configure quantity and add it to your quote basket.`,
    longDescription:
      specsText ||
      preset.sourceLabel ||
      "Catalogue preset from CaterTech inventory. Final availability, finish and exact product data will be confirmed after quotation review.",
    rating: 4.8,
    reviewCountLabel: "Quote-ready catalogue preset",
    colors: [{ id: "standard", label: "Standard finish" }],
    sizes: attributeSizes(preset.attributes ?? {}),
    packaging: "QC-checked prior to warehouse dispatch or venue staging.",
    shipping:
      "UAE-wide delivery and installation slots are confirmed after RFQ review. Include event date, venue access and quantities in your basket.",
    specs: {
      height: formatAttributeValue(preset.attributes?.height ?? "Confirm with quotation"),
      width: formatAttributeValue(preset.attributes?.width ?? "Confirm with quotation"),
      materialLine1: formatAttributeValue(
        preset.attributes?.material ?? "Commercial hospitality specification"
      ),
      materialLine2: preset.subCategoryName ?? preset.categoryName,
    },
    reviews: [
      {
        name: "CaterTech Catalogue",
        date: "2026",
        rating: 4.8,
        text: "Preset item prepared for fast quotation. Our team confirms stock, finish and delivery details before final approval.",
        initial: "C",
      },
    ],
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await getPresetProduct(id);
  if (!product) return { title: "Product | Catertech" };
  return {
    title: `${product.name} | Catertech Shop`,
    description: product.shortDescription,
  };
}

export default async function ShopPresetProductPage({ params, searchParams }: Props) {
  const [{ id }] = await Promise.all([params, searchParams]);
  const product = await getPresetProduct(id);
  if (!product) notFound();

  return <ProductEquipmentDetail product={product} />;
}

import { eq, and } from "drizzle-orm";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductEquipmentDetail from "@/components/shop/ProductEquipmentDetail";
import { getDb } from "@/db";
import { products } from "@/db/schema";
import type { ShopProductDetail } from "@/lib/shop-products";

type Props = {
  params: Promise<{ id: string }>;
};

function plainText(value: string | null) {
  return (value ?? "")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/\s+/g, " ")
    .trim();
}

async function getStorefrontProduct(slug: string) {
  const db = getDb();
  if (!db) return null;

  const [product] = await db
    .select()
    .from(products)
    .where(and(eq(products.slug, slug), eq(products.published, true)))
    .limit(1);

  return product ?? null;
}

function toProductDetail(product: NonNullable<Awaited<ReturnType<typeof getStorefrontProduct>>>): ShopProductDetail {
  const description = plainText(product.description);
  const shortDescription = product.seoDescription || description || "Product details available on request.";

  return {
    id: Math.abs(
      [...product.slug].reduce((value, character) => (value * 31 + character.charCodeAt(0)) | 0, 0)
    ),
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

export async function generateStaticParams() {
  const db = getDb();
  if (!db) return [];
  const rows = await db
    .select({ slug: products.slug })
    .from(products)
    .where(eq(products.published, true));
  return rows.map(({ slug }) => ({ id: slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = await getStorefrontProduct(id);
  if (!product) {
    return { title: "Product | Catertech" };
  }
  return {
    title: product.seoTitle || `${product.title} | Catertech Shop`,
    description: product.seoDescription || plainText(product.description),
  };
}

export default async function ShopProductPage({ params }: Props) {
  const { id } = await params;
  const product = await getStorefrontProduct(id);
  if (!product) notFound();

  return <ProductEquipmentDetail product={toProductDetail(product)} />;
}

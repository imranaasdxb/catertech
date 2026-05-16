import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductEquipmentDetail from "@/components/shop/ProductEquipmentDetail";
import { getAllShopProductIds, getShopProductDetail } from "@/lib/shop-products";

type Props = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return getAllShopProductIds().map((id) => ({ id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = getShopProductDetail(id);
  if (!product) {
    return { title: "Product | Catertech" };
  }
  return {
    title: `${product.name} | Catertech Shop`,
    description: product.shortDescription,
  };
}

export default async function ShopProductPage({ params }: Props) {
  const { id } = await params;
  const product = getShopProductDetail(id);
  if (!product) notFound();

  return <ProductEquipmentDetail product={product} />;
}

import { eq, and } from "drizzle-orm";

import type { Metadata } from "next";

import { notFound } from "next/navigation";

import ProductEquipmentDetail from "@/components/shop/ProductEquipmentDetail";

import { getDb } from "@/db";

import { productCategories, products } from "@/db/schema";

import {

  getProductTitleVariants,

  getSimilarCatalogueProducts,

} from "@/lib/catalogue-presets";

import {

  mapTitleVariants,

  plainText,

  toProductDetail,

  toStorefrontProductCard,

} from "@/lib/storefront-product";



type Props = {

  params: Promise<{ id: string }>;

};



async function getStorefrontProduct(slug: string) {

  const db = getDb();

  if (!db) return null;



  const [product] = await db

    .select()

    .from(products)

    .where(and(eq(products.slug, slug), eq(products.published, true)))

    .limit(1);



  if (!product) return null;



  let categorySlug: string | null = null;

  if (product.categoryId) {

    const [category] = await db

      .select({ slug: productCategories.slug })

      .from(productCategories)

      .where(eq(productCategories.id, product.categoryId))

      .limit(1);

    categorySlug = category?.slug ?? null;

  }



  return { product, categorySlug };

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

  const result = await getStorefrontProduct(id);

  if (!result) {

    return { title: "Product | Catertech" };

  }

  const { product } = result;

  return {

    title: product.seoTitle || `${product.title} | Catertech Shop`,

    description: product.seoDescription || plainText(product.description),

  };

}



export default async function ShopProductPage({ params }: Props) {

  const { id } = await params;

  const result = await getStorefrontProduct(id);

  if (!result) notFound();



  const { product, categorySlug } = result;



  const [similarRows, titleVariantRows] = await Promise.all([

    getSimilarCatalogueProducts({

      categoryId: product.categoryId,

      excludeProductId: product.id,

      limit: 12,

    }),

    getProductTitleVariants({

      productId: product.id,

      productTitlePresetId: product.productTitlePresetId,

      canonicalProductId: product.canonicalProductId,

      categoryId: product.categoryId,

      subCategoryId: product.subCategoryId,

      title: product.title,

    }),

  ]);



  return (

    <ProductEquipmentDetail

      product={toProductDetail(product)}

      productSlug={product.slug}

      titleVariants={mapTitleVariants(titleVariantRows)}

      similarProducts={similarRows.map(toStorefrontProductCard)}

      categorySlug={categorySlug}

    />

  );

}


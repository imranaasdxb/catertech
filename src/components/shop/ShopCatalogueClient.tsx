"use client";

import FeaturedProductsClient from "@/components/sections/FeaturedProductsClient";
import type {
  CatalogueCategoryRow,
  CatalogueProductRow,
} from "@/lib/catalogue-presets";

export default function ShopCatalogueClient({
  categories,
  products,
  catalogError,
}: {
  categories: CatalogueCategoryRow[];
  products: CatalogueProductRow[];
  catalogError?: string;
}) {
  return (
    <FeaturedProductsClient
      categories={categories}
      products={products}
      catalogError={catalogError}
      compactTop
    />
  );
}

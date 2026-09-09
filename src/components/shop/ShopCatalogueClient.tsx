"use client";

import FeaturedProductsClient from "@/components/sections/FeaturedProductsClient";
import type {
  CatalogueCategoryRow,
  CatalogueProductPagination,
  CatalogueProductRow,
} from "@/lib/catalogue-presets";

export default function ShopCatalogueClient({
  categories,
  products,
  pagination,
  catalogError,
}: {
  categories: CatalogueCategoryRow[];
  products: CatalogueProductRow[];
  pagination?: CatalogueProductPagination;
  catalogError?: string;
}) {
  return (
    <FeaturedProductsClient
      categories={categories}
      products={products}
      pagination={pagination}
      catalogError={catalogError}
      compactTop
    />
  );
}

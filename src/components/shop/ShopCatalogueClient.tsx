"use client";

import FeaturedProductsClient from "@/components/sections/FeaturedProductsClient";
import type {
  CatalogueCategoryRow,
  CataloguePresetRow,
} from "@/lib/catalogue-presets";

export default function ShopCatalogueClient({
  categories,
  presets,
  catalogError,
}: {
  categories: CatalogueCategoryRow[];
  presets: CataloguePresetRow[];
  catalogError?: string;
}) {
  return (
    <FeaturedProductsClient
      categories={categories}
      presets={presets}
      catalogError={catalogError}
    />
  );
}

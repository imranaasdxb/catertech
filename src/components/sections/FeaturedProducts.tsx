import { Suspense } from "react";
import { getCatalogueProductData } from "@/lib/catalogue-presets";
import FeaturedProductsClient, {
  type CategoryRow,
  type ProductRow,
} from "@/components/sections/FeaturedProductsClient";

export default async function FeaturedProducts() {
  const data = await getCatalogueProductData();
  return (
    <Suspense fallback={<div className="min-h-[32rem] bg-offwhite" aria-hidden />}>
      <FeaturedProductsClient
        categories={data.categories as CategoryRow[]}
        products={data.products as ProductRow[]}
        catalogError={data.catalogError}
      />
    </Suspense>
  );
}

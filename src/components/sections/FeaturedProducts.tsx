import { getCatalogueProductData } from "@/lib/catalogue-presets";
import FeaturedProductsClient, {
  type CategoryRow,
  type ProductRow,
} from "@/components/sections/FeaturedProductsClient";

export default async function FeaturedProducts() {
  const data = await getCatalogueProductData({ featuredOnly: true });
  return (
    <FeaturedProductsClient
      categories={data.categories as CategoryRow[]}
      products={data.products as ProductRow[]}
      catalogError={data.catalogError}
    />
  );
}

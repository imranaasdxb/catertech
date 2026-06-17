import { getCataloguePresetData } from "@/lib/catalogue-presets";
import FeaturedProductsClient, {
  type CategoryRow,
  type PresetRow,
} from "@/components/sections/FeaturedProductsClient";

export default async function FeaturedProducts() {
  const data = await getCataloguePresetData();
  return (
    <FeaturedProductsClient
      categories={data.categories as CategoryRow[]}
      presets={data.presets as PresetRow[]}
      catalogError={data.catalogError}
    />
  );
}

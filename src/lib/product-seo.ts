import type { ProductAttributeValue } from "@/lib/category-template";
import { slugify } from "@/lib/slug";

type ProductSeoInput = {
  title: string;
  categoryName?: string | null;
  subCategoryName?: string | null;
  description?: string | null;
  attributes?: Record<string, ProductAttributeValue>;
};

function cleanText(value: string) {
  return value
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function trimSentence(value: string, max = 155) {
  const clean = cleanText(value);
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max - 1).replace(/\s+\S*$/, "")}.`;
}

function formatAttributeValue(value: ProductAttributeValue) {
  if (typeof value === "string") return value.trim();
  return `${value.value}${value.unit ? ` ${value.unit}` : ""}`.trim();
}

function uniqueKeywords(values: string[]) {
  const seen = new Set<string>();
  return values
    .map((value) => cleanText(value).toLowerCase())
    .filter(Boolean)
    .filter((value) => {
      const key = slugify(value);
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, 18);
}

export function generateProductSeo(input: ProductSeoInput) {
  const title = cleanText(input.title) || "CaterTech Product";
  const category = cleanText(input.categoryName ?? "");
  const subcategory = cleanText(input.subCategoryName ?? "");
  const attributes = input.attributes ?? {};
  const attributeValues = Object.values(attributes).map(formatAttributeValue).filter(Boolean);
  const primarySpec = attributeValues[0] ?? "";
  const categoryPart = subcategory || category || "Catering Equipment";
  const titleWithSpec =
    primarySpec && !title.toLowerCase().includes(primarySpec.toLowerCase())
      ? `${title} ${primarySpec}`
      : title;

  const seoTitle = trimSentence(
    `${titleWithSpec} | ${categoryPart} Rental Dubai | CaterTech`,
    60
  );

  const descriptionSource = cleanText(input.description ?? "");
  const fallbackDescription = `Request a quote for ${titleWithSpec} from CaterTech. Suitable for catering, events, hotels and venues across Dubai and UAE.`;
  const seoDescription = trimSentence(descriptionSource || fallbackDescription, 155);

  const searchKeywords = uniqueKeywords([
    title,
    titleWithSpec,
    category,
    subcategory,
    ...attributeValues,
    `${title} Dubai`,
    `${title} rental`,
    `${categoryPart} Dubai`,
    `${categoryPart} UAE`,
    "catering equipment rental",
    "event equipment Dubai",
    "CaterTech",
  ]);

  return {
    seoTitle,
    seoDescription,
    searchKeywords,
  };
}

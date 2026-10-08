import type { ProductAttributeValue } from "@/db/schema";

const SHOW_PRICE_ATTRIBUTE_KEY = "__showPrice";

type ProductAttributes = Record<string, ProductAttributeValue>;

export function getProductShowPrice(attributes: ProductAttributes | null | undefined) {
  const value = attributes?.[SHOW_PRICE_ATTRIBUTE_KEY];
  if (typeof value === "string") return value !== "false";
  if (value && typeof value === "object") return value.value !== "false";
  return true;
}

export function setProductShowPrice(attributes: ProductAttributes, showPrice: boolean) {
  const next = { ...attributes };
  if (showPrice) {
    delete next[SHOW_PRICE_ATTRIBUTE_KEY];
  } else {
    next[SHOW_PRICE_ATTRIBUTE_KEY] = "false";
  }
  return next;
}

export function publicProductAttributes(attributes: ProductAttributes | null | undefined) {
  const next = { ...(attributes ?? {}) };
  delete next[SHOW_PRICE_ATTRIBUTE_KEY];
  return next;
}

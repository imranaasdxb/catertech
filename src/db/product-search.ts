import { sql, type SQLWrapper } from "drizzle-orm";

// Keep the query and expression index identical so PostgreSQL can use the index.
export function productSearchText(product: {
  title: SQLWrapper;
  slug: SQLWrapper;
  productId: SQLWrapper;
  category: SQLWrapper;
  description: SQLWrapper;
  pricePerDayAed: SQLWrapper;
  attributes: SQLWrapper;
}) {
  return sql`(coalesce(${product.title}, '') || ' ' || coalesce(${product.slug}, '') || ' ' || coalesce(${product.productId}, '') || ' ' || coalesce(${product.category}, '') || ' ' || coalesce(${product.description}, '') || ' ' || coalesce(${product.pricePerDayAed}, '') || ' ' || coalesce(${product.attributes}::text, ''))`;
}

export function presetSearchText(preset: { title: SQLWrapper; sourceLabel: SQLWrapper }) {
  return sql`(coalesce(${preset.title}, '') || ' ' || coalesce(${preset.sourceLabel}, ''))`;
}

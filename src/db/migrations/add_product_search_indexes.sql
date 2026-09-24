-- Run outside a transaction: CONCURRENTLY keeps catalogue writes available.
-- Expressions must match src/db/product-search.ts. Both public and admin queries
-- use the full product index, including drafts for authenticated admin searches.
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX CONCURRENTLY IF NOT EXISTS products_search_trgm_idx
  ON products USING gin (
    (coalesce(title, '') || ' ' || coalesce(slug, '') || ' ' || coalesce(product_id, '') || ' ' || coalesce(category, '') || ' ' || coalesce(description, '') || ' ' || coalesce(price_per_day_aed, '') || ' ' || coalesce(attributes::text, '')) gin_trgm_ops
  );

CREATE INDEX CONCURRENTLY IF NOT EXISTS products_sub_category_idx
  ON products (sub_category_id);

CREATE INDEX CONCURRENTLY IF NOT EXISTS product_title_presets_search_trgm_idx
  ON product_title_presets USING gin (
    (coalesce(title, '') || ' ' || coalesce(source_label, '')) gin_trgm_ops
  );

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS seo_title text,
  ADD COLUMN IF NOT EXISTS seo_description text,
  ADD COLUMN IF NOT EXISTS search_keywords text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS canonical_product_id uuid;

CREATE INDEX IF NOT EXISTS products_search_keywords_idx
  ON products USING gin (search_keywords);

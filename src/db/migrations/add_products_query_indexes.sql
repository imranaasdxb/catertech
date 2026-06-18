CREATE INDEX IF NOT EXISTS products_storefront_published_idx
  ON products (is_featured DESC, created_at DESC)
  WHERE published = true;

CREATE INDEX IF NOT EXISTS products_updated_at_idx
  ON products (updated_at DESC);

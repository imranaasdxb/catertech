ALTER TABLE products
  ADD COLUMN IF NOT EXISTS product_title_preset_id uuid;

--> statement-breakpoint
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'products_product_title_preset_id_product_title_presets_id_fk'
  ) THEN
    ALTER TABLE products
      ADD CONSTRAINT products_product_title_preset_id_product_title_presets_id_fk
      FOREIGN KEY (product_title_preset_id)
      REFERENCES product_title_presets(id)
      ON DELETE SET NULL;
  END IF;
END $$;

--> statement-breakpoint
UPDATE products AS product
SET product_title_preset_id = (
  SELECT preset.id
  FROM product_title_presets AS preset
  WHERE preset.category_id = product.category_id
    AND (
      lower(trim(preset.title)) = lower(trim(product.title))
      OR lower(trim(preset.source_label)) = lower(trim(product.title))
    )
  ORDER BY
    CASE
      WHEN lower(trim(preset.title)) = lower(trim(product.title)) THEN 0
      ELSE 1
    END,
    preset.sort_order,
    preset.id
  LIMIT 1
)
WHERE product.product_title_preset_id IS NULL
  AND product.category_id IS NOT NULL
  AND EXISTS (
    SELECT 1
    FROM product_title_presets AS preset
    WHERE preset.category_id = product.category_id
      AND (
        lower(trim(preset.title)) = lower(trim(product.title))
        OR lower(trim(preset.source_label)) = lower(trim(product.title))
      )
  );

--> statement-breakpoint
CREATE INDEX IF NOT EXISTS products_category_idx
  ON products (category_id);

--> statement-breakpoint
CREATE INDEX IF NOT EXISTS products_product_title_preset_idx
  ON products (product_title_preset_id);

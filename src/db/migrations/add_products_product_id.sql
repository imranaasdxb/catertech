ALTER TABLE "products" ADD COLUMN "product_id" text;

WITH normalized AS (
  SELECT
    "id",
    CASE lower(trim(split_part(coalesce("category", ''), '›', 1)))
      WHEN 'furniture' THEN 'FUR'
      WHEN 'glass ware' THEN 'GLW'
      WHEN 'glassware' THEN 'GLW'
      WHEN 'ceramic ware' THEN 'CER'
      WHEN 'dining crockery' THEN 'CER'
      WHEN 'stainless steel ware' THEN 'SSW'
      WHEN 'service crockery' THEN 'SSW'
      WHEN 'dining cutlery' THEN 'DCT'
      WHEN 'buffet equipment' THEN 'BUF'
      WHEN 'kitchen equipment' THEN 'KEQ'
      WHEN 'heavy kitchen equipment' THEN 'KEQ'
      WHEN 'outdoor equipment' THEN 'OUT'
      WHEN 'kitchen utensil' THEN 'KUT'
      WHEN 'kitchen utensils' THEN 'KUT'
      ELSE 'PRD'
    END AS category_code,
    coalesce(
      nullif(
        regexp_replace(
          substring(
            trim(both '-' from regexp_replace(upper("title"), '[^A-Z0-9]+', '-', 'g'))
            from 1 for 48
          ),
          '-+$',
          ''
        ),
        ''
      ),
      'PRODUCT'
    ) AS title_code,
    "created_at"
  FROM "products"
), ranked AS (
  SELECT
    "id",
    category_code,
    title_code,
    row_number() OVER (
      PARTITION BY category_code, title_code
      ORDER BY "created_at", "id"
    ) AS sequence_number
  FROM normalized
)
UPDATE "products" AS product
SET "product_id" = concat(
  ranked.category_code,
  '-',
  ranked.title_code,
  '-',
  lpad(ranked.sequence_number::text, 4, '0')
)
FROM ranked
WHERE product."id" = ranked."id";

ALTER TABLE "products" ALTER COLUMN "product_id" SET NOT NULL;
ALTER TABLE "products"
  ADD CONSTRAINT "products_product_id_unique" UNIQUE ("product_id");

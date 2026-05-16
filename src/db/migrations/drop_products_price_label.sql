-- Apply after updating Drizzle schema (or run `npx drizzle-kit push`).
ALTER TABLE products DROP COLUMN IF EXISTS price_label;

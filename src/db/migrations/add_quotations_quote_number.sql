ALTER TABLE quotations ADD COLUMN IF NOT EXISTS quote_number text;

CREATE UNIQUE INDEX IF NOT EXISTS quotations_quote_number_unique
ON quotations (quote_number)
WHERE quote_number IS NOT NULL;

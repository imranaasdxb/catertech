ALTER TABLE users
  ADD COLUMN IF NOT EXISTS can_update_product_price boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS can_delete_product boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS can_update_product_images boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS can_update_product_details boolean NOT NULL DEFAULT true;

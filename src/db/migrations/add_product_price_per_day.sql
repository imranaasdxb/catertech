ALTER TABLE product_title_presets ADD COLUMN IF NOT EXISTS price_per_day_aed text;
ALTER TABLE products ADD COLUMN IF NOT EXISTS price_per_day_aed text;

WITH preset_prices(category_name, source_label, price_per_day_aed) AS (
  VALUES
  ('Furniture', 'Acrylic Chair (Oval)', '15'),
  ('Furniture', 'Dior Chair', '30'),
  ('Furniture', 'Blue King Chair', '150'),
  ('Furniture', 'Wooden Cocktail Table 100 x 70 cm', '35'),
  ('Furniture', 'Intermetal Cocktail Table 110 x 70 cm', '50'),
  ('Kitchen Equipment', 'Jack Stack Trolly', '175'),
  ('Furniture', 'Wooden Partition 2 x 2 m', '30'),
  ('Furniture', 'Wooden Podium W-34 x H-110 cm', '250'),
  ('Furniture', 'Foldable Extra Bed (L-195x H-59 X W-95)cm ', '120'),
  ('Ceramic Ware', 'Ceramic Bowl 12cm', '1'),
  ('Ceramic Ware', 'Ceramic Bowl 14cm', '2'),
  ('Ceramic Ware', 'Ceramic Bowl 17cm', '2'),
  ('Ceramic Ware', 'Ceramic Bowl 18cm', '2.5'),
  ('Ceramic Ware', 'Ceramic Bowl 20cm', '3'),
  ('Ceramic Ware', 'Ceramic Bowl 23cm', '3'),
  ('Ceramic Ware', 'Ceramic Bowl 24cm', '4'),
  ('Ceramic Ware', 'Ceramic Bowl 25cm', '5'),
  ('Ceramic Ware', 'Ceramic Bowl 35cm', '8'),
  ('Ceramic Ware', 'Ceramic Bowl 41cm', '10'),
  ('Ceramic Ware', 'Ceramic Oval Platter 56 x 20 cm', '15'),
  ('Ceramic Ware', 'Ceramic Oval Fish Platter 50 x 23 cm', '10'),
  ('Ceramic Ware', 'Ceramic Oval Platter 20 x 15 cm', '3'),
  ('Ceramic Ware', 'Ceramic Oval Platter 25 x 18 cm', '3'),
  ('Ceramic Ware', 'Ceramic Oval Platter 30 x 22 cm', '4'),
  ('Ceramic Ware', 'Ceramic Oval Platter 39 x 28 cm', '5'),
  ('Ceramic Ware', 'Ceramic Oval Platter 48 x 18 cm', '10'),
  ('Ceramic Ware', 'Ceramic Rectangle Platter 30 x 17 cm', '4'),
  ('Ceramic Ware', 'Ceramic Rectangle Platter 30 x 24cm (Zig Zag)', '4'),
  ('Ceramic Ware', 'Ceramic Rectangle Platter 37 x 26cm', '5'),
  ('Ceramic Ware', 'Ceramic Rectangle Platter 40 x 20cm', '6'),
  ('Ceramic Ware', 'Ceramic Rectangle Platter 42 x 26cm', '6'),
  ('Ceramic Ware', 'Ceramic Rectangle Platter 42 x 28cm', '8'),
  ('Ceramic Ware', 'Ceramic Rectangle Platter 61 x 26 cm', '10'),
  ('Glass Ware', 'Water Goblet', '0.9'),
  ('Glass Ware', 'White Wine Glass Normal', '0.9'),
  ('Glass Ware', 'Martini Glass', '1.5'),
  ('Glass Ware', 'Red Wine Glass Long Stem', '0.9'),
  ('Glass Ware', 'Beer Glass', '1.5'),
  ('Glass Ware', 'Juice Glass', '0.8'),
  ('Glass Ware', 'Rock Glass / Whisky Glass', '0.9'),
  ('Glass Ware', 'Glass Jug', '3'),
  ('Glass Ware', 'Hencen Glass', '1.5'),
  ('Glass Ware', 'Champagne Saucer Glass', '1.5'),
  ('Glass Ware', 'Margarita Glass', '1.5'),
  ('Buffet Equipment', 'Square Glass Top Chafing Dish with Insert', '40'),
  ('Kitchen Utensil', 'Round Insert 6.5cm', '5'),
  ('Kitchen Equipment', 'Electric Water Boiler', '50'),
  ('Buffet Equipment', 'Coffee Urn', '40'),
  ('Dining Cutlery', 'Soup Spoon', '0.9'),
  ('Dining Cutlery', 'Dinner Spoon', '0.9'),
  ('Dining Cutlery', 'B & B Knife', '0.9'),
  ('Kitchen Utensil', 'Steak Knife', '0.9'),
  ('Dining Cutlery', 'Tea Spoon', '0.8'),
  ('Buffet Equipment', 'Service Fork', '1.5'),
  ('Buffet Equipment', 'Service Spoon', '1.5'),
  ('Buffet Equipment', 'Service Ladle', '1.5'),
  ('Buffet Equipment', 'Soup Laddel ( Mix )', '1.5'),
  ('Dining Cutlery', 'Golden Desert Plate 20cm', '2'),
  ('Ceramic Ware', 'Golden B & B Plate 15cm', '1.75'),
  ('Kitchen Equipment', 'Conveyor Bread Toaster', '250'),
  ('Kitchen Equipment', 'microwave oven', '50'),
  ('Kitchen Equipment', 'Electric Saj Oven', '250'),
  ('Kitchen Equipment', 'Table Top Dough Roller (Single Phase)', '150'),
  ('Kitchen Equipment', 'Pie Warmer', '175'),
  ('Kitchen Equipment', 'Salamander', '200'),
  ('Outdoor Equipment', 'Ice Cream Machine ', '500'),
  ('Kitchen Equipment', 'Ice Cube Machine', '350'),
  ('Kitchen Equipment', 'Juice Blender', '50'),
  ('Kitchen Equipment', 'Slush Machine', '350'),
  ('Kitchen Equipment', 'Coffee Grinder', '450'),
  ('Kitchen Equipment', 'Electric Cambro Box', '150'),
  ('Kitchen Equipment', 'Tilting Pan 120 Ltrs', '550'),
  ('Kitchen Equipment', 'S.S. Double Bowl Pot Wash Sink', '200'),
  ('Kitchen Equipment', 'Queen Mary Trolley', '150'),
  ('Kitchen Utensil', 'S.S.Rice Stainer ( Mix )', '30'),
  ('Kitchen Utensil', 'S.S. Parat', '5'),
  ('Stainless Steel Ware', 'S.S. Dimsum Steamer 5 Layer ', '250'),
  ('Kitchen Utensil', 'Rice Cutter', '1.5'),
  ('Kitchen Utensil', 'Wooden Rolling Pin', '2'),
  ('Kitchen Utensil', 'Non Stick Fry Pan (30cm-70, Big-8)', '5'),
  ('Kitchen Utensil', 'Copper Lagan', '150'),
  ('Kitchen Utensil', 'Copper Parat', '75'),
  ('Kitchen Utensil', 'Bar Mat 30 x 20 cm', '5'),
  ('Buffet Equipment', 'Black Slate 22 x 22 cm', '15'),
  ('Outdoor Equipment', 'Garbage Bin With Pedal & Wheel ', '25'),
  ('Outdoor Equipment', 'Cambro Box - (h-55,W-37,L-55cm), capacity-1/1 GN 6 pc)', '50'),
  ('Kitchen Equipment', 'Nacho Warmer', '250'),
  ('Stainless Steel Ware', 'S.S. Bread Basket', '3'),
  ('Ceramic Ware', 'Ceramic Tea Stand 2 Layer', '10'),
  ('Stainless Steel Ware', 'S.S.Tea Stand 2 Layer', '8'),
  ('Buffet Equipment', 'Wooden Sushi Boat', '125'),
  ('Outdoor Equipment', 'Mist Fan ', '110'),
  ('Outdoor Equipment', 'Flip Chart (Non - Adjustable)', '50'),
  ('Buffet Equipment', 'Tea & Coffee Flask', '5'),
  ('Stainless Steel Ware', 'S.S.Mixing Bowl 20cm to 50 cm', '5')
)
UPDATE product_title_presets preset
SET price_per_day_aed = preset_prices.price_per_day_aed,
    updated_at = now()
FROM preset_prices
JOIN product_categories category
  ON category.name = preset_prices.category_name
WHERE preset.category_id = category.id
  AND preset.source_label = preset_prices.source_label;

UPDATE products product
SET price_per_day_aed = preset.price_per_day_aed,
    updated_at = now()
FROM product_title_presets preset
WHERE product.product_title_preset_id = preset.id
  AND preset.price_per_day_aed IS NOT NULL
  AND product.price_per_day_aed IS NULL;

UPDATE products product
SET price_per_day_aed = preset.price_per_day_aed,
    updated_at = now()
FROM product_title_presets preset
WHERE product.price_per_day_aed IS NULL
  AND preset.price_per_day_aed IS NOT NULL
  AND product.category_id = preset.category_id
  AND (
    lower(regexp_replace(trim(product.title), '\s+', ' ', 'g')) =
      lower(regexp_replace(trim(preset.source_label), '\s+', ' ', 'g'))
    OR lower(regexp_replace(trim(product.title), '\s+', ' ', 'g')) =
      lower(regexp_replace(trim(preset.title), '\s+', ' ', 'g'))
  );

WITH direct_product_prices(product_title, price_per_day_aed) AS (
  VALUES
  ('Square Table (76 x 76 cm)', '18'),
  ('Square Table (90 x 90 cm)', '25'),
  ('Tea Pot / Coffee Pot  (Tea Kettle)', '3'),
  ('Tea Kettle', '50'),
  ('2/1 G.N Trolley', '125'),
  ('1/1 G.N Trolley', '100')
)
UPDATE products product
SET price_per_day_aed = direct_product_prices.price_per_day_aed,
    updated_at = now()
FROM direct_product_prices
WHERE lower(regexp_replace(trim(product.title), '\s+', ' ', 'g')) =
      lower(regexp_replace(trim(direct_product_prices.product_title), '\s+', ' ', 'g'));

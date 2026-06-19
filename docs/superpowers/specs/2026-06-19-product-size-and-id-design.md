# Product Size Fields and Automatic Product IDs

## Scope

This change affects only product creation, the reusable category-field control it uses, the product-create API, and the product database schema. Existing title presets, automatic attribute filling, category selection, publishing, SEO, images, editing, and storefront behavior remain unchanged.

## Add Size Control

The category-fields header will always display an **Add size** control. Its dropdown will contain the reusable dimension fields needed across the nine catalogue categories:

- Dimensions
- Size
- Length
- Width
- Height
- Diameter

Selecting an item adds its input to the current product without changing the saved category template. Fields already present on the form will not be offered again. The existing automatic preset/category fields remain editable and removable. The existing general **Add field** control remains responsible for other fields from the selected category and can continue to appear only when unused category fields remain.

## Automatic Product ID

The `products` table will receive a unique, non-null `productId` text column for new products. The product-create API will generate this value on the server; the create form will not ask the user to enter it.

The format is:

`CATEGORY-TITLE-0001`

Category prefixes are:

| Category | Prefix |
| --- | --- |
| Furniture | FUR |
| Glass Ware | GLW |
| Ceramic Ware | CER |
| Stainless Steel Ware | SSW |
| Dining Cutlery | DCT |
| Buffet Equipment | BUF |
| Kitchen Equipment | KEQ |
| Outdoor Equipment | OUT |
| Kitchen Utensil | KUT |

The title portion is a stable uppercase code derived from the product title. Non-alphanumeric characters become separators, repeated separators are collapsed, and the result is capped at 48 characters with any trailing separator removed. For example, `Chiavari Chair` becomes `CHIAVARI-CHAIR`.

The four-digit sequence is independent for each category/title combination. Examples:

- `FUR-CHIAVARI-CHAIR-0001`
- `FUR-CHIAVARI-CHAIR-0002`
- `GLW-CHAMPAGNE-GLASS-0001`

The database uniqueness constraint is authoritative. Generation will determine the next matching sequence and retry on a uniqueness conflict so simultaneous product creation cannot silently produce duplicate IDs.

## Existing Rows and Migration

The schema change must be deployable when products already exist. The migration will add the column, backfill existing products deterministically from their category/title and creation order, then apply the unique and non-null constraints. New records are generated only by the create API after deployment.

## API Response and Errors

On success, the product-create API will return `productId` with the existing internal UUID and slug. If a supported category cannot be resolved, creation will fail with a clear validation response instead of storing an unrelated prefix. Database failures will continue through the route's existing error behavior.

## Verification

Focused tests will cover:

- Product ID normalization and all nine category prefixes.
- Independent sequence generation by category/title.
- Duplicate-conflict retry behavior.
- Add size remaining visible when all current category fields are already active.
- Preventing duplicate size fields.
- Preserving automatic preset values when a manual size is added.

Only focused test, type-check, or lint commands needed for these touched files will be run. No unrelated files will be modified.

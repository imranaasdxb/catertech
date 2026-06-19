import assert from "node:assert/strict";
import test from "node:test";

import {
  buildProductIdPrefix,
  nextProductId,
  normalizeProductTitleCode,
  reserveProductId,
} from "./product-id";

test("maps all nine catalogue categories to stable prefixes", () => {
  const expected = new Map([
    ["Furniture", "FUR"],
    ["Glass Ware", "GLW"],
    ["Ceramic Ware", "CER"],
    ["Stainless Steel Ware", "SSW"],
    ["Dining Cutlery", "DCT"],
    ["Buffet Equipment", "BUF"],
    ["Kitchen Equipment", "KEQ"],
    ["Outdoor Equipment", "OUT"],
    ["Kitchen Utensil", "KUT"],
  ]);

  for (const [category, prefix] of expected) {
    assert.equal(buildProductIdPrefix(category, "Test Product"), `${prefix}-TEST-PRODUCT`);
  }
});

test("normalizes and bounds the title code", () => {
  assert.equal(normalizeProductTitleCode("  Chiavari & Chair  "), "CHIAVARI-CHAIR");
  const code = normalizeProductTitleCode(
    "Extra long professional stainless steel banquet service product with accessories"
  );
  assert.ok(code.length <= 48);
  assert.doesNotMatch(code, /-$/);
});

test("rejects categories outside the canonical nine", () => {
  assert.throws(
    () => buildProductIdPrefix("Unknown", "Test Product"),
    /Unsupported product category/
  );
});

test("uses a separate next sequence for an exact category and title prefix", () => {
  assert.equal(
    nextProductId("FUR-CHIAVARI-CHAIR", [
      "FUR-CHIAVARI-CHAIR-0001",
      "FUR-CHIAVARI-CHAIR-0004",
      "GLW-CHIAVARI-CHAIR-0099",
      "FUR-CHIAVARI-TABLE-0050",
    ]),
    "FUR-CHIAVARI-CHAIR-0005"
  );
});

test("retries reservation after a product-id uniqueness conflict", async () => {
  let loadCount = 0;
  const attempted: string[] = [];

  const result = await reserveProductId(
    "FUR-CHIAVARI-CHAIR",
    async () => (loadCount++ === 0 ? [] : ["FUR-CHIAVARI-CHAIR-0001"]),
    async (candidate) => {
      attempted.push(candidate);
      if (attempted.length === 1) {
        throw {
          code: "23505",
          constraint: "products_product_id_unique",
        };
      }
      return { productId: candidate };
    }
  );

  assert.deepEqual(attempted, [
    "FUR-CHIAVARI-CHAIR-0001",
    "FUR-CHIAVARI-CHAIR-0002",
  ]);
  assert.deepEqual(result, { productId: "FUR-CHIAVARI-CHAIR-0002" });
});

test("does not retry unrelated database failures", async () => {
  const error = { code: "23505", constraint: "products_slug_unique" };
  await assert.rejects(
    reserveProductId("FUR-CHAIR", async () => [], async () => Promise.reject(error)),
    (received) => received === error
  );
});

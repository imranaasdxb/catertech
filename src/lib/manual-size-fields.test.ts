import assert from "node:assert/strict";
import test from "node:test";

import {
  MANUAL_SIZE_FIELDS,
  getAvailableManualSizeFields,
} from "./manual-size-fields";

test("offers the six reusable product size fields", () => {
  assert.deepEqual(
    MANUAL_SIZE_FIELDS.map((field) => field.key),
    ["dimensions", "size", "length", "width", "height", "diameter"]
  );
});

test("excludes size fields that are already active", () => {
  assert.deepEqual(
    getAvailableManualSizeFields([{ key: "size" }, { key: "height" }]).map(
      (field) => field.key
    ),
    ["dimensions", "length", "width", "diameter"]
  );
});

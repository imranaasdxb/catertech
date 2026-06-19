const CATEGORY_PREFIXES: Record<string, string> = {
  furniture: "FUR",
  "glass ware": "GLW",
  glassware: "GLW",
  "ceramic ware": "CER",
  "dining crockery": "CER",
  "stainless steel ware": "SSW",
  "service crockery": "SSW",
  "dining cutlery": "DCT",
  "buffet equipment": "BUF",
  "kitchen equipment": "KEQ",
  "heavy kitchen equipment": "KEQ",
  "outdoor equipment": "OUT",
  "kitchen utensil": "KUT",
  "kitchen utensils": "KUT",
};

export function normalizeProductTitleCode(title: string) {
  const normalized = title
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return normalized.slice(0, 48).replace(/-+$/g, "") || "PRODUCT";
}

export function buildProductIdPrefix(categoryName: string, title: string) {
  const categoryRoot = categoryName.split("›")[0]?.trim().toLowerCase() ?? "";
  const categoryPrefix = CATEGORY_PREFIXES[categoryRoot];
  if (!categoryPrefix) {
    throw new Error(`Unsupported product category: ${categoryName || "none"}`);
  }
  return `${categoryPrefix}-${normalizeProductTitleCode(title)}`;
}

export function nextProductId(prefix: string, existingIds: string[]) {
  const escapedPrefix = prefix.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const exactIdPattern = new RegExp(`^${escapedPrefix}-(\\d{4})$`);
  let maximum = 0;

  for (const productId of existingIds) {
    const match = productId.match(exactIdPattern);
    if (match) maximum = Math.max(maximum, Number(match[1]));
  }

  if (maximum >= 9999) {
    throw new Error(`Product ID sequence exhausted for ${prefix}`);
  }
  return `${prefix}-${String(maximum + 1).padStart(4, "0")}`;
}

function isProductIdUniqueViolation(error: unknown) {
  let current = error;
  for (let depth = 0; depth < 4 && current && typeof current === "object"; depth += 1) {
    const databaseError = current as {
      code?: unknown;
      constraint?: unknown;
      message?: unknown;
      cause?: unknown;
    };
    const productIdConstraint =
      typeof databaseError.constraint === "string" &&
      databaseError.constraint.includes("product_id");
    const productIdMessage =
      typeof databaseError.message === "string" &&
      databaseError.message.includes("product_id");
    if (databaseError.code === "23505" && (productIdConstraint || productIdMessage)) {
      return true;
    }
    current = databaseError.cause;
  }
  return false;
}

export async function reserveProductId<T>(
  prefix: string,
  loadExistingIds: () => Promise<string[]>,
  reserve: (candidate: string) => Promise<T>,
  maxAttempts = 5
) {
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const candidate = nextProductId(prefix, await loadExistingIds());
    try {
      return await reserve(candidate);
    } catch (error) {
      if (!isProductIdUniqueViolation(error) || attempt === maxAttempts - 1) {
        throw error;
      }
    }
  }

  throw new Error(`Unable to reserve product ID for ${prefix}`);
}

const PRICE_TEXT_PATTERN = /^\d+(?:\.\d+)?(?:\s*(?:\/|-)\s*\d+(?:\.\d+)?)*$/;

export function normalizePricePerDayAed(value: unknown) {
  if (typeof value !== "string") return null;

  const normalized = value
    .replace(/\bAED\b/gi, "")
    .replace(/\bper\s+day\b/gi, "")
    .replace(/\/\s*day\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();

  if (!normalized) return null;
  if (normalized.length > 40 || !PRICE_TEXT_PATTERN.test(normalized)) return null;
  return normalized;
}

export function formatPricePerDayAed(value: string | null | undefined) {
  const normalized = normalizePricePerDayAed(value ?? "");
  return normalized ? `AED ${normalized} / day` : "Quote";
}

export function formatAdminPricePerDayAed(value: string | null | undefined) {
  const normalized = normalizePricePerDayAed(value ?? "");
  return normalized ? `AED ${normalized}` : "-";
}

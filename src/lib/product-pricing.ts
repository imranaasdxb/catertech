const PRICE_TEXT_PATTERN = /^\d+(?:\.\d+)?(?:\s*(?:\/|-)\s*\d+(?:\.\d+)?)*$/;

function formatPriceNumber(value: string) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric.toFixed(2) : value;
}

function formatPriceText(value: string) {
  return value.replace(/\d+(?:\.\d+)?/g, formatPriceNumber);
}

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
  return formatPriceText(normalized);
}

export function formatPricePerDayAed(value: string | null | undefined) {
  const normalized = normalizePricePerDayAed(value ?? "");
  return normalized ? `AED ${normalized} / day` : "Quote";
}

export function formatAdminPricePerDayAed(value: string | null | undefined) {
  const normalized = normalizePricePerDayAed(value ?? "");
  return normalized ? `AED ${normalized}` : "-";
}

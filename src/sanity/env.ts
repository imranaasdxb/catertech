const DEFAULT_SANITY_API_VERSION = "2025-01-01";

function trimEnv(value: string | undefined) {
  const cleaned = value?.trim().replace(/^["']|["']$/g, "");
  return cleaned ?? ("" as string);
}

function normalizeSanityApiVersion(raw: string | undefined) {
  const value = trimEnv(raw);
  if (!value) return DEFAULT_SANITY_API_VERSION;
  if (value === "1") return "1";
  if (/^\d{4}-\d{2}-\d{2}$/u.test(value)) return value;
  return DEFAULT_SANITY_API_VERSION;
}

export const sanityProjectId = trimEnv(process.env.NEXT_PUBLIC_SANITY_PROJECT_ID);
export const sanityDataset =
  trimEnv(process.env.NEXT_PUBLIC_SANITY_DATASET) || "production";
export const sanityApiVersion = normalizeSanityApiVersion(
  process.env.NEXT_PUBLIC_SANITY_API_VERSION,
);

export function hasSanityConfig() {
  return Boolean(sanityProjectId && sanityDataset && sanityApiVersion);
}

export const MIN_SEARCH_LENGTH = 3;
export const MAX_SEARCH_LENGTH = 160;

export function normalizeSearch(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

export function escapeSearchPattern(value: string) {
  return `%${value.replace(/[\\%_]/g, "\\$&")}%`;
}

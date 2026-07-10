const SHORT_MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

function toDate(value: Date | string | number | null | undefined): Date | null {
  if (value == null || value === "") return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

/** Stable date for SSR and client: `24 Jun 2026` */
export function formatUtcDate(value: Date | string | number | null | undefined): string {
  const date = toDate(value);
  if (!date) return "—";
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = SHORT_MONTHS[date.getUTCMonth()];
  const year = date.getUTCFullYear();
  return `${day} ${month} ${year}`;
}

/** Stable date-time for SSR and client: `10 Jul 2026, 15:59` */
export function formatUtcDateTime(value: Date | string | number | null | undefined): string {
  const date = toDate(value);
  if (!date) return "—";
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = SHORT_MONTHS[date.getUTCMonth()];
  const year = date.getUTCFullYear();
  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");
  return `${day} ${month} ${year}, ${hours}:${minutes}`;
}

/** Stable integer formatting for SSR and client: `4000` → `4,000` */
export function formatInteger(value: number): string {
  if (!Number.isFinite(value)) return "0";
  return String(Math.trunc(value)).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function isSanityCdnUrl(url: string) {
  try {
    return new URL(url).hostname === "cdn.sanity.io";
  } catch {
    return url.includes("cdn.sanity.io");
  }
}

/** Build a Sanity CDN URL with transforms so the browser loads a right-sized asset. */
export function sanityImageUrl(
  url: string,
  options: { width: number; height?: number; quality?: number } = { width: 1200 },
) {
  if (!isSanityCdnUrl(url)) return url;

  const parsed = new URL(url);
  parsed.searchParams.set("auto", "format");
  parsed.searchParams.set("fit", "crop");
  parsed.searchParams.set("q", String(options.quality ?? 80));
  parsed.searchParams.set("w", String(options.width));
  if (options.height) parsed.searchParams.set("h", String(options.height));
  return parsed.toString();
}

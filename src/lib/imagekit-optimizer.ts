type ImageKitOptions = {
  width?: number;
  quality?: number | "auto";
  format?: "auto" | "webp";
  crop?: "at_max" | "maintain_ratio";
};

function isImageKitUrl(parsed: URL) {
  const configured = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT || process.env.IMAGEKIT_URL_ENDPOINT || "";
  if (configured) {
    try {
      const endpoint = new URL(configured);
      if (parsed.hostname === endpoint.hostname) return true;
    } catch {
      // Ignore malformed environment values and fall back to host detection.
    }
  }

  return parsed.hostname.includes("imagekit.io");
}

export function imageKitUrl(src: string | null | undefined, options: ImageKitOptions = {}) {
  if (!src) return src ?? "";

  try {
    const parsed = new URL(src);
    if (!isImageKitUrl(parsed)) return src;

    const transforms = [
      options.width ? `w-${options.width}` : null,
      `q-${options.quality ?? "auto"}`,
      `f-${options.format ?? "auto"}`,
      options.crop ? `c-${options.crop}` : null,
    ].filter(Boolean);

    if (!transforms.length) return src;
    parsed.searchParams.set("tr", transforms.join(","));
    return parsed.toString();
  } catch {
    return src;
  }
}

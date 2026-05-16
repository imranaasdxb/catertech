/** Upload image via `POST /api/upload` with multipart `file` — server writes to R2 (no CORS to R2). */
export async function uploadMediaToR2PublicUrl(
  file: File
): Promise<
  | { ok: true; url: string }
  | { ok: false; status: number; message: string }
> {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch("/api/upload", {
    method: "POST",
    credentials: "include",
    body: fd,
  });

  let message = "Upload failed.";
  if (!res.ok) {
    try {
      const err = (await res.json()) as { error?: string };
      if (typeof err?.error === "string") message = err.error;
    } catch {
      message = `Server error (${res.status})`;
    }
    if (res.status === 401) message = "Sign in to admin first.";
    return { ok: false, status: res.status, message };
  }

  const data = (await res.json()) as { publicUrl?: string | null };
  if (!data.publicUrl || typeof data.publicUrl !== "string") {
    return { ok: false, status: 500, message: "Invalid upload response." };
  }

  return { ok: true, url: data.publicUrl };
}

/** Parse comma-separated (or newline-separated) image URLs from a form field. */
export function parseStoredImageUrls(raw: string): string[] {
  return raw
    .split(/[,，\n]+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

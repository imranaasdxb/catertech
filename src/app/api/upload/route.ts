import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { createPresignedPutUrl, putPublicObjectToR2 } from "@/lib/r2";
import { isAdminSession } from "@/lib/auth-user";

export const maxDuration = 120;

const MAX_IMAGE_BYTES = 15 * 1024 * 1024;

/** When the client sends octet-stream or empty type, infer from filename (common on Windows). */
function resolveMultipartMediaMime(filename: string, reported: string): string | null {
  const r = (reported || "").trim().toLowerCase();
  if (r.startsWith("image/")) return reported;
  if (r === "video/mp4" || r === "video/webm") return reported;

  const extMatch = /\.([^.]+)$/i.exec(filename || "");
  const ext = extMatch ? extMatch[1].toLowerCase() : "";
  const img: Record<string, string> = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    webp: "image/webp",
    bmp: "image/bmp",
    svg: "image/svg+xml",
    heic: "image/heic",
    heif: "image/heif",
    avif: "image/avif",
    tif: "image/tiff",
    tiff: "image/tiff",
    ico: "image/x-icon",
  };
  const vid: Record<string, string> = {
    mp4: "video/mp4",
    webm: "video/webm",
  };
  if (r === "" || r === "application/octet-stream") {
    if (img[ext]) return img[ext];
    if (vid[ext]) return vid[ext];
  }
  return null;
}

async function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

/** Multipart: body field `file` — stored from the server on R2 (no browser→R2 CORS). */
export async function POST(request: Request) {
  if (!(await isAdminSession())) {
    return unauthorized();
  }

  const contentTypeHdr = request.headers.get("content-type") ?? "";
  if (contentTypeHdr.includes("multipart/form-data")) {
    let form: FormData;
    try {
      form = await request.formData();
    } catch {
      return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
    }

    const raw = form.get("file");
    if (!raw || typeof raw === "string") {
      return NextResponse.json({ error: "Missing file" }, { status: 400 });
    }

    const blob = raw as Blob;
    const filename =
      "name" in raw && typeof (raw as File).name === "string" ? (raw as File).name : "image";
    const reported = blob.type || "";
    const mime =
      resolveMultipartMediaMime(filename, reported) ??
      (reported || "application/octet-stream");
    const okMedia =
      mime.startsWith("image/") ||
      mime === "video/mp4" ||
      mime === "video/webm";
    if (!okMedia) {
      return NextResponse.json(
        { error: "Only image files or MP4/WebM videos are allowed" },
        { status: 400 }
      );
    }

    const buf = Buffer.from(await blob.arrayBuffer());
    if (buf.byteLength > MAX_IMAGE_BYTES) {
      return NextResponse.json(
        { error: `Image too large (max ${Math.floor(MAX_IMAGE_BYTES / (1024 * 1024))} MB)` },
        { status: 413 }
      );
    }

    const safeName = (filename || "file").replace(/[^\w.\-]/g, "_");
    const key = `uploads/${new Date().toISOString().slice(0, 10)}/${randomUUID()}-${safeName}`;

    const result = await putPublicObjectToR2({ key, body: buf, contentType: mime });
    if (!result?.publicUrl) {
      return NextResponse.json(
        {
          error:
            "Upload not configured — set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME, R2_PUBLIC_URL",
        },
        { status: 503 }
      );
    }

    return NextResponse.json({ publicUrl: result.publicUrl, key });
  }

  let body: { filename?: string; contentType?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const filename = (body.filename || "file").replace(/[^\w.\-]/g, "_");
  const contentType = body.contentType || "application/octet-stream";
  const key = `uploads/${new Date().toISOString().slice(0, 10)}/${randomUUID()}-${filename}`;

  const result = await createPresignedPutUrl(key, contentType);
  if (!result?.publicUrl) {
    return NextResponse.json(
      {
        error:
          "Upload not configured — set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME, R2_PUBLIC_URL",
      },
      { status: 503 }
    );
  }

  return NextResponse.json({
    presignedUrl: result.presignedUrl,
    publicUrl: result.publicUrl,
    key,
  });
}

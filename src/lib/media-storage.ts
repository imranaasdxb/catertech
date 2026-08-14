import { createPresignedPutUrl, putPublicObjectToR2 } from "@/lib/cloudflare-r2-storage";
import { isImageKitConfigured, putPublicObjectToImageKit } from "@/lib/imagekit-storage";

const UPLOAD_PROVIDER = process.env.MEDIA_UPLOAD_PROVIDER?.trim().toLowerCase();

export function getActiveMediaProvider(): "imagekit" | "r2" {
  if (UPLOAD_PROVIDER === "r2") return "r2";
  if (UPLOAD_PROVIDER === "imagekit") return "imagekit";
  return isImageKitConfigured() ? "imagekit" : "r2";
}

export function mediaStorageConfigMessage() {
  return "Upload not configured — set IMAGEKIT_PRIVATE_KEY for ImageKit, or set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME, R2_PUBLIC_URL for Cloudflare R2";
}

export async function putPublicMediaObject(options: {
  key: string;
  body: Buffer;
  contentType: string;
}): Promise<{ publicUrl: string | null; key: string } | null> {
  const provider = getActiveMediaProvider();

  if (provider === "imagekit") {
    const result = await putPublicObjectToImageKit(options);
    return result ? { publicUrl: result.publicUrl, key: result.key } : null;
  }

  const result = await putPublicObjectToR2(options);
  return result ? { publicUrl: result.publicUrl, key: options.key } : null;
}

export async function createPresignedMediaPutUrl(key: string, contentType: string) {
  if (getActiveMediaProvider() === "imagekit") return null;
  return createPresignedPutUrl(key, contentType);
}

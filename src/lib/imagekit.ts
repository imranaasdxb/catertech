type ImageKitUploadResponse = {
  url?: string;
  fileId?: string;
  filePath?: string;
  name?: string;
};

function requireImageKitEnv() {
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
  if (!privateKey) return null;
  return { privateKey };
}

function splitKeyForImageKit(key: string) {
  const normalized = key.replace(/^\/+/, "");
  const slashIndex = normalized.lastIndexOf("/");
  if (slashIndex === -1) {
    return { folder: "/", fileName: normalized || "file" };
  }

  return {
    folder: `/${normalized.slice(0, slashIndex)}`,
    fileName: normalized.slice(slashIndex + 1) || "file",
  };
}

function imageKitAuthHeader(privateKey: string) {
  return `Basic ${Buffer.from(`${privateKey}:`).toString("base64")}`;
}

export function isImageKitConfigured() {
  return Boolean(requireImageKitEnv());
}

export async function putPublicObjectToImageKit(options: {
  key: string;
  body: Buffer;
  contentType: string;
}): Promise<{ publicUrl: string; key: string; fileId?: string } | null> {
  const env = requireImageKitEnv();
  if (!env) return null;

  const { folder, fileName } = splitKeyForImageKit(options.key);
  const bytes = new Uint8Array(options.body);
  const form = new FormData();
  form.append("file", new Blob([bytes], { type: options.contentType }), fileName);
  form.append("fileName", fileName);
  form.append("folder", folder);
  form.append("useUniqueFileName", "false");

  const response = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
    method: "POST",
    headers: {
      Authorization: imageKitAuthHeader(env.privateKey),
    },
    body: form,
  });

  let data: ImageKitUploadResponse | { message?: string } = {};
  try {
    data = (await response.json()) as ImageKitUploadResponse | { message?: string };
  } catch {
    // ImageKit normally returns JSON, but preserve a useful status if it does not.
  }

  if (!response.ok) {
    const message =
      "message" in data && typeof data.message === "string"
        ? data.message
        : `ImageKit upload failed (${response.status})`;
    throw new Error(message);
  }

  if (!("url" in data) || typeof data.url !== "string" || !data.url) {
    throw new Error("ImageKit upload response did not include a public URL");
  }

  return {
    publicUrl: data.url,
    key: typeof data.filePath === "string" && data.filePath ? data.filePath : options.key,
    fileId: typeof data.fileId === "string" ? data.fileId : undefined,
  };
}

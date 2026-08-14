import { S3Client, PutObjectCommand, CopyObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

function requireR2Env() {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKey = process.env.R2_ACCESS_KEY_ID;
  const secretKey = process.env.R2_SECRET_ACCESS_KEY;
  const bucket = process.env.R2_BUCKET_NAME;
  if (!accountId || !accessKey || !secretKey || !bucket) return null;
  return { accountId, accessKey, secretKey, bucket };
}

export function getR2Client() {
  const env = requireR2Env();
  if (!env) return null;
  return new S3Client({
    region: "auto",
    endpoint: `https://${env.accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: env.accessKey,
      secretAccessKey: env.secretKey,
    },
  });
}

export async function createPresignedPutUrl(
  key: string,
  contentType: string,
  expiresInSec = 3600
) {
  const env = requireR2Env();
  const client = getR2Client();
  if (!env || !client) return null;

  const command = new PutObjectCommand({
    Bucket: env.bucket,
    Key: key,
    ContentType: contentType,
  });

  const url = await getSignedUrl(client, command, { expiresIn: expiresInSec });
  const publicBase = process.env.R2_PUBLIC_URL?.replace(/\/$/, "");
  const publicUrl = publicBase ? `${publicBase}/${key}` : null;
  return { presignedUrl: url, publicUrl };
}

/** Server-side put (browser never talks to R2 — avoids bucket CORS on presigned PUT). */
export async function putPublicObjectToR2(options: {
  key: string;
  body: Buffer;
  contentType: string;
}): Promise<{ publicUrl: string | null } | null> {
  const env = requireR2Env();
  const client = getR2Client();
  if (!env || !client) return null;

  await client.send(
    new PutObjectCommand({
      Bucket: env.bucket,
      Key: options.key,
      Body: options.body,
      ContentType: options.contentType,
    })
  );

  const publicBase = process.env.R2_PUBLIC_URL?.replace(/\/$/, "");
  const publicUrl = publicBase ? `${publicBase}/${options.key}` : null;
  return { publicUrl };
}

/** Copy object inside the same bucket (e.g. finalize signup avatar path). */
export async function copyObjectWithinR2(
  sourceKey: string,
  destKey: string
): Promise<boolean> {
  const env = requireR2Env();
  const client = getR2Client();
  if (!env || !client) return false;

  await client.send(
    new CopyObjectCommand({
      Bucket: env.bucket,
      CopySource: `${env.bucket}/${sourceKey}`,
      Key: destKey,
    })
  );
  return true;
}

export async function deleteObjectFromR2(key: string): Promise<boolean> {
  const env = requireR2Env();
  const client = getR2Client();
  if (!env || !client) return false;
  await client.send(
    new DeleteObjectCommand({
      Bucket: env.bucket,
      Key: key,
    })
  );
  return true;
}

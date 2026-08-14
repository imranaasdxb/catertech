import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { rfqSubmissions, type RfqAttachmentFile } from "@/db/schema";
import { isImageKitConfigured, putPublicObjectToImageKit } from "@/lib/imagekit-storage";
import { putPublicMediaObject } from "@/lib/media-storage";
import { rfqSchema } from "@/lib/validations/forms";

function generateReferenceNo() {
  const stamp = new Date().toISOString().slice(0, 10).replaceAll("-", "");
  const suffix = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `RFQ-${stamp}-${suffix}`;
}

function resolveAttachmentMime(filename: string, reported: string): string {
  const r = (reported || "").trim().toLowerCase();
  if (r && r !== "application/octet-stream") return reported;
  const extMatch = /\.([^.]+)$/i.exec(filename || "");
  const ext = extMatch ? extMatch[1].toLowerCase() : "";
  const map: Record<string, string> = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    webp: "image/webp",
    pdf: "application/pdf",
    doc: "application/msword",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  };
  return map[ext] ?? "application/octet-stream";
}

const MAX_INLINE_IMAGE_BYTES = 4 * 1024 * 1024;
const MAX_RFQ_ATTACHMENT_BYTES = 8 * 1024 * 1024;
const MAX_RFQ_TOTAL_ATTACHMENT_BYTES = 15 * 1024 * 1024;
const MAX_RFQ_ATTACHMENTS = 5;
const ALLOWED_RFQ_ATTACHMENT_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

function isImageMime(type: string, filename: string) {
  if (type.startsWith("image/")) return true;
  return /\.(png|jpe?g|gif|webp|svg|bmp|avif)$/i.test(filename);
}

function isAllowedAttachmentMime(type: string) {
  return ALLOWED_RFQ_ATTACHMENT_TYPES.has(type);
}

async function uploadAttachmentFile(
  buf: Buffer,
  fileName: string,
  contentType: string,
): Promise<string | null> {
  const safeName = (fileName || "file").replace(/[^\w.\-]/g, "_");
  const key = `rfq/${new Date().toISOString().slice(0, 10)}/${randomUUID()}-${safeName}`;

  if (isImageKitConfigured()) {
    const imageKitResult = await putPublicObjectToImageKit({
      key,
      body: buf,
      contentType,
    });
    if (imageKitResult?.publicUrl) return imageKitResult.publicUrl;
  }

  const result = await putPublicMediaObject({
    key,
    body: buf,
    contentType,
  });
  return result?.publicUrl ?? null;
}

async function storeAttachmentFiles(files: File[]): Promise<RfqAttachmentFile[]> {
  const stored: RfqAttachmentFile[] = [];
  if (files.length > MAX_RFQ_ATTACHMENTS) {
    throw new Error(`Upload up to ${MAX_RFQ_ATTACHMENTS} attachments.`);
  }

  const totalBytes = files.reduce((sum, file) => sum + file.size, 0);
  if (totalBytes > MAX_RFQ_TOTAL_ATTACHMENT_BYTES) {
    throw new Error("Attachments are too large in total.");
  }

  for (const file of files) {
    const resolvedType = file.type || resolveAttachmentMime(file.name, file.type);
    if (file.size > MAX_RFQ_ATTACHMENT_BYTES) {
      throw new Error("Each attachment must be 8 MB or smaller.");
    }
    if (!isAllowedAttachmentMime(resolvedType)) {
      throw new Error("Only images, PDF, DOC, or DOCX attachments are allowed.");
    }

    const meta: RfqAttachmentFile = {
      name: file.name,
      size: file.size,
      type: resolvedType,
    };

    const buf = Buffer.from(await file.arrayBuffer());

    try {
      meta.url = await uploadAttachmentFile(buf, file.name, meta.type);
    } catch {
      // Fall through to inline storage for images when cloud upload fails.
    }

    if (!meta.url && isImageMime(meta.type, file.name) && buf.byteLength <= MAX_INLINE_IMAGE_BYTES) {
      meta.dataUrl = `data:${meta.type};base64,${buf.toString("base64")}`;
    }

    stored.push(meta);
  }

  return stored;
}

async function readPayload(request: Request) {
  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    const payload = Object.fromEntries(
      Array.from(formData.entries()).filter(([, value]) => typeof value === "string")
    );
    const attachmentFiles = await storeAttachmentFiles(
      formData
        .getAll("attachments")
        .filter((value): value is File => value instanceof File && value.size > 0),
    );

    return { payload, attachmentFiles };
  }

  const payload = await request.json();
  return { payload, attachmentFiles: [] };
}

export async function POST(request: Request) {
  const db = getDb();
  if (!db) {
    return NextResponse.json(
      { error: "Database not configured" },
      { status: 503 }
    );
  }

  let body: unknown;
  let attachmentFiles: { name: string; size: number; type: string }[] = [];
  try {
    const parsedBody = await readPayload(request);
    body = parsedBody.payload;
    attachmentFiles = parsedBody.attachmentFiles;
  } catch {
    return NextResponse.json({ error: "Invalid request body or attachments" }, { status: 400 });
  }

  const parsed = rfqSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const d = parsed.data;
  const referenceNo = generateReferenceNo();
  const [row] = await db
    .insert(rfqSubmissions)
    .values({
      referenceNo,
      companyName: d.companyName,
      tradeLicenceNo: d.tradeLicenceNo || null,
      contactPerson: d.contactPerson,
      phone: d.phone,
      email: d.email,
      budgetAed: d.budgetAed || null,
      emirate: d.emirate || null,
      eventName: d.eventName,
      eventType: d.eventType,
      eventDate: d.eventDate || null,
      eventDuration: d.eventDuration || null,
      venueName: d.venueName || null,
      venueLocation: d.venueLocation || null,
      expectedGuests: d.expectedGuests || null,
      attachmentFiles,
      notes: d.notes || null,
    })
    .returning({ id: rfqSubmissions.id, referenceNo: rfqSubmissions.referenceNo });

  return NextResponse.json({
    ok: true,
    id: row.id,
    reference: row.referenceNo,
  });
}

import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { rfqSubmissions, type RfqAttachmentFile } from "@/db/schema";
import { isImageKitConfigured, putPublicObjectToImageKit } from "@/lib/imagekit";
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

function isImageMime(type: string, filename: string) {
  if (type.startsWith("image/")) return true;
  return /\.(png|jpe?g|gif|webp|svg|bmp|avif)$/i.test(filename);
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

  for (const file of files) {
    const meta: RfqAttachmentFile = {
      name: file.name,
      size: file.size,
      type: file.type || resolveAttachmentMime(file.name, file.type),
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
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
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

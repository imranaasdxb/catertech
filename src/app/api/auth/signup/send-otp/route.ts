import { randomUUID } from "crypto";
import { eq, and, desc } from "drizzle-orm";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import {
  OTP_RESEND_COOLDOWN_SEC,
  OTP_TTL_MIN,
  SIGNUP_OTP_PURPOSE,
  generateNumericOtp,
  hashOtp,
} from "@/lib/auth-otp";
import { getDb } from "@/db";
import { authOtpChallenges, users } from "@/db/schema";
import {
  getActiveMediaProvider,
  mediaStorageConfigMessage,
  putPublicMediaObject,
} from "@/lib/media-storage";
import { sendSignupOtpEmail } from "@/lib/smtp-mail";
import { sanitizeEmail, sanitizeText } from "@/lib/security";

export const runtime = "nodejs";

const MAX_AVATAR_BYTES = 4 * 1024 * 1024;

function bad(msg: string, status = 400) {
  return NextResponse.json({ error: msg }, { status });
}

export async function POST(request: Request) {
  if (process.env.NODE_ENV === "production" && !process.env.AUTH_OTP_PEPPER) {
    return bad("Server misconfigured — set AUTH_OTP_PEPPER", 503);
  }

  const db = getDb();
  if (!db) return bad("Database not configured", 503);

  const contentType = request.headers.get("content-type") || "";
  if (!contentType.includes("multipart/form-data")) {
    return bad("Expected multipart form data");
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return bad("Invalid form data");
  }

  const fullName = sanitizeText(String(form.get("fullName") || ""));
  const email = sanitizeEmail(String(form.get("email") || ""));
  const password = String(form.get("password") || "");
  const confirmPassword = String(form.get("confirmPassword") || "");

  if (!fullName || fullName.length > 120) return bad("Invalid full name");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return bad("Invalid email");
  if (password.length < 8) return bad("Password must be at least 8 characters");
  if (password !== confirmPassword) return bad("Passwords do not match");

  const existing = await db.select({ id: users.id }).from(users).where(eq(users.email, email));
  if (existing.length) return bad("An account with this email already exists", 409);

  const recent = await db
    .select({ createdAt: authOtpChallenges.createdAt })
    .from(authOtpChallenges)
    .where(
      and(
        eq(authOtpChallenges.email, email),
        eq(authOtpChallenges.purpose, SIGNUP_OTP_PURPOSE)
      )
    )
    .orderBy(desc(authOtpChallenges.createdAt))
    .limit(1);

  if (recent[0]) {
    const ageSec = (Date.now() - new Date(recent[0].createdAt).getTime()) / 1000;
    if (ageSec < OTP_RESEND_COOLDOWN_SEC) {
      return bad(`Please wait ${Math.ceil(OTP_RESEND_COOLDOWN_SEC - ageSec)}s before resending`, 429);
    }
  }

  const pendingId = randomUUID();
  const avatarField = form.get("avatar");
  let profileImageUrl: string | null = null;
  let profilePendingKey: string | null = null;

  if (avatarField && typeof avatarField !== "string") {
    const blob = avatarField as Blob;
    if (blob.size > MAX_AVATAR_BYTES) {
      return bad("Profile image must be under 4 MB", 413);
    }
    const filename =
      "name" in avatarField && typeof (avatarField as File).name === "string"
        ? (avatarField as File).name
        : "avatar";
    const extMatch = /\.([^.]+)$/i.exec(filename);
    const ext = (extMatch ? extMatch[1] : "jpg").toLowerCase();
    const allowed = new Set(["jpg", "jpeg", "png", "webp", "gif"]);
    if (!allowed.has(ext)) return bad("Use JPG, PNG, WebP, or GIF for profile image");
    const mime =
      ext === "jpg" || ext === "jpeg"
        ? "image/jpeg"
        : ext === "png"
          ? "image/png"
          : ext === "webp"
            ? "image/webp"
            : "image/gif";
    const buf = Buffer.from(await blob.arrayBuffer());
    const key = `profiles/signup-pending/${pendingId}/avatar.${ext}`;
    let put: Awaited<ReturnType<typeof putPublicMediaObject>>;
    try {
      put = await putPublicMediaObject({ key, body: buf, contentType: mime });
    } catch (error) {
      return bad(error instanceof Error ? error.message : "Image upload failed", 502);
    }
    if (!put?.publicUrl) {
      return bad(mediaStorageConfigMessage(), 503);
    }
    profileImageUrl = put.publicUrl;
    profilePendingKey = put.key;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const otp = generateNumericOtp(6);
  const otpHash = hashOtp(email, otp);
  const expiresAt = new Date(Date.now() + OTP_TTL_MIN * 60 * 1000);

  await db
    .delete(authOtpChallenges)
    .where(
      and(
        eq(authOtpChallenges.email, email),
        eq(authOtpChallenges.purpose, SIGNUP_OTP_PURPOSE)
      )
    );

  await db.insert(authOtpChallenges).values({
    id: pendingId,
    email,
    purpose: SIGNUP_OTP_PURPOSE,
    otpHash,
    expiresAt,
    attemptCount: 0,
    signupPayload: {
      fullName,
      passwordHash,
      profileImageUrl,
      profilePendingKey,
    },
  });

  const mailed = await sendSignupOtpEmail(email, otp);
  if (!mailed.ok) {
    await db.delete(authOtpChallenges).where(eq(authOtpChallenges.id, pendingId));
    if (profilePendingKey && getActiveMediaProvider() === "r2") {
      const { deleteObjectFromR2 } = await import("@/lib/cloudflare-r2-storage");
      await deleteObjectFromR2(profilePendingKey);
    }
    return NextResponse.json({ error: mailed.reason }, { status: 503 });
  }

  return NextResponse.json({
    ok: true,
    otpTtlMinutes: OTP_TTL_MIN,
    message:
      process.env.NODE_ENV !== "production"
        ? "(Dev) OTP was sent via SMTP — check Spam if using Gmail."
        : undefined,
  });
}

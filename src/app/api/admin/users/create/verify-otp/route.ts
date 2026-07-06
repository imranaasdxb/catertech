import { and, desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { ADMIN_ROLE } from "@/lib/admin-roles";
import { getDb } from "@/db";
import { authOtpChallenges, users } from "@/db/schema";
import { OTP_MAX_ATTEMPTS, verifyOtpHash } from "@/lib/auth-otp";
import { getSessionUser } from "@/lib/auth-user";

export const runtime = "nodejs";

const CREATE_USER_OTP_PURPOSE = "admin-user-create";

function bad(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(request: Request) {
  const sess = await getSessionUser();
  if (!sess || sess.role !== "superadmin") return bad("Forbidden", 403);

  const db = getDb();
  if (!db) return bad("Database not configured", 503);

  let body: { email?: string; code?: string };
  try {
    body = await request.json();
  } catch {
    return bad("Invalid JSON");
  }

  const email = String(body.email || "").trim().toLowerCase();
  const code = String(body.code || "").trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return bad("Valid email is required.");
  if (!/^\d{6}$/.test(code)) return bad("Enter the 6-digit code.");

  const rows = await db
    .select()
    .from(authOtpChallenges)
    .where(and(eq(authOtpChallenges.email, email), eq(authOtpChallenges.purpose, CREATE_USER_OTP_PURPOSE)))
    .orderBy(desc(authOtpChallenges.createdAt))
    .limit(1);

  const ch = rows[0];
  if (!ch) return bad("No pending user creation. Send a code first.", 404);

  if (new Date(ch.expiresAt).getTime() < Date.now()) {
    await db.delete(authOtpChallenges).where(eq(authOtpChallenges.id, ch.id));
    return bad("Code expired. Send a new one.", 410);
  }

  if ((ch.attemptCount ?? 0) >= OTP_MAX_ATTEMPTS) {
    await db.delete(authOtpChallenges).where(eq(authOtpChallenges.id, ch.id));
    return bad("Too many attempts. Send a new code.", 429);
  }

  if (!verifyOtpHash(email, code, ch.otpHash)) {
    await db
      .update(authOtpChallenges)
      .set({ attemptCount: (ch.attemptCount ?? 0) + 1 })
      .where(eq(authOtpChallenges.id, ch.id));
    return bad("Invalid code.", 401);
  }

  const payload = ch.signupPayload;
  if (!payload?.fullName || !payload.passwordHash) {
    await db.delete(authOtpChallenges).where(eq(authOtpChallenges.id, ch.id));
    return bad("Incomplete user payload.", 500);
  }

  try {
    await db.insert(users).values({
      email,
      fullName: payload.fullName,
      passwordHash: payload.passwordHash,
      profileImageUrl: payload.profileImageUrl,
      role: ADMIN_ROLE,
    });
  } catch {
    await db.delete(authOtpChallenges).where(eq(authOtpChallenges.id, ch.id));
    return bad("Could not create account. Email may already be registered.", 409);
  }

  await db.delete(authOtpChallenges).where(eq(authOtpChallenges.id, ch.id));
  return NextResponse.json({ ok: true });
}

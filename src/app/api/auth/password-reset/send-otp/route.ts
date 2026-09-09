import { and, desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { authOtpChallenges, users } from "@/db/schema";
import { isStaffRole } from "@/lib/admin-roles";
import {
  generateNumericOtp,
  hashOtp,
  OTP_RESEND_COOLDOWN_SEC,
  OTP_TTL_MIN,
  PASSWORD_RESET_OTP_PURPOSE,
} from "@/lib/auth-otp";
import { sendPasswordResetOtpEmail } from "@/lib/smtp-mail";
import {
  checkRateLimit,
  getClientIp,
  rateLimitResponse,
  sanitizeEmail,
} from "@/lib/security";

export const runtime = "nodejs";

function bad(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(request: Request) {
  if (process.env.NODE_ENV === "production" && !process.env.AUTH_OTP_PEPPER) {
    return bad("Server misconfigured - set AUTH_OTP_PEPPER", 503);
  }

  const db = getDb();
  if (!db) return bad("Database not configured", 503);

  let body: { email?: string };
  try {
    body = await request.json();
  } catch {
    return bad("Invalid JSON");
  }

  const email = sanitizeEmail(String(body.email || ""));
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return bad("Valid email is required.");
  }

  const limit = checkRateLimit({
    key: `password-reset:${getClientIp(request)}:${email}`,
    limit: 5,
    windowMs: 15 * 60 * 1000,
  });
  if (!limit.ok) return rateLimitResponse(limit.retryAfterSec);

  const recent = await db
    .select({ createdAt: authOtpChallenges.createdAt })
    .from(authOtpChallenges)
    .where(
      and(
        eq(authOtpChallenges.email, email),
        eq(authOtpChallenges.purpose, PASSWORD_RESET_OTP_PURPOSE)
      )
    )
    .orderBy(desc(authOtpChallenges.createdAt))
    .limit(1);

  if (recent[0]) {
    const ageSec = (Date.now() - new Date(recent[0].createdAt).getTime()) / 1000;
    if (ageSec < OTP_RESEND_COOLDOWN_SEC) {
      return NextResponse.json({ ok: true, otpTtlMinutes: OTP_TTL_MIN });
    }
  }

  const row = await db
    .select({
      id: users.id,
      email: users.email,
      fullName: users.fullName,
      role: users.role,
    })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  const user = row[0];

  if (!user || !isStaffRole(user.role)) {
    return NextResponse.json({ ok: true, otpTtlMinutes: OTP_TTL_MIN });
  }

  const otp = generateNumericOtp(6);

  await db
    .delete(authOtpChallenges)
    .where(
      and(
        eq(authOtpChallenges.email, email),
        eq(authOtpChallenges.purpose, PASSWORD_RESET_OTP_PURPOSE)
      )
    );

  await db.insert(authOtpChallenges).values({
    email,
    purpose: PASSWORD_RESET_OTP_PURPOSE,
    otpHash: hashOtp(email, otp),
    expiresAt: new Date(Date.now() + OTP_TTL_MIN * 60 * 1000),
    attemptCount: 0,
    signupPayload: null,
  });

  const mailed = await sendPasswordResetOtpEmail({
    toEmail: user.email,
    code: otp,
    fullName: user.fullName,
  });
  if (!mailed.ok) {
    await db
      .delete(authOtpChallenges)
      .where(
        and(
          eq(authOtpChallenges.email, email),
          eq(authOtpChallenges.purpose, PASSWORD_RESET_OTP_PURPOSE)
        )
      );
    return bad(mailed.reason, 503);
  }

  return NextResponse.json({ ok: true, otpTtlMinutes: OTP_TTL_MIN });
}

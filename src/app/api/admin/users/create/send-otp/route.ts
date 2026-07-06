import { and, desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getDb } from "@/db";
import { authOtpChallenges, users } from "@/db/schema";
import {
  generateNumericOtp,
  hashOtp,
  OTP_RESEND_COOLDOWN_SEC,
  OTP_TTL_MIN,
} from "@/lib/auth-otp";
import { getSessionUser } from "@/lib/auth-user";
import { sendAdminCreatedUserOtpEmail } from "@/lib/smtp-mail";

export const runtime = "nodejs";

const CREATE_USER_OTP_PURPOSE = "admin-user-create";

function bad(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(request: Request) {
  if (process.env.NODE_ENV === "production" && !process.env.AUTH_OTP_PEPPER) {
    return bad("Server misconfigured - set AUTH_OTP_PEPPER", 503);
  }

  const sess = await getSessionUser();
  if (!sess || sess.role !== "superadmin") return bad("Forbidden", 403);

  const db = getDb();
  if (!db) return bad("Database not configured", 503);

  let body: {
    fullName?: string;
    email?: string;
    password?: string;
    profileImageUrl?: string | null;
  };
  try {
    body = await request.json();
  } catch {
    return bad("Invalid JSON");
  }

  const fullName = String(body.fullName || "").trim();
  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");
  const profileImageUrl =
    typeof body.profileImageUrl === "string" ? body.profileImageUrl.trim() || null : null;

  if (!fullName || fullName.length > 120) return bad("Invalid full name.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return bad("Valid email is required.");
  if (password.length < 8) return bad("Password must be at least 8 characters.");

  const existing = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);
  if (existing[0]) return bad("An account with this email already exists.", 409);

  const recent = await db
    .select({ createdAt: authOtpChallenges.createdAt })
    .from(authOtpChallenges)
    .where(and(eq(authOtpChallenges.email, email), eq(authOtpChallenges.purpose, CREATE_USER_OTP_PURPOSE)))
    .orderBy(desc(authOtpChallenges.createdAt))
    .limit(1);

  if (recent[0]) {
    const ageSec = (Date.now() - new Date(recent[0].createdAt).getTime()) / 1000;
    if (ageSec < OTP_RESEND_COOLDOWN_SEC) {
      return bad(`Please wait ${Math.ceil(OTP_RESEND_COOLDOWN_SEC - ageSec)}s before resending`, 429);
    }
  }

  const otp = generateNumericOtp(6);
  const passwordHash = await bcrypt.hash(password, 12);

  await db
    .delete(authOtpChallenges)
    .where(and(eq(authOtpChallenges.email, email), eq(authOtpChallenges.purpose, CREATE_USER_OTP_PURPOSE)));

  await db.insert(authOtpChallenges).values({
    email,
    purpose: CREATE_USER_OTP_PURPOSE,
    otpHash: hashOtp(email, otp),
    expiresAt: new Date(Date.now() + OTP_TTL_MIN * 60 * 1000),
    attemptCount: 0,
    signupPayload: {
      fullName,
      passwordHash,
      profileImageUrl,
      profilePendingKey: null,
    },
  });

  const mailed = await sendAdminCreatedUserOtpEmail({ toEmail: email, code: otp, fullName });
  if (!mailed.ok) {
    await db
      .delete(authOtpChallenges)
      .where(and(eq(authOtpChallenges.email, email), eq(authOtpChallenges.purpose, CREATE_USER_OTP_PURPOSE)));
    return bad(mailed.reason, 503);
  }

  return NextResponse.json({ ok: true, otpTtlMinutes: OTP_TTL_MIN });
}

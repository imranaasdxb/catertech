import { desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { authOtpChallenges, users } from "@/db/schema";
import {
  generateNumericOtp,
  hashOtp,
  OTP_RESEND_COOLDOWN_SEC,
  OTP_TTL_MIN,
} from "@/lib/auth-otp";
import { getSessionUser } from "@/lib/auth-user";
import { sendAdminEmailChangeOtpEmail } from "@/lib/smtp-mail";

export const runtime = "nodejs";

type Params = {
  params: Promise<{ id: string }>;
};

function purpose(userId: string) {
  return `admin-email-change:${userId}`;
}

function bad(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(request: Request, { params }: Params) {
  if (process.env.NODE_ENV === "production" && !process.env.AUTH_OTP_PEPPER) {
    return bad("Server misconfigured - set AUTH_OTP_PEPPER", 503);
  }

  const sess = await getSessionUser();
  if (!sess || sess.role !== "superadmin") return bad("Forbidden", 403);

  const db = getDb();
  if (!db) return bad("Database not configured", 503);

  const { id } = await params;
  let body: { email?: string };
  try {
    body = await request.json();
  } catch {
    return bad("Invalid JSON");
  }

  const email = String(body.email || "").trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return bad("Valid email is required.");

  const [target] = await db
    .select({ id: users.id, fullName: users.fullName, email: users.email })
    .from(users)
    .where(eq(users.id, id))
    .limit(1);
  if (!target) return bad("User not found.", 404);
  if (target.email.trim().toLowerCase() === email) return bad("This is already the current email.");

  const existing = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  if (existing[0]) return bad("That email is already used by another user.", 409);

  const changePurpose = purpose(id);
  const recent = await db
    .select({ createdAt: authOtpChallenges.createdAt })
    .from(authOtpChallenges)
    .where(eq(authOtpChallenges.purpose, changePurpose))
    .orderBy(desc(authOtpChallenges.createdAt))
    .limit(1);

  if (recent[0]) {
    const ageSec = (Date.now() - new Date(recent[0].createdAt).getTime()) / 1000;
    if (ageSec < OTP_RESEND_COOLDOWN_SEC) {
      return bad(`Please wait ${Math.ceil(OTP_RESEND_COOLDOWN_SEC - ageSec)}s before resending`, 429);
    }
  }

  const otp = generateNumericOtp(6);
  await db
    .delete(authOtpChallenges)
    .where(eq(authOtpChallenges.purpose, changePurpose));

  await db.insert(authOtpChallenges).values({
    email,
    purpose: changePurpose,
    otpHash: hashOtp(email, otp),
    expiresAt: new Date(Date.now() + OTP_TTL_MIN * 60 * 1000),
    attemptCount: 0,
    signupPayload: null,
  });

  const mailed = await sendAdminEmailChangeOtpEmail({
    toEmail: email,
    code: otp,
    adminName: target.fullName,
  });
  if (!mailed.ok) {
    await db
      .delete(authOtpChallenges)
      .where(eq(authOtpChallenges.purpose, changePurpose));
    return bad(mailed.reason, 503);
  }

  return NextResponse.json({ ok: true, otpTtlMinutes: OTP_TTL_MIN });
}

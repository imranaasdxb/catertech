import { and, desc, eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getDb } from "@/db";
import { authOtpChallenges, users } from "@/db/schema";
import { isStaffRole } from "@/lib/admin-roles";
import {
  OTP_MAX_ATTEMPTS,
  PASSWORD_RESET_OTP_PURPOSE,
  verifyOtpHash,
} from "@/lib/auth-otp";
import {
  authCookieBaseOptions,
  createUserAuthToken,
  getAuthSigningSecret,
  USER_AUTH_COOKIE,
} from "@/lib/user-auth-session";
import { clearLoginFailures, getClientIp, sanitizeEmail } from "@/lib/security";

export const runtime = "nodejs";

function bad(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(request: Request) {
  const secret = getAuthSigningSecret();
  const db = getDb();
  if (!secret) return bad("Server misconfigured - set AUTH_SESSION_SECRET or SESSION_SIGNING_SECRET", 503);
  if (!db) return bad("Database not configured", 503);

  let body: {
    email?: string;
    code?: string;
    password?: string;
    confirmPassword?: string;
  };
  try {
    body = await request.json();
  } catch {
    return bad("Invalid JSON");
  }

  const email = sanitizeEmail(String(body.email || ""));
  const code = String(body.code || "").trim();
  const password = String(body.password || "");
  const confirmPassword = String(body.confirmPassword || "");

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return bad("Valid email is required.");
  if (!/^\d{6}$/.test(code)) return bad("Enter the 6-digit code.");
  if (password.length < 8) return bad("Password must be at least 8 characters.");
  if (password !== confirmPassword) return bad("Passwords do not match.");

  const rows = await db
    .select()
    .from(authOtpChallenges)
    .where(
      and(
        eq(authOtpChallenges.email, email),
        eq(authOtpChallenges.purpose, PASSWORD_RESET_OTP_PURPOSE)
      )
    )
    .orderBy(desc(authOtpChallenges.createdAt))
    .limit(1);

  const ch = rows[0];
  if (!ch) return bad("No pending reset. Send a code first.", 404);

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

  const row = await db
    .select({ id: users.id, role: users.role })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  const user = row[0];
  const roleNorm = user?.role.trim().toLowerCase() || "";

  if (!user || !isStaffRole(roleNorm)) {
    await db.delete(authOtpChallenges).where(eq(authOtpChallenges.id, ch.id));
    return bad("Could not reset this account.", 403);
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await db
    .update(users)
    .set({ passwordHash, lastLoginAt: new Date(), updatedAt: new Date() })
    .where(eq(users.id, user.id));
  await db.delete(authOtpChallenges).where(eq(authOtpChallenges.id, ch.id));

  const ttlSec = 60 * 60 * 24 * 14;
  const token = await createUserAuthToken(secret, {
    userId: user.id,
    role: roleNorm,
    ttlSec,
  });
  const jar = await cookies();
  jar.set(USER_AUTH_COOKIE, token, authCookieBaseOptions(ttlSec));
  clearLoginFailures(`${email}:${getClientIp(request)}`);

  return NextResponse.json({ ok: true, role: roleNorm });
}

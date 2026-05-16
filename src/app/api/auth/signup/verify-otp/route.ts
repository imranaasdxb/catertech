import { eq, and, desc } from "drizzle-orm";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { ADMIN_ROLE } from "@/lib/admin-roles";
import {
  OTP_MAX_ATTEMPTS,
  SIGNUP_OTP_PURPOSE,
  verifyOtpHash,
} from "@/lib/auth-otp";
import { copyObjectWithinR2, deleteObjectFromR2 } from "@/lib/r2";
import { getDb } from "@/db";
import { authOtpChallenges, users } from "@/db/schema";
import {
  authCookieBaseOptions,
  createUserAuthToken,
  getAuthSigningSecret,
  USER_AUTH_COOKIE,
} from "@/lib/user-auth-session";

export const runtime = "nodejs";

function bad(msg: string, status = 400) {
  return NextResponse.json({ error: msg }, { status });
}

export async function POST(request: Request) {
  const secret = getAuthSigningSecret();
  const db = getDb();
  if (!secret) return bad("Server misconfigured — set AUTH_SESSION_SECRET or SESSION_SIGNING_SECRET", 503);
  if (!db) return bad("Database not configured", 503);

  let body: { email?: string; code?: string };
  try {
    body = await request.json();
  } catch {
    return bad("Invalid JSON");
  }

  const email = String(body.email || "").trim().toLowerCase();
  const code = String(body.code || "").trim();

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return bad("Invalid email");
  if (!/^\d{6}$/.test(code)) return bad("Enter the 6-digit code");

  const rows = await db
    .select()
    .from(authOtpChallenges)
    .where(
      and(
        eq(authOtpChallenges.email, email),
        eq(authOtpChallenges.purpose, SIGNUP_OTP_PURPOSE)
      )
    )
    .orderBy(desc(authOtpChallenges.createdAt))
    .limit(1);

  const ch = rows[0];
  if (!ch) return bad("No pending sign-up — request a code first", 404);

  if (new Date(ch.expiresAt).getTime() < Date.now()) {
    await db.delete(authOtpChallenges).where(eq(authOtpChallenges.id, ch.id));
    return bad("Code expired — send a new one", 410);
  }

  if ((ch.attemptCount ?? 0) >= OTP_MAX_ATTEMPTS) {
    await db.delete(authOtpChallenges).where(eq(authOtpChallenges.id, ch.id));
    return bad("Too many attempts — start sign-up again", 429);
  }

  if (!verifyOtpHash(email, code, ch.otpHash)) {
    await db
      .update(authOtpChallenges)
      .set({ attemptCount: (ch.attemptCount ?? 0) + 1 })
      .where(eq(authOtpChallenges.id, ch.id));
    return bad("Invalid code", 401);
  }

  const payload = ch.signupPayload;
  if (!payload?.fullName || !payload.passwordHash) {
    await db.delete(authOtpChallenges).where(eq(authOtpChallenges.id, ch.id));
    return bad("Incomplete sign-up payload", 500);
  }

  const assignedRole = ADMIN_ROLE;

  let createdId: string;
  try {
    const [created] = await db
      .insert(users)
      .values({
        email,
        fullName: payload.fullName,
        passwordHash: payload.passwordHash,
        profileImageUrl: payload.profileImageUrl,
        role: assignedRole,
        lastLoginAt: new Date(),
      })
      .returning({ id: users.id });
    createdId = created.id;
  } catch {
    await db.delete(authOtpChallenges).where(eq(authOtpChallenges.id, ch.id));
    return bad("Could not create account — email may already be registered", 409);
  }

  await db.delete(authOtpChallenges).where(eq(authOtpChallenges.id, ch.id));

  if (payload.profilePendingKey && payload.profileImageUrl) {
    const extMatch = /\.([^.]+)$/.exec(payload.profilePendingKey);
    const ext = extMatch?.[1]?.toLowerCase() || "jpg";
    const destKey = `profiles/${createdId}/avatar.${ext}`;
    const copied = await copyObjectWithinR2(payload.profilePendingKey, destKey);
    if (copied) {
      await deleteObjectFromR2(payload.profilePendingKey);
      const publicBase = process.env.R2_PUBLIC_URL?.replace(/\/$/, "");
      const newUrl = publicBase ? `${publicBase}/${destKey}` : payload.profileImageUrl;
      await db
        .update(users)
        .set({ profileImageUrl: newUrl, updatedAt: new Date() })
        .where(eq(users.id, createdId));
    }
  }

  const ttlSec = 60 * 60 * 24 * 14;
  const token = await createUserAuthToken(secret, {
    userId: createdId,
    role: assignedRole,
    ttlSec,
  });
  const jar = await cookies();
  jar.set(USER_AUTH_COOKIE, token, authCookieBaseOptions(ttlSec));

  return NextResponse.json({ ok: true, userId: createdId, role: assignedRole });
}

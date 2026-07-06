import { and, desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { authOtpChallenges, users } from "@/db/schema";
import { OTP_MAX_ATTEMPTS, verifyOtpHash } from "@/lib/auth-otp";
import { getSessionUser } from "@/lib/auth-user";

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
  const sess = await getSessionUser();
  if (!sess || sess.role !== "superadmin") return bad("Forbidden", 403);

  const db = getDb();
  if (!db) return bad("Database not configured", 503);

  const { id } = await params;
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

  const changePurpose = purpose(id);
  const rows = await db
    .select()
    .from(authOtpChallenges)
    .where(and(eq(authOtpChallenges.email, email), eq(authOtpChallenges.purpose, changePurpose)))
    .orderBy(desc(authOtpChallenges.createdAt))
    .limit(1);

  const ch = rows[0];
  if (!ch) return bad("No pending email change. Send a code first.", 404);

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

  try {
    const updated = await db
      .update(users)
      .set({ email, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning({ id: users.id });

    if (!updated[0]) return bad("User not found.", 404);
  } catch (error) {
    const codeValue = typeof error === "object" && error && "code" in error ? error.code : null;
    if (codeValue === "23505") return bad("That email is already used by another user.", 409);
    return bad("Could not update email.", 500);
  }

  await db.delete(authOtpChallenges).where(eq(authOtpChallenges.id, ch.id));
  return NextResponse.json({ ok: true });
}

import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { isStaffRole } from "@/lib/admin-roles";
import { getDb } from "@/db";
import { users } from "@/db/schema";
import {
  authCookieBaseOptions,
  createUserAuthToken,
  getAuthSigningSecret,
  USER_AUTH_COOKIE,
} from "@/lib/user-auth-session";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const secret = getAuthSigningSecret();
  const db = getDb();
  if (!secret) {
    return NextResponse.json(
      { error: "Server misconfigured — set AUTH_SESSION_SECRET or SESSION_SIGNING_SECRET" },
      { status: 503 }
    );
  }
  if (!db) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  let body: { email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const email = String(body.email || "").trim().toLowerCase();
  const password = String(body.password || "");

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password required" }, { status: 400 });
  }

  const row = await db.select().from(users).where(eq(users.email, email)).limit(1);
  const user = row[0];
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  const roleNorm = user.role.trim().toLowerCase();
  if (!isStaffRole(roleNorm)) {
    return NextResponse.json(
      {
        error:
          "This account cannot sign in. In Neon set role to admin or superadmin (exact lowercase words).",
      },
      { status: 403 }
    );
  }

  await db
    .update(users)
    .set({ lastLoginAt: new Date(), updatedAt: new Date() })
    .where(eq(users.id, user.id));

  const ttlSec = 60 * 60 * 24 * 14;
  const token = await createUserAuthToken(secret, {
    userId: user.id,
    role: roleNorm,
    ttlSec,
  });
  const jar = await cookies();
  jar.set(USER_AUTH_COOKIE, token, authCookieBaseOptions(ttlSec));

  return NextResponse.json({ ok: true, role: roleNorm });
}

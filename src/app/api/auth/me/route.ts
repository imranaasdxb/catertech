import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { users } from "@/db/schema";
import { getSessionUser } from "@/lib/auth-user";
import { isStaffRole } from "@/lib/admin-roles";

export const runtime = "nodejs";

export async function GET() {
  const sess = await getSessionUser();
  if (!sess || !isStaffRole(sess.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getDb();
  if (!db) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  const rows = await db
    .select({
      fullName: users.fullName,
      email: users.email,
      profileImageUrl: users.profileImageUrl,
      role: users.role,
    })
    .from(users)
    .where(eq(users.id, sess.userId))
    .limit(1);

  const u = rows[0];
  if (!u || !isStaffRole(u.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({
    fullName: u.fullName,
    email: u.email,
    profileImageUrl: u.profileImageUrl ?? null,
    role: u.role.trim().toLowerCase(),
  });
}

import { desc } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { users } from "@/db/schema";
import { isStaffRole } from "@/lib/admin-roles";
import { getSessionUser } from "@/lib/auth-user";

export const runtime = "nodejs";

export type AdminUserRow = {
  id: string;
  fullName: string;
  email: string;
  profileImageUrl: string | null;
  role: "admin" | "superadmin" | "blocked";
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string | null;
  isCurrentUser: boolean;
};

function toIso(v: Date | string | null): string | null {
  if (!v) return null;
  if (v instanceof Date) return v.toISOString();
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

function publicRole(role: string): AdminUserRow["role"] {
  const normalized = role.trim().toLowerCase();
  return isStaffRole(normalized) ? normalized : "blocked";
}

export async function GET() {
  const sess = await getSessionUser();
  if (!sess || sess.role !== "superadmin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const db = getDb();
  if (!db) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  const rows = await db
    .select({
      id: users.id,
      fullName: users.fullName,
      email: users.email,
      profileImageUrl: users.profileImageUrl,
      role: users.role,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
      lastLoginAt: users.lastLoginAt,
    })
    .from(users)
    .orderBy(desc(users.createdAt));

  return NextResponse.json(
    rows.map((u) => ({
      id: u.id,
      fullName: u.fullName,
      email: u.email,
      profileImageUrl: u.profileImageUrl ?? null,
      role: publicRole(u.role),
      createdAt: toIso(u.createdAt) ?? new Date().toISOString(),
      updatedAt: toIso(u.updatedAt) ?? new Date().toISOString(),
      lastLoginAt: toIso(u.lastLoginAt),
      isCurrentUser: u.id === sess.userId,
    })) satisfies AdminUserRow[]
  );
}

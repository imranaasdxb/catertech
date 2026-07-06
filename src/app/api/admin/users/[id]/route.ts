import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { users } from "@/db/schema";
import { getSessionUser } from "@/lib/auth-user";

export const runtime = "nodejs";

type Params = {
  params: Promise<{ id: string }>;
};

type UpdateBody = {
  fullName?: string;
  profileImageUrl?: string | null;
  role?: string;
};

const ALLOWED_ROLES = new Set(["admin", "superadmin", "blocked"]);

function bad(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

async function requireSuperadmin() {
  const sess = await getSessionUser();
  if (!sess || sess.role !== "superadmin") return null;
  return sess;
}

export async function PATCH(request: Request, { params }: Params) {
  const sess = await requireSuperadmin();
  if (!sess) return bad("Forbidden", 403);

  const db = getDb();
  if (!db) return bad("Database not configured", 503);

  const { id } = await params;
  let body: UpdateBody;
  try {
    body = await request.json();
  } catch {
    return bad("Invalid JSON");
  }

  const role = String(body.role || "").trim().toLowerCase();
  if (!ALLOWED_ROLES.has(role)) return bad("Choose admin, superadmin, or blocked.");
  if (id === sess.userId && role === "blocked") return bad("You cannot block your own account.");

  const fullName = String(body.fullName || "").trim();
  const profileImageUrl =
    typeof body.profileImageUrl === "string" ? body.profileImageUrl.trim() || null : null;

  if (!fullName) return bad("Full name is required.");

  try {
    const updated = await db
      .update(users)
      .set({
        fullName,
        profileImageUrl,
        role,
        updatedAt: new Date(),
      })
      .where(eq(users.id, id))
      .returning({ id: users.id });

    if (!updated[0]) return bad("User not found.", 404);
    return NextResponse.json({ ok: true });
  } catch {
    return bad("Could not update user.", 500);
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  const sess = await requireSuperadmin();
  if (!sess) return bad("Forbidden", 403);

  const db = getDb();
  if (!db) return bad("Database not configured", 503);

  const { id } = await params;
  if (id === sess.userId) return bad("You cannot delete your own account.");

  const deleted = await db.delete(users).where(eq(users.id, id)).returning({ id: users.id });
  if (!deleted[0]) return bad("User not found.", 404);

  return NextResponse.json({ ok: true });
}

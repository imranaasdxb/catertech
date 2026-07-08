import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { users } from "@/db/schema";
import { getSessionUser } from "@/lib/auth-user";
import { isStaffRole } from "@/lib/admin-roles";

export const runtime = "nodejs";

type StaffProfile = {
  fullName: string;
  email: string;
  profileImageUrl: string | null;
  role: string;
};

const PROFILE_CACHE_MS = 10_000;
const RETRY_DELAYS_MS = [150, 400];

const globalForAuthMe = globalThis as unknown as {
  authMeCache?: Map<string, { expiresAt: number; profile: StaffProfile }>;
  authMeInFlight?: Map<string, Promise<StaffProfile | null>>;
};

function getAuthMeStores() {
  if (!globalForAuthMe.authMeCache) globalForAuthMe.authMeCache = new Map();
  if (!globalForAuthMe.authMeInFlight) globalForAuthMe.authMeInFlight = new Map();

  return {
    cache: globalForAuthMe.authMeCache,
    inFlight: globalForAuthMe.authMeInFlight,
  };
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getErrorText(error: unknown): string {
  if (!error || typeof error !== "object") return String(error);

  const err = error as { message?: unknown; cause?: unknown };
  return `${String(err.message ?? "")} ${getErrorText(err.cause)}`;
}

function isRetryableNeonBusyError(error: unknown) {
  const text = getErrorText(error);
  return (
    text.includes("neon:retryable") ||
    text.includes("Failed to acquire permit") ||
    text.includes("Too many database connection attempts")
  );
}

async function retryBusyDatabase<T>(query: () => Promise<T>) {
  let lastError: unknown;

  for (let attempt = 0; attempt <= RETRY_DELAYS_MS.length; attempt += 1) {
    try {
      return await query();
    } catch (error) {
      lastError = error;
      if (!isRetryableNeonBusyError(error) || attempt === RETRY_DELAYS_MS.length) {
        throw error;
      }

      await wait(RETRY_DELAYS_MS[attempt]);
    }
  }

  throw lastError;
}

export async function GET() {
  const sess = await getSessionUser();
  if (!sess || !isStaffRole(sess.role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = getDb();
  if (!db) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  const { cache, inFlight } = getAuthMeStores();
  const cached = cache.get(sess.userId);
  if (cached && cached.expiresAt > Date.now()) {
    return NextResponse.json(cached.profile);
  }

  let profileRequest = inFlight.get(sess.userId);
  if (!profileRequest) {
    profileRequest = retryBusyDatabase(async () => {
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
      if (!u || !isStaffRole(u.role)) return null;

      return {
        fullName: u.fullName,
        email: u.email,
        profileImageUrl: u.profileImageUrl ?? null,
        role: u.role.trim().toLowerCase(),
      };
    }).finally(() => {
      inFlight.delete(sess.userId);
    });

    inFlight.set(sess.userId, profileRequest);
  }

  let profile: StaffProfile | null;
  try {
    profile = await profileRequest;
  } catch (error) {
    if (isRetryableNeonBusyError(error)) {
      return NextResponse.json(
        { error: "Database busy, please retry." },
        { status: 503, headers: { "Retry-After": "1" } }
      );
    }

    throw error;
  }

  if (!profile) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  cache.set(sess.userId, {
    expiresAt: Date.now() + PROFILE_CACHE_MS,
    profile,
  });

  return NextResponse.json(profile, {
    headers: { "Cache-Control": "private, max-age=5" },
  });
}

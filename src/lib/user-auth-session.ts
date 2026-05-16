import { ADMIN_ROLE, isStaffRole } from "@/lib/admin-roles";

/** Signed cookie session for staff admin users (Edge-safe). */

export const USER_AUTH_COOKIE = "ct_auth_user";

async function hmacHex(secret: string, message: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(message)
  );
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/**
 * Stable auth secret — prefer AUTH_SESSION_SECRET; reuse SESSION_SIGNING_SECRET if unset.
 */
export function getAuthSigningSecret(): string | null {
  return process.env.AUTH_SESSION_SECRET || process.env.SESSION_SIGNING_SECRET || null;
}

export async function createUserAuthToken(
  secret: string,
  params: {
    userId: string;
    role: string;
    ttlSec?: number;
  }
): Promise<string> {
  const ttlSec = params.ttlSec ?? 60 * 60 * 24 * 14;
  const exp = Math.floor(Date.now() / 1000) + ttlSec;
  const r = params.role.trim().toLowerCase();
  const normalizedRole = isStaffRole(r) ? r : ADMIN_ROLE;
  const message = `${exp}|${params.userId}|${normalizedRole}`;
  const sig = await hmacHex(secret, message);
  return `${message}.${sig}`;
}

export async function verifyUserAuthToken(
  token: string,
  secret: string
): Promise<{ userId: string; role: string } | null> {
  const lastDot = token.lastIndexOf(".");
  if (lastDot <= 0) return null;
  const message = token.slice(0, lastDot);
  const sig = token.slice(lastDot + 1);
  const parts = message.split("|");
  if (parts.length !== 3) return null;
  const exp = Number(parts[0]);
  const userId = parts[1];
  const role = parts[2];
  if (
    !Number.isFinite(exp) ||
    exp < Math.floor(Date.now() / 1000) ||
    !userId ||
    userId.length > 48 ||
    !role ||
    role.length > 48
  ) {
    return null;
  }
  const expected = await hmacHex(secret, message);
  if (!timingSafeEqual(sig, expected)) return null;
  return { userId, role };
}

export function authCookieBaseOptions(ttlSec: number) {
  return {
    httpOnly: true,
    /** Localhost dev uses HTTP — Secure must stay off until production. */
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: ttlSec,
  };
}

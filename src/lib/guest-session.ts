/** Guest admin cookie — HMAC-SHA256, Edge-compatible (Web Crypto). */

export const GUEST_COOKIE_NAME = "ct_admin_guest";

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

export async function createGuestToken(
  secret: string,
  ttlSec = 60 * 60 * 24 * 7
): Promise<string> {
  const exp = Math.floor(Date.now() / 1000) + ttlSec;
  const payload = String(exp);
  const sig = await hmacHex(secret, payload);
  return `${payload}.${sig}`;
}

export async function verifyGuestToken(
  token: string,
  secret: string
): Promise<boolean> {
  const lastDot = token.lastIndexOf(".");
  if (lastDot <= 0) return false;
  const payload = token.slice(0, lastDot);
  const sig = token.slice(lastDot + 1);
  const exp = Number(payload);
  if (!Number.isFinite(exp) || exp < Math.floor(Date.now() / 1000))
    return false;
  const expected = await hmacHex(secret, payload);
  if (sig.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < sig.length; i++) {
    diff |= sig.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return diff === 0;
}

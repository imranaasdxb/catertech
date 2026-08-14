import { NextResponse } from "next/server";
export {
  sanitizeEmail,
  sanitizeMultilineText,
  sanitizePhone,
  sanitizeText,
} from "@/lib/sanitize";

type Bucket = {
  count: number;
  resetAt: number;
};

type LoginAttempt = {
  count: number;
  resetAt: number;
};

const globalSecurityState = globalThis as typeof globalThis & {
  ctRateLimitBuckets?: Map<string, Bucket>;
  ctLoginAttempts?: Map<string, LoginAttempt>;
};

const rateLimitBuckets =
  globalSecurityState.ctRateLimitBuckets ?? new Map<string, Bucket>();
globalSecurityState.ctRateLimitBuckets = rateLimitBuckets;

const loginAttempts =
  globalSecurityState.ctLoginAttempts ?? new Map<string, LoginAttempt>();
globalSecurityState.ctLoginAttempts = loginAttempts;

export function getClientIp(request: Request): string {
  const headers = request.headers;
  const forwarded = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return (
    headers.get("cf-connecting-ip")?.trim() ||
    headers.get("x-real-ip")?.trim() ||
    forwarded ||
    "unknown"
  );
}

export function checkRateLimit({
  key,
  limit,
  windowMs,
}: {
  key: string;
  limit: number;
  windowMs: number;
}): { ok: true } | { ok: false; retryAfterSec: number } {
  const now = Date.now();
  const existing = rateLimitBuckets.get(key);
  if (!existing || existing.resetAt <= now) {
    rateLimitBuckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true };
  }

  existing.count += 1;
  if (existing.count > limit) {
    return {
      ok: false,
      retryAfterSec: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
    };
  }

  return { ok: true };
}

export function rateLimitResponse(retryAfterSec: number) {
  return NextResponse.json(
    { error: "Too many requests. Please try again shortly." },
    {
      status: 429,
      headers: { "Retry-After": String(retryAfterSec) },
    }
  );
}

export function validateSameOriginRequest(request: Request, expectedOrigin: string) {
  const origin = request.headers.get("origin");
  if (origin && origin !== expectedOrigin) return false;

  const referer = request.headers.get("referer");
  if (referer) {
    try {
      return new URL(referer).origin === expectedOrigin;
    } catch {
      return false;
    }
  }

  return true;
}

export function applySecurityHeaders(response: NextResponse) {
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=(), payment=(), usb=()"
  );
  response.headers.set(
    "Content-Security-Policy",
    "base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self'"
  );
  return response;
}

export function checkLoginAttemptLimit(key: string) {
  const now = Date.now();
  const existing = loginAttempts.get(key);
  if (!existing || existing.resetAt <= now) return { ok: true as const };

  if (existing.count >= 8) {
    return {
      ok: false as const,
      retryAfterSec: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
    };
  }

  return { ok: true as const };
}

export function recordLoginFailure(key: string) {
  const now = Date.now();
  const existing = loginAttempts.get(key);
  if (!existing || existing.resetAt <= now) {
    loginAttempts.set(key, { count: 1, resetAt: now + 15 * 60 * 1000 });
    return;
  }
  existing.count += 1;
}

export function clearLoginFailures(key: string) {
  loginAttempts.delete(key);
}

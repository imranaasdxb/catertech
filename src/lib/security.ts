import { NextResponse } from "next/server";
export {
  sanitizeEmail,
  sanitizeMultilineText,
  sanitizePhone,
  sanitizeText,
} from "@/lib/sanitize";

type Bucket = {
  tokens: number;
  updatedAt: number;
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
  burst = limit,
}: {
  key: string;
  limit: number;
  windowMs: number;
  burst?: number;
}): { ok: true } | { ok: false; retryAfterSec: number } {
  const now = Date.now();
  const capacity = Math.max(1, burst);
  const refillPerMs = limit / windowMs;
  const existing = rateLimitBuckets.get(key);

  if (!existing) {
    rateLimitBuckets.set(key, { tokens: capacity - 1, updatedAt: now });
    return { ok: true };
  }

  const elapsedMs = Math.max(0, now - existing.updatedAt);
  const tokens = Math.min(capacity, existing.tokens + elapsedMs * refillPerMs);

  if (tokens < 1) {
    existing.tokens = tokens;
    existing.updatedAt = now;
    return {
      ok: false,
      retryAfterSec: Math.max(1, Math.ceil((1 - tokens) / refillPerMs / 1000)),
    };
  }

  existing.tokens = tokens - 1;
  existing.updatedAt = now;
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

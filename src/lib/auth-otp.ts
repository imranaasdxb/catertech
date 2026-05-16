import { createHash, randomInt } from "crypto";

/** Server-only pepper (+ email + code → hash). Required in prod; dev defaults to weak placeholder so SMTP can be tested locally. */
function otpPepper(): string {
  return process.env.AUTH_OTP_PEPPER || "dev-only-change-me";
}

export function hashOtp(email: string, code: string): string {
  const norm = email.trim().toLowerCase();
  return createHash("sha256")
    .update(`${otpPepper()}:${norm}:${code.trim()}`)
    .digest("hex");
}

export function verifyOtpHash(
  email: string,
  code: string,
  expectedHash: string
): boolean {
  const h = hashOtp(email, code);
  if (h.length !== expectedHash.length) return false;
  let diff = 0;
  for (let i = 0; i < h.length; i++) diff |= h.charCodeAt(i) ^ expectedHash.charCodeAt(i);
  return diff === 0;
}

export function generateNumericOtp(digits = 6): string {
  const n = 10 ** digits;
  const v = randomInt(0, n);
  return String(v).padStart(digits, "0");
}

export const SIGNUP_OTP_PURPOSE = "signup";
export const OTP_TTL_MIN = 10;
export const OTP_RESEND_COOLDOWN_SEC = 55;
export const OTP_MAX_ATTEMPTS = 8;

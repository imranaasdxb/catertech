import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  getAuthSigningSecret,
  verifyUserAuthToken,
  USER_AUTH_COOKIE,
} from "@/lib/user-auth-session";
import { isStaffRole, isSuperadminRole } from "@/lib/admin-roles";
import {
  applySecurityHeaders,
  checkRateLimit,
  getClientIp,
  rateLimitResponse,
  validateSameOriginRequest,
} from "@/lib/security";

const MUTATING_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

function withSecurityHeaders(response: NextResponse) {
  return applySecurityHeaders(response);
}

function rateLimitConfig(pathname: string):
  | { scope: string; limit: number; windowMs: number; burst?: number }
  | null {
  if (pathname === "/api/auth/login") {
    return { scope: "auth-login", limit: 20, windowMs: 15 * 60 * 1000, burst: 10 };
  }
  if (pathname.startsWith("/api/auth/signup")) {
    return { scope: "auth-signup", limit: 8, windowMs: 15 * 60 * 1000, burst: 4 };
  }
  if (
    pathname === "/api/admin/users/create/send-otp" ||
    /^\/api\/admin\/users\/[^/]+\/email\/send-otp$/.test(pathname)
  ) {
    return { scope: `admin-otp:${pathname}`, limit: 12, windowMs: 15 * 60 * 1000, burst: 4 };
  }
  if (
    pathname === "/api/contact" ||
    pathname === "/api/enquiry" ||
    pathname === "/api/quote" ||
    pathname === "/api/rfq" ||
    pathname === "/api/chatbot-leads"
  ) {
    return { scope: `public-form:${pathname}`, limit: 12, windowMs: 10 * 60 * 1000, burst: 5 };
  }
  if (pathname === "/api/upload") {
    return { scope: "admin-upload", limit: 180, windowMs: 10 * 60 * 1000, burst: 60 };
  }
  if (pathname.startsWith("/api/admin/products")) {
    return { scope: "admin-products", limit: 600, windowMs: 60 * 1000, burst: 120 };
  }
  if (pathname.startsWith("/api/admin")) {
    return { scope: "admin-api", limit: 300, windowMs: 60 * 1000, burst: 120 };
  }
  return null;
}

/** Staff cookies are site-wide, but staff should still be able to open the public website. */
function isStaffBrowseAllowed(pathname: string): boolean {
  if (pathname.startsWith("/admin")) return true;
  if (pathname.startsWith("/api")) return true;
  if (pathname.startsWith("/_next")) return true;
  if (pathname.startsWith("/auth")) return false;
  if (pathname.startsWith("/studio")) return false;
  if (pathname === "/favicon.ico") return true;
  if (/\.(?:ico|png|jpg|jpeg|gif|svg|webp|woff2?|ttf|eot|pdf|txt)$/i.test(pathname)) {
    return true;
  }
  return true;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const method = request.method.toUpperCase();

  if (pathname.startsWith("/api") && MUTATING_METHODS.has(method)) {
    if (!validateSameOriginRequest(request, request.nextUrl.origin)) {
      return withSecurityHeaders(
        NextResponse.json({ error: "Forbidden" }, { status: 403 })
      );
    }

    const cfg = rateLimitConfig(pathname);
    if (cfg) {
      const limited = checkRateLimit({
        key: `${cfg.scope}:${getClientIp(request)}`,
        limit: cfg.limit,
        windowMs: cfg.windowMs,
        burst: cfg.burst,
      });
      if (!limited.ok) {
        return withSecurityHeaders(rateLimitResponse(limited.retryAfterSec));
      }
    }
  }

  const secret = getAuthSigningSecret();
  const token = request.cookies.get(USER_AUTH_COOKIE)?.value;
  const sess =
    secret && token ? await verifyUserAuthToken(token!, secret!) : null;
  const staffAuthed = isStaffRole(sess?.role);

  const isContactsArea =
    pathname.startsWith("/admin/contacts") ||
    pathname.startsWith("/api/admin/contacts");
  const isUsersArea =
    pathname.startsWith("/admin/users") ||
    pathname.startsWith("/api/admin/users");

  if (pathname.startsWith("/api/admin")) {
    if (!staffAuthed) {
      return withSecurityHeaders(
        NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      );
    }
    if ((isContactsArea || isUsersArea) && !isSuperadminRole(sess?.role)) {
      return withSecurityHeaders(
        NextResponse.json({ error: "Forbidden" }, { status: 403 })
      );
    }
    return withSecurityHeaders(NextResponse.next());
  }

  if (staffAuthed && !isStaffBrowseAllowed(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    url.search = "";
    return withSecurityHeaders(NextResponse.redirect(url));
  }

  if (pathname.startsWith("/admin/login")) {
    return withSecurityHeaders(NextResponse.next());
  }

  if (pathname.startsWith("/admin")) {
    if (!staffAuthed) {
      const url = request.nextUrl.clone();
      url.pathname = "/auth";
      url.searchParams.set("tab", "login");
      url.searchParams.set("from", pathname);
      return withSecurityHeaders(NextResponse.redirect(url));
    }
    if ((isContactsArea || isUsersArea) && !isSuperadminRole(sess?.role)) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin";
      url.search = "";
      return withSecurityHeaders(NextResponse.redirect(url));
    }
  }

  return withSecurityHeaders(NextResponse.next());
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

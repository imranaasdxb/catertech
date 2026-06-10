import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  getAuthSigningSecret,
  verifyUserAuthToken,
  USER_AUTH_COOKIE,
} from "@/lib/user-auth-session";
import { isStaffRole, isSuperadminRole } from "@/lib/admin-roles";

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
  const secret = getAuthSigningSecret();
  const token = request.cookies.get(USER_AUTH_COOKIE)?.value;
  const sess =
    secret && token ? await verifyUserAuthToken(token!, secret!) : null;
  const staffAuthed = isStaffRole(sess?.role);

  const isContactsArea =
    pathname.startsWith("/admin/contacts") ||
    pathname.startsWith("/api/admin/contacts");

  if (pathname.startsWith("/api/admin")) {
    if (!staffAuthed) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (isContactsArea && !isSuperadminRole(sess?.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.next();
  }

  if (staffAuthed && !isStaffBrowseAllowed(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin";
    url.search = "";
    return NextResponse.redirect(url);
  }

  if (pathname.startsWith("/admin/login")) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    if (!staffAuthed) {
      const url = request.nextUrl.clone();
      url.pathname = "/auth";
      url.searchParams.set("tab", "login");
      url.searchParams.set("from", pathname);
      return NextResponse.redirect(url);
    }
    if (isContactsArea && !isSuperadminRole(sess?.role)) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin";
      url.search = "";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { GUEST_COOKIE_NAME } from "@/lib/guest-session";
import { USER_AUTH_COOKIE } from "@/lib/user-auth-session";

const clearOpts = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 0,
};

export async function POST() {
  const jar = await cookies();
  jar.set(USER_AUTH_COOKIE, "", clearOpts);
  jar.set(GUEST_COOKIE_NAME, "", clearOpts);
  return NextResponse.json({ ok: true });
}

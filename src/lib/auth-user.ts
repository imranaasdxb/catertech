import { cookies } from "next/headers";
import { isStaffRole } from "@/lib/admin-roles";
import {
  getAuthSigningSecret,
  USER_AUTH_COOKIE,
  verifyUserAuthToken,
} from "@/lib/user-auth-session";

export async function getSessionUser(): Promise<{
  userId: string;
  role: string;
} | null> {
  const secret = getAuthSigningSecret();
  const token = (await cookies()).get(USER_AUTH_COOKIE)?.value;
  if (!secret || !token) return null;
  return verifyUserAuthToken(token, secret);
}

/** Admin preview routes + `/admin` middleware — signed-in staff (`admin` or `superadmin`). */
export async function isAdminSession(): Promise<boolean> {
  const s = await getSessionUser();
  return isStaffRole(s?.role);
}

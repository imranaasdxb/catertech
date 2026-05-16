import { isAdminSession } from "@/lib/auth-user";

/** @deprecated Prefer `isAdminSession` — name kept so preview routes compile. */
export async function isAdminGuestAuthed(): Promise<boolean> {
  return isAdminSession();
}

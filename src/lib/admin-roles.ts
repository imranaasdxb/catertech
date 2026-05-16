/** Use these exact lowercase values in Neon `users.role`. */
export const ADMIN_ROLE = "admin" as const;
export const SUPERADMIN_ROLE = "superadmin" as const;

export type StaffRole = typeof ADMIN_ROLE | typeof SUPERADMIN_ROLE;

const STAFF = new Set<string>([ADMIN_ROLE, SUPERADMIN_ROLE]);

export function normalizeStaffRole(role: string | null | undefined): string {
  const r = String(role || "").trim().toLowerCase();
  return STAFF.has(r) ? r : "";
}

export function isStaffRole(role: string | null | undefined): role is StaffRole {
  return STAFF.has(String(role || "").trim().toLowerCase());
}

export function isSuperadminRole(role: string | null | undefined): boolean {
  return String(role || "").trim().toLowerCase() === SUPERADMIN_ROLE;
}

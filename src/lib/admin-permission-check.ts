import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { users } from "@/db/schema";
import { isStaffRole, SUPERADMIN_ROLE } from "@/lib/admin-roles";
import {
  DEFAULT_PRODUCT_PERMISSIONS,
  type ProductPermissionKey,
  type ProductPermissions,
} from "@/lib/admin-permissions";
import { getSessionUser } from "@/lib/auth-user";

export async function getCurrentProductPermissions(): Promise<{
  ok: boolean;
  reason?: "unauthorized" | "database";
  permissions: ProductPermissions;
}> {
  const sess = await getSessionUser();
  if (!sess || !isStaffRole(sess.role)) {
    return {
      ok: false,
      reason: "unauthorized",
      permissions: {
        canUpdateProductPrice: false,
        canDeleteProduct: false,
        canUpdateProductImages: false,
        canUpdateProductDetails: false,
      },
    };
  }

  const db = getDb();
  if (!db) {
    return { ok: false, reason: "database", permissions: DEFAULT_PRODUCT_PERMISSIONS };
  }

  const [user] = await db
    .select({
      role: users.role,
      canUpdateProductPrice: users.canUpdateProductPrice,
      canDeleteProduct: users.canDeleteProduct,
      canUpdateProductImages: users.canUpdateProductImages,
      canUpdateProductDetails: users.canUpdateProductDetails,
    })
    .from(users)
    .where(eq(users.id, sess.userId))
    .limit(1);

  if (!user || !isStaffRole(user.role)) {
    return {
      ok: false,
      reason: "unauthorized",
      permissions: {
        canUpdateProductPrice: false,
        canDeleteProduct: false,
        canUpdateProductImages: false,
        canUpdateProductDetails: false,
      },
    };
  }

  if (user.role.trim().toLowerCase() === SUPERADMIN_ROLE) {
    return { ok: true, permissions: DEFAULT_PRODUCT_PERMISSIONS };
  }

  return {
    ok: true,
    permissions: {
      canUpdateProductPrice: user.canUpdateProductPrice,
      canDeleteProduct: user.canDeleteProduct,
      canUpdateProductImages: user.canUpdateProductImages,
      canUpdateProductDetails: user.canUpdateProductDetails,
    },
  };
}

export function missingProductPermissions(
  permissions: ProductPermissions,
  required: ProductPermissionKey[],
) {
  return required.filter((permission) => !permissions[permission]);
}

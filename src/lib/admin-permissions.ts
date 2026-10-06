export const PRODUCT_PERMISSION_KEYS = [
  "canUpdateProductPrice",
  "canDeleteProduct",
  "canUpdateProductImages",
  "canUpdateProductDetails",
] as const;

export type ProductPermissionKey = (typeof PRODUCT_PERMISSION_KEYS)[number];

export type ProductPermissions = Record<ProductPermissionKey, boolean>;

export const PRODUCT_PERMISSION_LABELS: Record<ProductPermissionKey, string> = {
  canUpdateProductPrice: "Price update",
  canDeleteProduct: "Product delete",
  canUpdateProductImages: "Image update",
  canUpdateProductDetails: "Product details update",
};

export const DEFAULT_PRODUCT_PERMISSIONS: ProductPermissions = {
  canUpdateProductPrice: true,
  canDeleteProduct: true,
  canUpdateProductImages: true,
  canUpdateProductDetails: true,
};

export function productPermissionsFromProfile(
  profile:
    | (Partial<ProductPermissions> & {
        role?: string | null;
      })
    | null
    | undefined,
): ProductPermissions {
  if (profile?.role?.trim().toLowerCase() === "superadmin") {
    return DEFAULT_PRODUCT_PERMISSIONS;
  }

  return {
    canUpdateProductPrice: profile?.canUpdateProductPrice === true,
    canDeleteProduct: profile?.canDeleteProduct === true,
    canUpdateProductImages: profile?.canUpdateProductImages === true,
    canUpdateProductDetails: profile?.canUpdateProductDetails === true,
  };
}

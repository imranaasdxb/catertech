export type CartItem = {
  id: string;
  name: string;
  category: string;
  price: string;
  quantity: number;
  image: string;
  type: "product" | "service";
};

export const CART_STORAGE_KEY = "catertech-quote-basket";
const CART_STORAGE_VERSION = 1;

type StoredCartPayload = {
  version: number;
  items: CartItem[];
  updatedAt: string;
};

function isValidCartItem(value: unknown): value is CartItem {
  if (!value || typeof value !== "object") return false;

  const item = value as Partial<CartItem>;
  return (
    typeof item.id === "string" &&
    item.id.length > 0 &&
    typeof item.name === "string" &&
    item.name.trim().length > 0 &&
    typeof item.category === "string" &&
    typeof item.price === "string" &&
    typeof item.image === "string" &&
    typeof item.quantity === "number" &&
    Number.isFinite(item.quantity) &&
    item.quantity >= 1 &&
    (item.type === "product" || item.type === "service")
  );
}

export function normalizeCartItems(items: unknown): CartItem[] {
  if (!Array.isArray(items)) return [];

  return items
    .filter(isValidCartItem)
    .map((item) => ({
      id: item.id.trim(),
      name: item.name.trim(),
      category: item.category.trim(),
      price: item.price.trim(),
      image: item.image.trim(),
      type: item.type,
      quantity: Math.min(999, Math.max(1, Math.floor(item.quantity))),
    }));
}

function parseStoredPayload(raw: string): CartItem[] {
  const parsed = JSON.parse(raw) as unknown;

  if (Array.isArray(parsed)) {
    return normalizeCartItems(parsed);
  }

  if (!parsed || typeof parsed !== "object") return [];

  const payload = parsed as Partial<StoredCartPayload>;
  if (payload.version !== CART_STORAGE_VERSION) return [];

  return normalizeCartItems(payload.items);
}

export function loadCartFromStorage(): CartItem[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    return parseStoredPayload(raw);
  } catch {
    return [];
  }
}

export function saveCartToStorage(items: CartItem[]): boolean {
  if (typeof window === "undefined") return false;

  const payload: StoredCartPayload = {
    version: CART_STORAGE_VERSION,
    items: normalizeCartItems(items),
    updatedAt: new Date().toISOString(),
  };

  try {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(payload));
    return true;
  } catch {
    return false;
  }
}

export function clearCartStorage(): void {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.removeItem(CART_STORAGE_KEY);
  } catch {
    // Ignore storage failures during cleanup.
  }
}

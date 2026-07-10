"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import {
  CART_STORAGE_KEY,
  clearCartStorage,
  loadCartFromStorage,
  normalizeCartItems,
  saveCartToStorage,
  type CartItem,
} from "@/lib/cart-storage";

export type { CartItem };

type CartContextValue = {
  items: CartItem[];
  isHydrated: boolean;
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;
  totalItems: number;
};

const CartContext = createContext<CartContextValue | null>(null);

function commitCart(next: CartItem[]) {
  const normalized = normalizeCartItems(next);
  if (normalized.length === 0) {
    clearCartStorage();
    return normalized;
  }

  saveCartToStorage(normalized);
  return normalized;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setItems(loadCartFromStorage());
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    const onStorage = (event: StorageEvent) => {
      if (event.key !== CART_STORAGE_KEY) return;
      setItems(loadCartFromStorage());
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [isHydrated]);

  const addItem = useCallback((newItem: Omit<CartItem, "quantity">) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === newItem.id);
      const next = existing
        ? prev.map((item) =>
            item.id === newItem.id
              ? { ...item, quantity: Math.min(999, item.quantity + 1) }
              : item,
          )
        : [...prev, { ...newItem, quantity: 1 }];

      return commitCart(next);
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => commitCart(prev.filter((item) => item.id !== id)));
  }, []);

  const updateQty = useCallback((id: string, qty: number) => {
    setItems((prev) => {
      if (qty < 1) {
        return commitCart(prev.filter((item) => item.id !== id));
      }

      return commitCart(
        prev.map((item) =>
          item.id === id
            ? { ...item, quantity: Math.min(999, Math.max(1, Math.floor(qty))) }
            : item,
        ),
      );
    });
  }, []);

  const clearCart = useCallback(() => {
    clearCartStorage();
    setItems([]);
  }, []);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, isHydrated, addItem, removeItem, updateQty, clearCart, totalItems }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}

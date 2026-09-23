"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { CityCode } from "@/lib/city";

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  price: number;
  mallPrice: number;
  image: string | null;
  supplierCity: CityCode;
  qty: number;
}

interface CartContextValue {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "qty">, qty?: number) => void;
  removeItem: (productId: string) => void;
  setQty: (productId: string, qty: number) => void;
  clear: () => void;
  count: number;
  subtotal: number;
  /** True once the cart has read localStorage, so the first paint never flashes an empty cart. */
  isHydrated: boolean;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "oja-direct-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      // One-time hydration from localStorage after mount, so server and
      // client render the same empty cart on the first paint. There's no
      // external-store subscription to model here (localStorage doesn't
      // change from other tabs during this read), so this is the correct
      // shape despite the lint rule's general advice.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // Corrupt or inaccessible storage — start with an empty cart.
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Private browsing / quota exceeded — the cart just won't persist.
    }
  }, [items, isHydrated]);

  function addItem(item: Omit<CartItem, "qty">, qty = 1) {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === item.productId);
      if (existing) {
        return prev.map((i) =>
          i.productId === item.productId ? { ...i, qty: i.qty + qty } : i
        );
      }
      return [...prev, { ...item, qty }];
    });
  }

  function removeItem(productId: string) {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }

  function setQty(productId: string, qty: number) {
    if (qty <= 0) {
      removeItem(productId);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.productId === productId ? { ...i, qty } : i))
    );
  }

  function clear() {
    setItems([]);
  }

  const count = useMemo(() => items.reduce((sum, i) => sum + i.qty, 0), [items]);
  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.qty * i.price, 0),
    [items]
  );

  const value: CartContextValue = {
    items,
    addItem,
    removeItem,
    setQty,
    clear,
    count,
    subtotal,
    isHydrated,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}

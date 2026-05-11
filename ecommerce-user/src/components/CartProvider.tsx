"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { Product } from "@/types/product";

const STORAGE_KEY = "public-cart";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  total: number;
  addItem: (product: Product, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

const clampQuantity = (product: Product, quantity: number) => {
  const stockLimit = Math.max(0, Number(product.stockQty || 0));
  if (stockLimit === 0) return 0;
  return Math.min(stockLimit, Math.max(1, Math.floor(quantity)));
};

const loadStoredCart = (): CartItem[] => {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .map((item) => ({
        product: item?.product,
        quantity: Number(item?.quantity || 0),
      }))
      .filter((item) => item.product?._id && item.quantity > 0);
  } catch {
    return [];
  }
};

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    const hydrateId = window.setTimeout(() => {
      setItems(loadStoredCart());
      setHasHydrated(true);
    }, 0);

    return () => window.clearTimeout(hydrateId);
  }, []);

  useEffect(() => {
    if (!hasHydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [hasHydrated, items]);

  const addItem = (product: Product, quantity = 1) => {
    setItems((current) => {
      const existing = current.find((item) => item.product._id === product._id);

      if (!existing) {
        const nextQuantity = clampQuantity(product, quantity);
        if (nextQuantity <= 0) return current;
        return [...current, { product, quantity: nextQuantity }];
      }

      const nextQuantity = clampQuantity(product, existing.quantity + quantity);
      if (nextQuantity <= 0) {
        return current.filter((item) => item.product._id !== product._id);
      }

      return current.map((item) =>
        item.product._id === product._id ? { ...item, quantity: nextQuantity } : item
      );
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setItems((current) =>
      current.flatMap((item) => {
        if (item.product._id !== productId) return [item];

        const nextQuantity = clampQuantity(item.product, quantity);
        return nextQuantity > 0 ? [{ ...item, quantity: nextQuantity }] : [];
      })
    );
  };

  const removeItem = (productId: string) => {
    setItems((current) => current.filter((item) => item.product._id !== productId));
  };

  const clearCart = () => {
    setItems([]);
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const total = items.reduce((sum, item) => {
    const price = Number(item.product.sellingPrice ?? item.product.mrp ?? 0);
    return sum + price * item.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        total,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
};

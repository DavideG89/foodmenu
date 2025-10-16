'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Product } from '@/data/mockData';

type CartItem = {
  product: Product;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  add: (product: Product, qty?: number) => void;
  inc: (id: string) => void;
  dec: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
  count: () => number;
  subtotal: () => number;
};

const createMemoryStorage = (): Storage => {
  let store: Record<string, string> = {};

  return {
    getItem: (name: string) => (name in store ? store[name] : null),
    setItem: (name: string, value: string) => {
      store[name] = value;
    },
    removeItem: (name: string) => {
      delete store[name];
    },
    clear: () => {
      store = {};
    },
    key: (index: number) => Object.keys(store)[index] ?? null,
    get length() {
      return Object.keys(store).length;
    }
  };
};

const storage = createJSONStorage(() => {
  if (typeof window === 'undefined') {
    return createMemoryStorage();
  }
  return window.localStorage;
});

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (product, qty = 1) => {
        const { items } = get();
        const existing = items.find((item) => item.product.id === product.id);
        if (existing) {
          set({
            items: items.map((item) =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + qty }
                : item
            )
          });
        } else {
          set({ items: [...items, { product, quantity: qty }] });
        }
      },
      inc: (id) => {
        set({
          items: get().items.map((item) =>
            item.product.id === id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        });
      },
      dec: (id) => {
        set({
          items: get().items
            .map((item) =>
              item.product.id === id
                ? { ...item, quantity: Math.max(0, item.quantity - 1) }
                : item
            )
            .filter((item) => item.quantity > 0)
        });
      },
      remove: (id) => {
        set({ items: get().items.filter((item) => item.product.id !== id) });
      },
      clear: () => set({ items: [] }),
      count: () => get().items.reduce((acc, item) => acc + item.quantity, 0),
      subtotal: () =>
        get().items.reduce(
          (acc, item) => acc + (item.product.promoPrice ?? item.product.price) * item.quantity,
          0
        )
    }),
    {
      name: 'foodmenu-cart',
      partialize: (state) => ({ items: state.items }),
      storage
    }
  )
);

export type { CartItem };

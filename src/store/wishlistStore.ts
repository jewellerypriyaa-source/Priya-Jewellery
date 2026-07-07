/**
 * Zustand Wishlist Store
 * Client-side only — persisted to localStorage automatically.
 * No backend needed; products are stored by slug + key details.
 */
"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface WishlistItem {
  id: string;
  slug: string;
  name: string;
  price: number;
  imageUrl: string;
  categoryName: string;
}

interface WishlistState {
  items: WishlistItem[];
  addItem: (item: WishlistItem) => void;
  removeItem: (slug: string) => void;
  toggleItem: (item: WishlistItem) => void;
  isWishlisted: (slug: string) => boolean;
  clearWishlist: () => void;
  count: () => number;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) =>
        set((state) => {
          if (state.items.some((i) => i.slug === item.slug)) return state;
          return { items: [...state.items, item] };
        }),

      removeItem: (slug) =>
        set((state) => ({
          items: state.items.filter((i) => i.slug !== slug),
        })),

      toggleItem: (item) => {
        const { isWishlisted, addItem, removeItem } = get();
        if (isWishlisted(item.slug)) {
          removeItem(item.slug);
        } else {
          addItem(item);
        }
      },

      isWishlisted: (slug) => get().items.some((i) => i.slug === slug),

      clearWishlist: () => set({ items: [] }),

      count: () => get().items.length,
    }),
    {
      name: "priya-jewellery-wishlist",
    }
  )
);

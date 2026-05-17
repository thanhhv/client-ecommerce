"use client";

import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/lib/stores/authStore";
import { useCartStore, type CartItem } from "@/lib/stores/cartStore";
import { cartApi } from "@/lib/api/cart";

export function useAddToCart() {
  const user = useAuthStore((s) => s.user);
  const addLocalItem = useCartStore((s) => s.addItem);
  const queryClient = useQueryClient();

  const addToCart = useCallback(
    async (item: Omit<CartItem, "quantity"> & { quantity?: number }) => {
      // Always update local store immediately for instant UI feedback
      addLocalItem(item);

      // If logged in, also persist to BE and refresh the cart cache
      if (user) {
        try {
          await cartApi.addItem({
            productId: item.productId,
            quantity: item.quantity ?? 1,
          });
          // Invalidate so CartDrawer and checkout page see the new item
          queryClient.invalidateQueries({ queryKey: ["cart"] });
        } catch {
          // Silent fail — local store already updated
        }
      }
    },
    [user, addLocalItem, queryClient],
  );

  return addToCart;
}

"use client";

import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/lib/stores/authStore";
import { useCartStore } from "@/lib/stores/cartStore";
import { cartApi } from "@/lib/api/cart";

// Syncs local cart items to the BE when the user logs in.
// Runs once per login event; skips if the local cart is empty.
export default function CartSyncer() {
  const user = useAuthStore((s) => s.user);
  const prevUserId = useRef<string | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    const justLoggedIn = user && prevUserId.current !== user.id;
    prevUserId.current = user?.id ?? null;

    if (!justLoggedIn) return;

    const sync = async () => {
      const localItems = useCartStore.getState().items;
      for (const item of localItems) {
        try {
          await cartApi.addItem({ productId: item.productId, quantity: item.quantity });
        } catch {
          // Item may already be in BE cart — ignore duplicate errors
        }
      }
      // Refresh cart cache so CartDrawer shows the merged cart
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    };
    sync();
  }, [user?.id, queryClient]);

  return null;
}

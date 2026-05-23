"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cartApi } from "@/lib/api/cart";
import type { BeCart } from "@/lib/types/cart";
import { useAuthStore } from "@/lib/stores/authStore";

export function useCart() {
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);

  const query = useQuery<BeCart>({
    queryKey: ["cart"],
    queryFn: async () => {
      const res = await cartApi.get();
      return res.data.data;
    },
    staleTime: 0,
    enabled: !!user,
  });

  const updateItem = useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) =>
      cartApi.updateItem(itemId, quantity),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });

  const removeItem = useMutation({
    mutationFn: (itemId: string) => cartApi.removeItem(itemId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });

  const clearCart = useMutation({
    mutationFn: () => cartApi.clear(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });

  return { query, updateItem, removeItem, clearCart };
}

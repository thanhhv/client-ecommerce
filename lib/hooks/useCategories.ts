"use client";

import { useQuery } from "@tanstack/react-query";
import { categoriesApi } from "@/lib/api/categories";
import type { Category } from "@/lib/types/product";

export function useCategories() {
  return useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await categoriesApi.list();
      return (res.data as { data: Category[] }).data ?? [];
    },
    staleTime: 60 * 60 * 1000,
  });
}

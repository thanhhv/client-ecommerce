"use client";

import { useQuery } from "@tanstack/react-query";
import { productsApi } from "@/lib/api/products";
import type { ProductSummary } from "@/lib/types/product";

export interface ProductFilter {
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  search?: string;
  sort?: "price_asc" | "price_desc" | "newest" | "name";
  page?: number;
  limit?: number;
}

export interface ProductsResponse {
  data: ProductSummary[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function useProducts(filter: ProductFilter) {
  const params: Record<string, unknown> = {};
  if (filter.categoryId) params.categoryId = filter.categoryId;
  if (filter.minPrice !== undefined && filter.minPrice > 0) params.minPrice = filter.minPrice;
  if (filter.maxPrice !== undefined && filter.maxPrice > 0) params.maxPrice = filter.maxPrice;
  if (filter.inStock) params.inStock = "true";
  if (filter.search) params.search = filter.search;
  if (filter.sort) params.sort = filter.sort;
  params.page = filter.page ?? 1;
  params.limit = filter.limit ?? 20;

  return useQuery<ProductsResponse>({
    queryKey: ["products", params],
    queryFn: async () => {
      const res = await productsApi.list(params);
      return {
        data: res.data.data ?? [],
        pagination: res.data.pagination ?? { page: 1, limit: 20, total: 0, totalPages: 0 },
      };
    },
    staleTime: 30_000,
    placeholderData: (prev) => prev,
  });
}

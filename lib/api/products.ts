import apiClient from "./client";

export const productsApi = {
  list: (params?: Record<string, unknown>) =>
    apiClient.get("/api/v1/products", { params }),
  getBySlug: (slug: string) => apiClient.get(`/api/v1/products/${slug}`),
};

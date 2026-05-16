import apiClient from "./client";

export const cartApi = {
  get: () => apiClient.get("/api/v1/cart"),
  addItem: (data: { productId: string; quantity: number }) =>
    apiClient.post("/api/v1/cart/items", data),
  updateItem: (itemId: string, quantity: number) =>
    apiClient.put(`/api/v1/cart/items/${itemId}`, { quantity }),
  removeItem: (itemId: string) =>
    apiClient.delete(`/api/v1/cart/items/${itemId}`),
  clear: () => apiClient.delete("/api/v1/cart"),
};

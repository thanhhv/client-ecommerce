import apiClient from "./client";

export interface PlaceOrderInput {
  paymentMethod: "COD" | "BANK_TRANSFER";
  shippingName: string;
  shippingPhone: string;
  shippingAddress: string;
  notes?: string;
}

export const ordersApi = {
  list: (params?: { page?: number; limit?: number }) =>
    apiClient.get("/api/v1/orders", { params }),
  getById: (id: string) => apiClient.get(`/api/v1/orders/${id}`),
  place: (data: PlaceOrderInput) => apiClient.post("/api/v1/orders", data),
  cancel: (id: string) => apiClient.put(`/api/v1/orders/${id}/cancel`),
};

import apiClient from "./client";

export const authApi = {
  refresh: () =>
    apiClient.post<{ data: { accessToken: string } }>("/api/v1/auth/refresh"),
  logout: () => apiClient.post("/api/v1/auth/logout"),
  getProfile: () => apiClient.get("/api/v1/users/me"),
  updateProfile: (data: { name?: string; phone?: string; address?: string }) =>
    apiClient.put("/api/v1/users/me", data),
};

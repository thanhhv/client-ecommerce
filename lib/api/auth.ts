import apiClient from "./client";

export interface UserProfile {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  address: string | null;
  avatarUrl: string | null;
  role: string;
}

export const authApi = {
  refresh: () =>
    apiClient.post<{ data: { accessToken: string } }>("/api/v1/auth/refresh"),
  logout: () => apiClient.post("/api/v1/auth/logout"),
  getProfile: () => apiClient.get("/api/v1/users/me"),
  updateProfile: (data: { name?: string; phone?: string; address?: string }) =>
    apiClient.put("/api/v1/users/me", data),
  register: (data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    address?: string;
  }) =>
    apiClient.post<{ data: { accessToken: string; user: UserProfile } }>(
      "/api/v1/auth/register",
      data
    ),
  login: (data: { email: string; password: string }) =>
    apiClient.post<{ data: { accessToken: string; user: UserProfile } }>(
      "/api/v1/auth/login",
      data
    ),
};

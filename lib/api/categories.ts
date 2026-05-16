import apiClient from "./client";
import type { Category } from "../types/product";

export const categoriesApi = {
  list: () => apiClient.get<{ data: Category[] }>("/api/v1/categories"),
};

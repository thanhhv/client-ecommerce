"use client";

import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api/client";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { formatDate } from "@/lib/utils/formatDate";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  brand?: string;
  categoryId: string;
  basePrice: number;
  salePrice?: number;
  stock: number;
  isActive: boolean;
  createdAt: string;
}

interface ProductsResponse {
  items: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const LIMIT = 20;

const emptyForm = {
  name: "",
  categoryId: "",
  basePrice: "",
  salePrice: "",
  stock: "",
  brand: "",
  description: "",
  isActive: true,
};

export default function ProductsPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [files, setFiles] = useState<FileList | null>(null);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  const { data, isLoading } = useQuery<ProductsResponse>({
    queryKey: ["admin", "products", page, debouncedSearch],
    queryFn: async () => {
      const res = await apiClient.get("/api/v1/admin/products", {
        params: { page, limit: LIMIT, search: debouncedSearch || undefined },
      });
      return res.data;
    },
  });

  const { data: categories } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await apiClient.get("/api/v1/categories");
      return res.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      await apiClient.post("/api/v1/admin/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      closeModal();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      body,
    }: {
      id: string;
      body: Record<string, unknown>;
    }) => {
      await apiClient.put(`/api/v1/admin/products/${id}`, body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      closeModal();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/api/v1/admin/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
    },
  });

  const openCreate = useCallback(() => {
    setEditingProduct(null);
    setForm(emptyForm);
    setFiles(null);
    setModalOpen(true);
  }, []);

  const openEdit = useCallback((product: Product) => {
    setEditingProduct(product);
    setForm({
      name: product.name,
      categoryId: product.categoryId,
      basePrice: String(product.basePrice),
      salePrice: product.salePrice != null ? String(product.salePrice) : "",
      stock: String(product.stock),
      brand: product.brand ?? "",
      description: "",
      isActive: product.isActive,
    });
    setFiles(null);
    setModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setEditingProduct(null);
    setForm(emptyForm);
    setFiles(null);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      updateMutation.mutate({
        id: editingProduct.id,
        body: {
          name: form.name,
          categoryId: form.categoryId,
          basePrice: Number(form.basePrice),
          ...(form.salePrice ? { salePrice: Number(form.salePrice) } : {}),
          stock: Number(form.stock),
          ...(form.brand ? { brand: form.brand } : {}),
          ...(form.description ? { description: form.description } : {}),
          isActive: form.isActive,
        },
      });
    } else {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("categoryId", form.categoryId);
      fd.append("basePrice", form.basePrice);
      if (form.salePrice) fd.append("salePrice", form.salePrice);
      fd.append("stock", form.stock);
      if (form.brand) fd.append("brand", form.brand);
      if (form.description) fd.append("description", form.description);
      fd.append("isActive", String(form.isActive));
      if (files) {
        Array.from(files).forEach((f) => fd.append("images", f));
      }
      createMutation.mutate(fd);
    }
  };

  const handleDelete = (product: Product) => {
    if (confirm(`Xóa sản phẩm "${product.name}"?`)) {
      deleteMutation.mutate(product.id);
    }
  };

  const getCategoryName = (id: string) =>
    categories?.find((c) => c.id === id)?.name ?? id;

  const totalPages = data?.totalPages ?? 1;
  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-playfair text-2xl font-bold text-plant-text">
          Sản phẩm
        </h2>
        <button
          onClick={openCreate}
          className="bg-plant-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-plant-primary/90 transition-colors"
        >
          + Thêm sản phẩm
        </button>
      </div>

      {/* Search */}
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Tìm kiếm sản phẩm..."
        className="w-full max-w-sm border border-plant-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-plant-primary/30"
      />

      {/* Table */}
      <div className="bg-white rounded-xl border border-plant-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-plant-surface">
              <tr>
                <th className="text-left px-4 py-3 text-plant-muted font-medium">
                  Ảnh
                </th>
                <th className="text-left px-4 py-3 text-plant-muted font-medium">
                  Tên
                </th>
                <th className="text-left px-4 py-3 text-plant-muted font-medium">
                  Danh mục
                </th>
                <th className="text-left px-4 py-3 text-plant-muted font-medium">
                  Giá gốc
                </th>
                <th className="text-left px-4 py-3 text-plant-muted font-medium">
                  Tồn kho
                </th>
                <th className="text-left px-4 py-3 text-plant-muted font-medium">
                  Trạng thái
                </th>
                <th className="text-left px-4 py-3 text-plant-muted font-medium">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-plant-border">
              {isLoading
                ? [...Array(5)].map((_, i) => (
                    <tr key={i}>
                      {[...Array(7)].map((_, j) => (
                        <td key={j} className="px-4 py-3">
                          <div className="h-4 bg-gray-100 rounded animate-pulse" />
                        </td>
                      ))}
                    </tr>
                  ))
                : (data?.items ?? []).map((product) => (
                    <tr
                      key={product.id}
                      className="hover:bg-plant-surface/50"
                    >
                      <td className="px-4 py-3">
                        <div className="w-10 h-10 bg-plant-surface rounded-lg border border-plant-border flex items-center justify-center text-plant-muted text-xs">
                          IMG
                        </div>
                      </td>
                      <td className="px-4 py-3 text-plant-text font-medium max-w-[180px]">
                        <span className="line-clamp-2">{product.name}</span>
                      </td>
                      <td className="px-4 py-3 text-plant-muted">
                        {getCategoryName(product.categoryId)}
                      </td>
                      <td className="px-4 py-3 text-plant-text">
                        {formatCurrency(product.basePrice)}
                      </td>
                      <td className="px-4 py-3 text-plant-text">
                        {product.stock}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                            product.isActive
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {product.isActive ? "Đang bán" : "Ẩn"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openEdit(product)}
                            className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                          >
                            Sửa
                          </button>
                          <button
                            onClick={() => handleDelete(product)}
                            className="text-red-500 hover:text-red-700 text-xs font-medium"
                          >
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              {!isLoading && (data?.items ?? []).length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-8 text-center text-plant-muted"
                  >
                    Không có sản phẩm nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-plant-border flex items-center justify-between text-sm">
            <span className="text-plant-muted">
              Trang {page} / {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
                className="px-3 py-1 border border-plant-border rounded-lg disabled:opacity-40 hover:bg-plant-surface transition-colors"
              >
                Trước
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1 border border-plant-border rounded-lg disabled:opacity-40 hover:bg-plant-surface transition-colors"
              >
                Sau
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white px-6 py-4 border-b border-plant-border flex items-center justify-between">
              <h3 className="font-semibold text-plant-text">
                {editingProduct ? "Sửa sản phẩm" : "Thêm sản phẩm"}
              </h3>
              <button
                onClick={closeModal}
                className="text-plant-muted hover:text-plant-text"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-plant-text mb-1">
                  Tên sản phẩm *
                </label>
                <input
                  required
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-plant-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-plant-primary/30"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-plant-text mb-1">
                  Danh mục *
                </label>
                <select
                  required
                  value={form.categoryId}
                  onChange={(e) =>
                    setForm({ ...form, categoryId: e.target.value })
                  }
                  className="w-full border border-plant-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-plant-primary/30"
                >
                  <option value="">-- Chọn danh mục --</option>
                  {(categories ?? []).map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-plant-text mb-1">
                    Giá gốc (VND) *
                  </label>
                  <input
                    required
                    type="number"
                    min={0}
                    value={form.basePrice}
                    onChange={(e) =>
                      setForm({ ...form, basePrice: e.target.value })
                    }
                    className="w-full border border-plant-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-plant-primary/30"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-plant-text mb-1">
                    Giá sale (VND)
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={form.salePrice}
                    onChange={(e) =>
                      setForm({ ...form, salePrice: e.target.value })
                    }
                    className="w-full border border-plant-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-plant-primary/30"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-plant-text mb-1">
                    Tồn kho *
                  </label>
                  <input
                    required
                    type="number"
                    min={0}
                    value={form.stock}
                    onChange={(e) =>
                      setForm({ ...form, stock: e.target.value })
                    }
                    className="w-full border border-plant-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-plant-primary/30"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-plant-text mb-1">
                    Thương hiệu
                  </label>
                  <input
                    type="text"
                    value={form.brand}
                    onChange={(e) =>
                      setForm({ ...form, brand: e.target.value })
                    }
                    className="w-full border border-plant-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-plant-primary/30"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-plant-text mb-1">
                  Mô tả
                </label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  className="w-full border border-plant-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-plant-primary/30"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={form.isActive}
                  onChange={(e) =>
                    setForm({ ...form, isActive: e.target.checked })
                  }
                  className="w-4 h-4 accent-plant-primary"
                />
                <label
                  htmlFor="isActive"
                  className="text-sm text-plant-text font-medium"
                >
                  Đang bán (hiển thị)
                </label>
              </div>
              {!editingProduct && (
                <div>
                  <label className="block text-sm font-medium text-plant-text mb-1">
                    Hình ảnh
                  </label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => setFiles(e.target.files)}
                    className="w-full text-sm text-plant-muted"
                  />
                </div>
              )}
              {editingProduct && (
                <p className="text-xs text-plant-muted italic">
                  Quản lý hình ảnh chưa được hỗ trợ trong chức năng chỉnh sửa.
                </p>
              )}
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 bg-plant-primary text-white py-2 rounded-lg text-sm font-medium hover:bg-plant-primary/90 transition-colors disabled:opacity-60"
                >
                  {isSaving ? "Đang lưu..." : "Lưu"}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 border border-plant-border text-plant-text py-2 rounded-lg text-sm font-medium hover:bg-plant-surface transition-colors"
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

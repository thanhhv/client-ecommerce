"use client";

import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api/client";

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

const emptyForm = { name: "", description: "" };

export default function CategoriesPage() {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [form, setForm] = useState(emptyForm);

  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await apiClient.get("/api/v1/categories");
      return res.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (body: typeof emptyForm) => {
      await apiClient.post("/api/v1/admin/categories", body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      closeModal();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({
      id,
      body,
    }: {
      id: string;
      body: typeof emptyForm;
    }) => {
      await apiClient.put(`/api/v1/admin/categories/${id}`, body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      closeModal();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/api/v1/admin/categories/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });

  const openCreate = useCallback(() => {
    setEditingCategory(null);
    setForm(emptyForm);
    setModalOpen(true);
  }, []);

  const openEdit = useCallback((cat: Category) => {
    setEditingCategory(cat);
    setForm({ name: cat.name, description: cat.description ?? "" });
    setModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setEditingCategory(null);
    setForm(emptyForm);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCategory) {
      updateMutation.mutate({ id: editingCategory.id, body: form });
    } else {
      createMutation.mutate(form);
    }
  };

  const handleDelete = (cat: Category) => {
    if (confirm(`Xóa danh mục "${cat.name}"?`)) {
      deleteMutation.mutate(cat.id);
    }
  };

  const isSaving = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-playfair text-2xl font-bold text-plant-text">
          Danh mục
        </h2>
        <button
          onClick={openCreate}
          className="bg-plant-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-plant-primary/90 transition-colors"
        >
          + Thêm danh mục
        </button>
      </div>

      <div className="bg-white rounded-xl border border-plant-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-plant-surface">
              <tr>
                <th className="text-left px-4 py-3 text-plant-muted font-medium">
                  Tên
                </th>
                <th className="text-left px-4 py-3 text-plant-muted font-medium">
                  Slug
                </th>
                <th className="text-left px-4 py-3 text-plant-muted font-medium">
                  Mô tả
                </th>
                <th className="text-left px-4 py-3 text-plant-muted font-medium">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-plant-border">
              {isLoading
                ? [...Array(4)].map((_, i) => (
                    <tr key={i}>
                      {[...Array(4)].map((_, j) => (
                        <td key={j} className="px-4 py-3">
                          <div className="h-4 bg-gray-100 rounded animate-pulse" />
                        </td>
                      ))}
                    </tr>
                  ))
                : (categories ?? []).map((cat) => (
                    <tr key={cat.id} className="hover:bg-plant-surface/50">
                      <td className="px-4 py-3 font-medium text-plant-text">
                        {cat.name}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-plant-muted">
                        {cat.slug}
                      </td>
                      <td className="px-4 py-3 text-plant-muted max-w-[300px]">
                        <span className="line-clamp-2">
                          {cat.description ?? "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => openEdit(cat)}
                            className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                          >
                            Sửa
                          </button>
                          <button
                            onClick={() => handleDelete(cat)}
                            className="text-red-500 hover:text-red-700 text-xs font-medium"
                          >
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              {!isLoading && (categories ?? []).length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-8 text-center text-plant-muted"
                  >
                    Chưa có danh mục nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="px-6 py-4 border-b border-plant-border flex items-center justify-between">
              <h3 className="font-semibold text-plant-text">
                {editingCategory ? "Sửa danh mục" : "Thêm danh mục"}
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
                  Tên danh mục *
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

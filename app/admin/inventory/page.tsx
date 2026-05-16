"use client";

import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api/client";

interface InventoryItem {
  id: string;
  name: string;
  stock: number;
  isActive: boolean;
}

interface InventoryResponse {
  items: InventoryItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const LIMIT = 20;

const emptyAdjustForm = { quantityChange: "", reason: "" };

export default function InventoryPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<InventoryItem | null>(
    null
  );
  const [adjustForm, setAdjustForm] = useState(emptyAdjustForm);

  const { data, isLoading } = useQuery<InventoryResponse>({
    queryKey: ["admin", "inventory", page],
    queryFn: async () => {
      const res = await apiClient.get("/api/v1/admin/inventory", {
        params: { page, limit: LIMIT },
      });
      return res.data;
    },
  });

  const adjustMutation = useMutation({
    mutationFn: async ({
      productId,
      quantityChange,
      reason,
    }: {
      productId: string;
      quantityChange: number;
      reason: string;
    }) => {
      await apiClient.put(`/api/v1/admin/inventory/${productId}/adjust`, {
        quantityChange,
        reason,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "inventory"] });
      closeModal();
    },
  });

  const openAdjust = useCallback((item: InventoryItem) => {
    setSelectedProduct(item);
    setAdjustForm(emptyAdjustForm);
    setModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setSelectedProduct(null);
    setAdjustForm(emptyAdjustForm);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    adjustMutation.mutate({
      productId: selectedProduct.id,
      quantityChange: parseInt(adjustForm.quantityChange, 10),
      reason: adjustForm.reason,
    });
  };

  const totalPages = data?.totalPages ?? 1;

  return (
    <div className="space-y-6">
      <h2 className="font-playfair text-2xl font-bold text-plant-text">
        Kho hàng
      </h2>

      <div className="bg-white rounded-xl border border-plant-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-plant-surface">
              <tr>
                <th className="text-left px-4 py-3 text-plant-muted font-medium">
                  Sản phẩm
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
                      {[...Array(4)].map((_, j) => (
                        <td key={j} className="px-4 py-3">
                          <div className="h-4 bg-gray-100 rounded animate-pulse" />
                        </td>
                      ))}
                    </tr>
                  ))
                : (data?.items ?? []).map((item) => (
                    <tr key={item.id} className="hover:bg-plant-surface/50">
                      <td className="px-4 py-3 font-medium text-plant-text">
                        {item.name}
                      </td>
                      <td className="px-4 py-3 text-plant-text">
                        {item.stock}
                      </td>
                      <td className="px-4 py-3">
                        {item.stock <= 5 ? (
                          <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                            Sắp hết
                          </span>
                        ) : (
                          <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                            OK
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => openAdjust(item)}
                          className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                        >
                          Điều chỉnh tồn kho
                        </button>
                      </td>
                    </tr>
                  ))}
              {!isLoading && (data?.items ?? []).length === 0 && (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-8 text-center text-plant-muted"
                  >
                    Không có dữ liệu kho.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

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
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="px-6 py-4 border-b border-plant-border flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-plant-text">
                  Điều chỉnh tồn kho
                </h3>
                {selectedProduct && (
                  <p className="text-xs text-plant-muted mt-0.5">
                    {selectedProduct.name} — hiện tại: {selectedProduct.stock}
                  </p>
                )}
              </div>
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
                  Thay đổi số lượng *{" "}
                  <span className="text-plant-muted font-normal">
                    (dương = nhập thêm, âm = xuất)
                  </span>
                </label>
                <input
                  required
                  type="number"
                  value={adjustForm.quantityChange}
                  onChange={(e) =>
                    setAdjustForm({
                      ...adjustForm,
                      quantityChange: e.target.value,
                    })
                  }
                  className="w-full border border-plant-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-plant-primary/30"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-plant-text mb-1">
                  Lý do *
                </label>
                <input
                  required
                  type="text"
                  value={adjustForm.reason}
                  onChange={(e) =>
                    setAdjustForm({ ...adjustForm, reason: e.target.value })
                  }
                  className="w-full border border-plant-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-plant-primary/30"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={adjustMutation.isPending}
                  className="flex-1 bg-plant-primary text-white py-2 rounded-lg text-sm font-medium hover:bg-plant-primary/90 transition-colors disabled:opacity-60"
                >
                  {adjustMutation.isPending ? "Đang lưu..." : "Lưu"}
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

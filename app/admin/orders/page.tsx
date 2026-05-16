"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/api/client";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { formatDate } from "@/lib/utils/formatDate";

interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  userId: string;
  status: string;
  paymentMethod: string;
  subtotal: number;
  shippingFee: number;
  total: number;
  shippingName: string;
  shippingPhone: string;
  shippingAddress: string;
  createdAt: string;
  items: OrderItem[];
}

interface OrdersResponse {
  items: Order[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const LIMIT = 20;

const STATUS_OPTIONS = [
  { value: "", label: "Tất cả" },
  { value: "PENDING", label: "Chờ xử lý" },
  { value: "CONFIRMED", label: "Đã xác nhận" },
  { value: "SHIPPING", label: "Đang giao" },
  { value: "DELIVERED", label: "Đã giao" },
  { value: "CANCELLED", label: "Đã hủy" },
];

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  SHIPPING: "bg-purple-100 text-purple-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

export default function OrdersPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");

  const { data, isLoading } = useQuery<OrdersResponse>({
    queryKey: ["admin", "orders", page, statusFilter],
    queryFn: async () => {
      const res = await apiClient.get("/api/v1/admin/orders", {
        params: {
          page,
          limit: LIMIT,
          status: statusFilter || undefined,
        },
      });
      return res.data;
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      await apiClient.put(`/api/v1/admin/orders/${id}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
    },
  });

  const handleExportCSV = async () => {
    try {
      const res = await apiClient.get("/api/v1/admin/orders/export", {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = `orders-${Date.now()}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      alert("Xuất CSV thất bại.");
    }
  };

  const totalPages = data?.totalPages ?? 1;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="font-playfair text-2xl font-bold text-plant-text">
          Đơn hàng
        </h2>
        <button
          onClick={handleExportCSV}
          className="bg-white border border-plant-border text-plant-text px-4 py-2 rounded-lg text-sm font-medium hover:bg-plant-surface transition-colors"
        >
          Xuất CSV
        </button>
      </div>

      {/* Status filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {STATUS_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => {
              setStatusFilter(opt.value);
              setPage(1);
            }}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              statusFilter === opt.value
                ? "bg-plant-primary text-white"
                : "bg-white border border-plant-border text-plant-text hover:bg-plant-surface"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-plant-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-plant-surface">
              <tr>
                <th className="text-left px-4 py-3 text-plant-muted font-medium">
                  Mã đơn
                </th>
                <th className="text-left px-4 py-3 text-plant-muted font-medium">
                  Khách hàng
                </th>
                <th className="text-left px-4 py-3 text-plant-muted font-medium">
                  Sản phẩm
                </th>
                <th className="text-left px-4 py-3 text-plant-muted font-medium">
                  Tổng tiền
                </th>
                <th className="text-left px-4 py-3 text-plant-muted font-medium">
                  Trạng thái
                </th>
                <th className="text-left px-4 py-3 text-plant-muted font-medium">
                  Ngày đặt
                </th>
                <th className="text-left px-4 py-3 text-plant-muted font-medium">
                  Cập nhật
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
                : (data?.items ?? []).map((order) => (
                    <tr key={order.id} className="hover:bg-plant-surface/50">
                      <td className="px-4 py-3 font-mono text-xs text-plant-muted">
                        #{order.id.slice(0, 8)}
                      </td>
                      <td className="px-4 py-3 text-plant-text">
                        {order.shippingName}
                      </td>
                      <td className="px-4 py-3 text-plant-muted">
                        {order.items?.length ?? 0} sản phẩm
                      </td>
                      <td className="px-4 py-3 font-medium text-plant-text">
                        {formatCurrency(order.total)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                            STATUS_COLORS[order.status] ??
                            "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {STATUS_OPTIONS.find(
                            (s) => s.value === order.status
                          )?.label ?? order.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-plant-muted">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={order.status}
                          onChange={(e) =>
                            updateStatusMutation.mutate({
                              id: order.id,
                              status: e.target.value,
                            })
                          }
                          className="border border-plant-border rounded px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-plant-primary/30"
                        >
                          {STATUS_OPTIONS.filter((s) => s.value !== "").map(
                            (s) => (
                              <option key={s.value} value={s.value}>
                                {s.label}
                              </option>
                            )
                          )}
                        </select>
                      </td>
                    </tr>
                  ))}
              {!isLoading && (data?.items ?? []).length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-8 text-center text-plant-muted"
                  >
                    Không có đơn hàng nào.
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
    </div>
  );
}

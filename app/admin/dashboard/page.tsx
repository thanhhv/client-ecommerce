"use client";

import { useQuery } from "@tanstack/react-query";
import apiClient from "@/lib/api/client";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { formatDate } from "@/lib/utils/formatDate";

interface DashboardStats {
  totalRevenue: number;
  ordersToday: number;
  totalUsers: number;
  lowStockAlerts: number;
  recentOrders: Array<{
    id: string;
    userId: string;
    status: string;
    total: number;
    createdAt: string;
    shippingName: string;
  }>;
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  SHIPPING: "bg-purple-100 text-purple-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Chờ xử lý",
  CONFIRMED: "Đã xác nhận",
  SHIPPING: "Đang giao",
  DELIVERED: "Đã giao",
  CANCELLED: "Đã hủy",
};

export default function DashboardPage() {
  const { data, isLoading, error } = useQuery<DashboardStats>({
    queryKey: ["admin", "dashboard", "stats"],
    queryFn: async () => {
      const res = await apiClient.get("/api/v1/admin/dashboard/stats");
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl p-5 border border-plant-border animate-pulse h-28"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 p-4">Lỗi tải dữ liệu dashboard.</div>
    );
  }

  const stats = [
    {
      label: "Tổng doanh thu",
      value: formatCurrency(data?.totalRevenue ?? 0),
      color: "text-plant-primary",
    },
    {
      label: "Đơn hàng hôm nay",
      value: data?.ordersToday ?? 0,
      color: "text-blue-600",
    },
    {
      label: "Tổng người dùng",
      value: data?.totalUsers ?? 0,
      color: "text-purple-600",
    },
    {
      label: "Cảnh báo tồn kho",
      value: data?.lowStockAlerts ?? 0,
      color: "text-red-500",
    },
  ];

  return (
    <div className="space-y-8">
      <h2 className="font-playfair text-2xl font-bold text-plant-text">
        Dashboard
      </h2>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-xl p-5 border border-plant-border"
          >
            <p className="text-sm text-plant-muted mb-1">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-xl border border-plant-border overflow-hidden">
        <div className="px-6 py-4 border-b border-plant-border">
          <h3 className="font-semibold text-plant-text">Đơn hàng gần đây</h3>
        </div>
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
                  Tổng tiền
                </th>
                <th className="text-left px-4 py-3 text-plant-muted font-medium">
                  Trạng thái
                </th>
                <th className="text-left px-4 py-3 text-plant-muted font-medium">
                  Ngày đặt
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-plant-border">
              {(data?.recentOrders ?? []).map((order) => (
                <tr key={order.id} className="hover:bg-plant-surface/50">
                  <td className="px-4 py-3 font-mono text-xs text-plant-muted">
                    #{order.id.slice(0, 8)}
                  </td>
                  <td className="px-4 py-3 text-plant-text">
                    {order.shippingName}
                  </td>
                  <td className="px-4 py-3 text-plant-text font-medium">
                    {formatCurrency(order.total)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                        STATUS_COLORS[order.status] ?? "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {STATUS_LABELS[order.status] ?? order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-plant-muted">
                    {formatDate(order.createdAt)}
                  </td>
                </tr>
              ))}
              {(data?.recentOrders ?? []).length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-8 text-center text-plant-muted"
                  >
                    Chưa có đơn hàng nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

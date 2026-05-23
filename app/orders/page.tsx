"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ordersApi } from "@/lib/api/orders";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { formatDate } from "@/lib/utils/formatDate";
import { Skeleton } from "@/components/ui/skeleton";
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS, type OrderStatus } from "@/lib/utils/orderStatus";
import { ChevronRight, ShoppingBag } from "lucide-react";

interface OrderListItem {
  id: string;
  status: OrderStatus;
  paymentMethod: string;
  total: number;
  itemCount: number;
  createdAt: string;
}

interface OrdersResponse {
  data: OrderListItem[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

const LIMIT = 10;

export default function OrdersPage() {
  const [page, setPage] = useState(1);

  const query = useQuery<OrdersResponse>({
    queryKey: ["orders", page],
    queryFn: async () => {
      const res = await ordersApi.list({ page, limit: LIMIT });
      return { data: res.data.data ?? [], pagination: res.data.pagination };
    },
    placeholderData: (prev) => prev,
  });

  const orders = query.data?.data ?? [];
  const pagination = query.data?.pagination;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="font-playfair text-3xl font-bold text-plant-text mb-8">Đơn hàng của tôi</h1>

      {query.isError ? (
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <p className="text-plant-muted mb-4">Không thể tải danh sách đơn hàng.</p>
          <button onClick={() => query.refetch()} className="text-plant-primary underline text-sm">
            Thử lại
          </button>
        </div>
      ) : query.isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-24 rounded-2xl" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16">
          <ShoppingBag size={56} className="mx-auto text-plant-border mb-4" />
          <p className="font-playfair text-xl font-bold text-plant-text mb-2">Chưa có đơn hàng nào</p>
          <p className="text-plant-muted mb-6">Hãy đặt đơn hàng đầu tiên của bạn!</p>
          <Link
            href="/products"
            className="inline-block bg-plant-primary hover:bg-plant-primary-light text-white font-semibold px-8 py-3 rounded-xl transition-colors"
          >
            Mua ngay
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/orders/${order.id}`}
              className="flex items-center gap-4 bg-white rounded-2xl border border-plant-border p-5 hover:border-plant-primary hover:shadow-sm transition-all group"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <p className="text-sm font-semibold text-plant-text font-mono">
                    #{order.id.slice(0, 8).toUpperCase()}
                  </p>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${ORDER_STATUS_COLORS[order.status]}`}>
                    {ORDER_STATUS_LABELS[order.status]}
                  </span>
                </div>
                <p className="text-xs text-plant-muted">
                  {formatDate(order.createdAt)} · {order.itemCount} sản phẩm ·{" "}
                  {order.paymentMethod === "COD" ? "COD" : "Chuyển khoản"}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="font-bold text-plant-text">{formatCurrency(order.total)}</p>
                <ChevronRight size={16} className="ml-auto text-plant-muted group-hover:text-plant-primary transition-colors mt-1" />
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-8">
          <button
            onClick={() => setPage((p) => p - 1)}
            disabled={page <= 1}
            className="px-4 py-2 rounded-lg border border-plant-border text-sm text-plant-text hover:bg-plant-surface disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            ← Trước
          </button>
          <span className="text-sm text-plant-muted">
            Trang {pagination.page} / {pagination.totalPages}
          </span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={page >= pagination.totalPages}
            className="px-4 py-2 rounded-lg border border-plant-border text-sm text-plant-text hover:bg-plant-surface disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Tiếp →
          </button>
        </div>
      )}
    </div>
  );
}

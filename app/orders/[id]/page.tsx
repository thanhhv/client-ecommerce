"use client";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ordersApi } from "@/lib/api/orders";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { formatDate } from "@/lib/utils/formatDate";
import { Skeleton } from "@/components/ui/skeleton";
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS, type OrderStatus } from "@/lib/utils/orderStatus";
import { ArrowLeft, Package, CheckCircle, Truck, Home, XCircle } from "lucide-react";
import type { ElementType } from "react";

interface OrderItem {
  id: string;
  productId: string | null;
  productNameSnapshot: string;
  productImageSnapshot: string | null;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface OrderDetail {
  id: string;
  userId: string;
  status: OrderStatus;
  paymentMethod: "COD" | "BANK_TRANSFER";
  subtotal: number;
  shippingFee: number;
  total: number;
  shippingName: string;
  shippingPhone: string;
  shippingAddress: string;
  notes: string | null;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

const STEPS: { status: OrderStatus; label: string; Icon: ElementType }[] = [
  { status: "PENDING", label: "Đặt hàng", Icon: Package },
  { status: "CONFIRMED", label: "Xác nhận", Icon: CheckCircle },
  { status: "SHIPPING", label: "Đang giao", Icon: Truck },
  { status: "DELIVERED", label: "Đã giao", Icon: Home },
];

function StatusStepper({ status }: { status: OrderStatus }) {
  if (status === "CANCELLED") {
    return (
      <div className="flex items-center gap-2 p-4 bg-red-50 rounded-xl text-red-600">
        <XCircle size={20} />
        <span className="font-medium">Đơn hàng đã bị huỷ</span>
      </div>
    );
  }

  const activeIndex = STEPS.findIndex((s) => s.status === status);

  return (
    <div className="relative flex items-start justify-between">
      {/* Connecting line */}
      <div className="absolute top-5 left-5 right-5 h-0.5 bg-plant-border" />
      <div
        className="absolute top-5 left-5 h-0.5 bg-plant-primary transition-all"
        style={{ width: activeIndex > 0 ? `${(activeIndex / (STEPS.length - 1)) * 100}%` : "0%" }}
      />

      {STEPS.map((step, i) => {
        const isCompleted = i <= activeIndex;
        const isCurrent = i === activeIndex;
        return (
          <div key={step.status} className="relative flex flex-col items-center gap-2 z-10">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                isCompleted
                  ? "bg-plant-primary border-plant-primary text-white"
                  : "bg-white border-plant-border text-plant-muted"
              } ${isCurrent ? "ring-4 ring-plant-primary/20" : ""}`}
            >
              <step.Icon size={18} />
            </div>
            <span
              className={`text-xs font-medium text-center ${
                isCompleted ? "text-plant-primary" : "text-plant-muted"
              }`}
            >
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const orderId = params.id as string;

  const query = useQuery<OrderDetail>({
    queryKey: ["order", orderId],
    queryFn: async () => {
      const res = await ordersApi.getById(orderId);
      return res.data.data;
    },
    enabled: !!orderId,
  });

  const cancelMutation = useMutation({
    mutationFn: () => ordersApi.cancel(orderId),
    onSuccess: () => {
      toast.success("Đã huỷ đơn hàng");
      queryClient.invalidateQueries({ queryKey: ["order", orderId] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: () => toast.error("Không thể huỷ đơn hàng"),
  });

  const order = query.data;

  if (query.isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 rounded-2xl" />
        <Skeleton className="h-48 rounded-2xl" />
        <Skeleton className="h-32 rounded-2xl" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <p className="text-plant-muted mb-4">Không tìm thấy đơn hàng.</p>
        <Link href="/orders" className="text-plant-primary underline">← Quay lại đơn hàng</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-plant-surface rounded-lg transition-colors text-plant-muted hover:text-plant-text"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="font-playfair text-2xl font-bold text-plant-text">
            Đơn #{order.id.slice(0, 8).toUpperCase()}
          </h1>
          <p className="text-sm text-plant-muted">{formatDate(order.createdAt)}</p>
        </div>
        <span className={`ml-auto text-sm font-medium px-3 py-1 rounded-full ${ORDER_STATUS_COLORS[order.status]}`}>
          {ORDER_STATUS_LABELS[order.status]}
        </span>
      </div>

      {/* Status stepper */}
      <div className="bg-white rounded-2xl border border-plant-border p-6">
        <h2 className="font-semibold text-plant-text mb-6">Trạng thái đơn hàng</h2>
        <StatusStepper status={order.status} />
      </div>

      {/* Items */}
      <div className="bg-white rounded-2xl border border-plant-border p-6">
        <h2 className="font-semibold text-plant-text mb-4">Sản phẩm</h2>
        <div className="space-y-4">
          {order.items.map((item) => (
            <div key={item.id} className="flex gap-4">
              <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-plant-surface border border-plant-border shrink-0">
                {item.productImageSnapshot ? (
                  <Image
                    src={item.productImageSnapshot}
                    alt={item.productNameSnapshot}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xl">🌿</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-plant-text text-sm line-clamp-2">
                  {item.productNameSnapshot}
                </p>
                <p className="text-xs text-plant-muted mt-0.5">
                  {formatCurrency(item.unitPrice)} × {item.quantity}
                </p>
              </div>
              <p className="font-semibold text-plant-text shrink-0 text-sm">
                {formatCurrency(item.totalPrice)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Shipping + payment + price breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-plant-border p-6 space-y-3">
          <h2 className="font-semibold text-plant-text">Thông tin giao hàng</h2>
          <div className="text-sm space-y-1 text-plant-muted">
            <p className="text-plant-text font-medium">{order.shippingName}</p>
            <p>{order.shippingPhone}</p>
            <p>{order.shippingAddress}</p>
            {order.notes && (
              <p className="mt-2 text-xs italic">Ghi chú: {order.notes}</p>
            )}
          </div>
          <div className="pt-2 border-t border-plant-border">
            <p className="text-sm text-plant-muted">
              Thanh toán:{" "}
              <span className="font-medium text-plant-text">
                {order.paymentMethod === "COD" ? "Tiền mặt khi nhận" : "Chuyển khoản"}
              </span>
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-plant-border p-6 space-y-3">
          <h2 className="font-semibold text-plant-text">Chi tiết thanh toán</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-plant-muted">
              <span>Tạm tính</span>
              <span>{formatCurrency(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-plant-muted">
              <span>Phí vận chuyển</span>
              <span>
                {order.shippingFee === 0 ? (
                  <span className="text-plant-primary">Miễn phí</span>
                ) : formatCurrency(order.shippingFee)}
              </span>
            </div>
            <div className="border-t border-plant-border pt-2 flex justify-between font-bold text-plant-text">
              <span>Tổng cộng</span>
              <span className="text-plant-primary">{formatCurrency(order.total)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel button */}
      {order.status === "PENDING" && (
        <div className="bg-red-50 rounded-2xl border border-red-200 p-6">
          <p className="text-sm text-plant-muted mb-3">
            Bạn có thể huỷ đơn hàng khi đơn đang ở trạng thái <strong>Chờ xác nhận</strong>.
          </p>
          <button
            onClick={() => {
              if (confirm("Bạn có chắc muốn huỷ đơn hàng này?")) {
                cancelMutation.mutate();
              }
            }}
            disabled={cancelMutation.isPending}
            className="px-6 py-2.5 border-2 border-red-400 text-red-600 hover:bg-red-100 font-medium rounded-xl transition-colors disabled:opacity-50 text-sm"
          >
            {cancelMutation.isPending ? "Đang huỷ..." : "Huỷ đơn hàng"}
          </button>
        </div>
      )}
    </div>
  );
}

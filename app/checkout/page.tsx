"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useQuery, useMutation } from "@tanstack/react-query";
import { cartApi } from "@/lib/api/cart";
import { ordersApi, type PlaceOrderInput } from "@/lib/api/orders";
import { useAuthStore } from "@/lib/stores/authStore";
import { useCartStore } from "@/lib/stores/cartStore";
import AddressForm from "@/components/checkout/AddressForm";
import PaymentMethodSelect from "@/components/checkout/PaymentMethodSelect";
import OrderSummary from "@/components/checkout/OrderSummary";
import { Skeleton } from "@/components/ui/skeleton";

type PaymentMethod = "COD" | "BANK_TRANSFER";

interface FormData {
  shippingName: string;
  shippingPhone: string;
  shippingAddress: string;
  notes: string;
  paymentMethod: PaymentMethod;
}

interface FormErrors {
  shippingName?: string;
  shippingPhone?: string;
  shippingAddress?: string;
}

interface BeCartItem {
  id: string;
  productId: string;
  productName: string;
  productImageUrl: string | null;
  quantity: number;
  priceSnapshot: number;
  lineTotal: number;
  currentStock: number;
}

interface BeCart {
  id: string;
  items: BeCartItem[];
  subtotal: number;
  itemCount: number;
}

function validate(data: FormData): FormErrors {
  const errors: FormErrors = {};
  if (!data.shippingName.trim()) errors.shippingName = "Vui lòng nhập họ tên";
  if (!data.shippingPhone.trim()) errors.shippingPhone = "Vui lòng nhập số điện thoại";
  else if (!/^[0-9]{9,15}$/.test(data.shippingPhone.replace(/\s/g, "")))
    errors.shippingPhone = "Số điện thoại không hợp lệ";
  if (!data.shippingAddress.trim()) errors.shippingAddress = "Vui lòng nhập địa chỉ";
  return errors;
}

export default function CheckoutPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const clearLocalCart = useCartStore((s) => s.clear);

  const [form, setForm] = useState<FormData>({
    shippingName: user?.name ?? "",
    shippingPhone: "",
    shippingAddress: "",
    notes: "",
    paymentMethod: "COD",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  // Pre-fill name from user profile when auth loads
  useEffect(() => {
    if (user?.name) setForm((f) => ({ ...f, shippingName: user.name! }));
  }, [user?.name]);

  const cartQuery = useQuery<BeCart>({
    queryKey: ["cart-checkout"],
    queryFn: async () => {
      const res = await cartApi.get();
      return res.data.data;
    },
  });

  const placeOrder = useMutation({
    mutationFn: (data: PlaceOrderInput) => ordersApi.place(data),
    onSuccess: (res) => {
      clearLocalCart();
      const orderId = (res.data as { data: { id: string } }).data.id;
      toast.success("Đặt hàng thành công!");
      router.push(`/orders/${orderId}`);
    },
    onError: (err: unknown) => {
      const msg =
        (err as { response?: { data?: { error?: { message?: string } } } })
          ?.response?.data?.error?.message ?? "Đặt hàng thất bại, vui lòng thử lại";
      toast.error(msg);
    },
  });

  function handleSubmit() {
    const validationErrors = validate(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    placeOrder.mutate({
      paymentMethod: form.paymentMethod,
      shippingName: form.shippingName.trim(),
      shippingPhone: form.shippingPhone.trim(),
      shippingAddress: form.shippingAddress.trim(),
      notes: form.notes.trim() || undefined,
    });
  }

  const cart = cartQuery.data;

  if (cartQuery.isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Skeleton className="h-9 w-48 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-48 rounded-2xl" />
            <Skeleton className="h-32 rounded-2xl" />
          </div>
          <Skeleton className="h-64 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-plant-muted mb-4">Giỏ hàng trống. Hãy thêm sản phẩm trước.</p>
        <a href="/products" className="text-plant-primary underline">Xem sản phẩm</a>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="font-playfair text-3xl font-bold text-plant-text mb-8">Thanh toán</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Form sections */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section 1: Delivery */}
          <section className="bg-white rounded-2xl border border-plant-border p-6">
            <h2 className="font-semibold text-plant-text text-lg mb-4">
              1. Thông tin giao hàng
            </h2>
            <AddressForm
              data={{
                shippingName: form.shippingName,
                shippingPhone: form.shippingPhone,
                shippingAddress: form.shippingAddress,
              }}
              onChange={(updates) => {
                setForm((f) => ({ ...f, ...updates }));
                setErrors((e) => {
                  const updated = { ...e };
                  (Object.keys(updates) as (keyof FormErrors)[]).forEach((k) => delete updated[k]);
                  return updated;
                });
              }}
              errors={errors}
            />
          </section>

          {/* Section 2: Payment */}
          <section className="bg-white rounded-2xl border border-plant-border p-6">
            <h2 className="font-semibold text-plant-text text-lg mb-4">
              2. Phương thức thanh toán
            </h2>
            <PaymentMethodSelect
              value={form.paymentMethod}
              onChange={(method) => setForm((f) => ({ ...f, paymentMethod: method }))}
            />
          </section>

          {/* Section 3: Notes */}
          <section className="bg-white rounded-2xl border border-plant-border p-6">
            <h2 className="font-semibold text-plant-text text-lg mb-4">
              3. Ghi chú đơn hàng
            </h2>
            <textarea
              rows={3}
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              placeholder="Ghi chú cho người giao hàng (không bắt buộc)..."
              className="w-full border border-plant-border rounded-xl px-4 py-2.5 text-sm text-plant-text placeholder:text-plant-muted focus:outline-none focus:ring-2 focus:ring-plant-primary resize-none"
            />
          </section>
        </div>

        {/* Right: Order summary (sticky) */}
        <div className="lg:sticky lg:top-24 self-start space-y-4">
          <OrderSummary items={cart.items} subtotal={cart.subtotal} />

          <button
            onClick={handleSubmit}
            disabled={placeOrder.isPending}
            className="w-full bg-plant-primary hover:bg-plant-primary-light text-white font-semibold py-4 rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed text-base"
          >
            {placeOrder.isPending ? "Đang đặt hàng..." : "Đặt hàng ngay"}
          </button>

          <p className="text-xs text-plant-muted text-center">
            Bằng cách đặt hàng, bạn đồng ý với điều khoản sử dụng của chúng tôi.
          </p>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Lock, ArrowLeft, Loader2, MessageSquare } from "lucide-react";
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

function SectionCard({
  number,
  title,
  icon: Icon,
  children,
}: {
  number: string;
  title: string;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-white rounded-2xl border border-plant-border/60 shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-plant-border/40 bg-plant-surface/40">
        <div className="w-7 h-7 rounded-full bg-plant-primary text-white text-xs font-bold flex items-center justify-center shrink-0">
          {number}
        </div>
        <h2 className="font-semibold text-plant-text text-[16px]">{title}</h2>
        {Icon && <Icon size={16} className="text-plant-muted ml-auto" />}
      </div>
      <div className="p-6">{children}</div>
    </section>
  );
}

export default function CheckoutPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const clearLocalCart = useCartStore((s) => s.clear);
  const queryClient = useQueryClient();

  const [form, setForm] = useState<FormData>({
    shippingName: user?.name ?? "",
    shippingPhone: "",
    shippingAddress: "",
    notes: "",
    paymentMethod: "COD",
  });
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (user?.name) setForm((f) => ({ ...f, shippingName: user.name! }));
  }, [user?.name]);

  const cartQuery = useQuery<BeCart>({
    queryKey: ["cart"],
    queryFn: async () => {
      const res = await cartApi.get();
      return res.data.data;
    },
  });

  const placeOrder = useMutation({
    mutationFn: (data: PlaceOrderInput) => ordersApi.place(data),
    onSuccess: (res) => {
      clearLocalCart();
      queryClient.invalidateQueries({ queryKey: ["cart"] });
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Skeleton className="h-8 w-48 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
          <div className="space-y-4">
            <Skeleton className="h-52 rounded-2xl" />
            <Skeleton className="h-40 rounded-2xl" />
            <Skeleton className="h-32 rounded-2xl" />
          </div>
          <Skeleton className="h-96 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center">
        <p className="text-plant-muted mb-4">Giỏ hàng trống. Hãy thêm sản phẩm trước.</p>
        <Link href="/products" className="text-plant-primary underline font-medium text-sm">
          Xem sản phẩm
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/cart"
          className="w-9 h-9 flex items-center justify-center rounded-xl bg-plant-surface hover:bg-plant-border/60 text-plant-muted hover:text-plant-text transition-colors"
        >
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="font-playfair text-2xl font-bold text-plant-text">Thanh toán</h1>
          <p className="text-plant-muted text-sm mt-0.5">{cart.itemCount} sản phẩm</p>
        </div>
        <div className="ml-auto hidden sm:flex items-center gap-1.5 text-plant-muted text-sm">
          <Lock size={13} className="text-plant-primary" />
          <span>Thanh toán bảo mật</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">
        {/* Left: form sections */}
        <div className="space-y-4">
          <SectionCard number="1" title="Thông tin giao hàng">
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
          </SectionCard>

          <SectionCard number="2" title="Phương thức thanh toán">
            <PaymentMethodSelect
              value={form.paymentMethod}
              onChange={(method) => setForm((f) => ({ ...f, paymentMethod: method }))}
            />
          </SectionCard>

          <SectionCard number="3" title="Ghi chú đơn hàng" icon={MessageSquare}>
            <textarea
              rows={3}
              value={form.notes}
              onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              placeholder="Ghi chú cho người giao hàng (không bắt buộc)..."
              className="w-full border border-plant-border rounded-xl px-4 py-3 text-[15px] text-plant-text placeholder:text-plant-muted/60 focus:outline-none focus:ring-2 focus:ring-plant-primary/15 focus:border-plant-primary/60 transition-all resize-none bg-white"
            />
          </SectionCard>
        </div>

        {/* Right: summary + submit */}
        <div className="lg:sticky lg:top-24 space-y-4">
          <OrderSummary items={cart.items} subtotal={cart.subtotal} />

          <button
            onClick={handleSubmit}
            disabled={placeOrder.isPending}
            className="w-full flex items-center justify-center gap-2 bg-plant-primary hover:bg-plant-primary-light disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-xl transition-all shadow-sm hover:shadow-md text-[15px]"
          >
            {placeOrder.isPending ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Đang xử lý...
              </>
            ) : (
              <>
                <Lock size={16} />
                Đặt hàng ngay
              </>
            )}
          </button>

          <p className="text-xs text-plant-muted text-center leading-relaxed px-4">
            Bằng cách đặt hàng, bạn đồng ý với{" "}
            <span className="underline cursor-pointer hover:text-plant-text transition-colors">điều khoản sử dụng</span>{" "}
            của chúng tôi.
          </p>
        </div>
      </div>
    </div>
  );
}

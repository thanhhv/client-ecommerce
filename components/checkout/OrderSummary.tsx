import Image from "next/image";
import { ShieldCheck, Truck, RefreshCcw } from "lucide-react";
import { formatCurrency } from "@/lib/utils/formatCurrency";

interface OrderItem {
  productId: string;
  productName: string;
  productImageUrl: string | null;
  quantity: number;
  priceSnapshot: number;
  lineTotal: number;
}

interface OrderSummaryProps {
  items: OrderItem[];
  subtotal: number;
}

const FREE_SHIPPING_THRESHOLD = 500_000;
const SHIPPING_FEE = 30_000;

export default function OrderSummary({ items, subtotal }: OrderSummaryProps) {
  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = subtotal + shippingFee;

  return (
    <div className="bg-white rounded-2xl border border-plant-border/60 shadow-sm overflow-hidden">
      <div className="px-5 pt-5 pb-4 border-b border-plant-border/40">
        <h2 className="font-semibold text-plant-text text-[16px]">Đơn hàng của bạn</h2>
        <p className="text-plant-muted text-sm mt-0.5">{items.length} sản phẩm</p>
      </div>

      {/* Items */}
      <div className="divide-y divide-plant-border/40 max-h-[260px] overflow-y-auto">
        {items.map((item) => (
          <div key={item.productId} className="flex gap-3 items-center px-5 py-3.5">
            <div className="relative w-11 h-11 rounded-lg overflow-hidden bg-plant-surface shrink-0 ring-1 ring-plant-border/40">
              {item.productImageUrl ? (
                <Image src={item.productImageUrl} alt={item.productName} fill className="object-cover" sizes="44px" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-base">🌿</div>
              )}
              <span className="absolute -top-1.5 -right-1.5 bg-plant-accent text-white text-[10px] min-w-[18px] h-[18px] rounded-full flex items-center justify-center font-bold px-1 leading-none">
                {item.quantity}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-medium text-plant-text line-clamp-1">{item.productName}</p>
              <p className="text-xs text-plant-muted mt-0.5 tabular-nums">{formatCurrency(item.priceSnapshot)} × {item.quantity}</p>
            </div>
            <p className="text-[13px] font-semibold text-plant-text shrink-0 tabular-nums">{formatCurrency(item.lineTotal)}</p>
          </div>
        ))}
      </div>

      {/* Price breakdown */}
      <div className="px-5 py-4 space-y-3 border-t border-plant-border/40">
        <div className="flex justify-between text-sm">
          <span className="text-plant-muted">Tạm tính</span>
          <span className="text-plant-text font-medium tabular-nums">{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-plant-muted">Phí vận chuyển</span>
          <span>
            {shippingFee === 0 ? (
              <span className="text-plant-primary font-semibold">Miễn phí</span>
            ) : (
              <span className="text-plant-text font-medium tabular-nums">{formatCurrency(shippingFee)}</span>
            )}
          </span>
        </div>
        <div className="h-px bg-plant-border/60" />
        <div className="flex justify-between">
          <span className="font-semibold text-plant-text">Tổng cộng</span>
          <span className="font-bold text-plant-primary text-lg tabular-nums">{formatCurrency(total)}</span>
        </div>
      </div>

      {/* Trust indicators */}
      <div className="border-t border-plant-border/40 bg-plant-surface/60 px-5 py-3.5">
        <div className="grid grid-cols-3 gap-2">
          {[
            { icon: ShieldCheck, text: "Bảo mật SSL" },
            { icon: Truck, text: "Giao nhanh" },
            { icon: RefreshCcw, text: "Đổi trả 7 ngày" },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex flex-col items-center gap-1 text-center">
              <Icon size={14} className="text-plant-primary" />
              <span className="text-[11px] text-plant-muted leading-tight">{text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import Image from "next/image";
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
    <div className="bg-white rounded-2xl border border-plant-border p-6 space-y-4">
      <h2 className="font-playfair text-xl font-bold text-plant-text">Đơn hàng của bạn</h2>

      {/* Items list */}
      <div className="space-y-3 max-h-64 overflow-y-auto">
        {items.map((item) => (
          <div key={item.productId} className="flex gap-3 items-start">
            <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-plant-surface shrink-0 border border-plant-border">
              {item.productImageUrl ? (
                <Image src={item.productImageUrl} alt={item.productName} fill className="object-cover" sizes="48px" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-lg">🌿</div>
              )}
              <span className="absolute -top-1 -right-1 bg-plant-accent text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {item.quantity}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-plant-text line-clamp-2">{item.productName}</p>
              <p className="text-xs text-plant-muted">{formatCurrency(item.priceSnapshot)} × {item.quantity}</p>
            </div>
            <p className="text-xs font-semibold text-plant-text shrink-0">{formatCurrency(item.lineTotal)}</p>
          </div>
        ))}
      </div>

      <div className="border-t border-plant-border pt-3 space-y-2 text-sm">
        <div className="flex justify-between text-plant-muted">
          <span>Tạm tính</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between text-plant-muted">
          <span>Phí vận chuyển</span>
          <span>
            {shippingFee === 0 ? (
              <span className="text-plant-primary font-medium">Miễn phí</span>
            ) : formatCurrency(shippingFee)}
          </span>
        </div>
        <div className="border-t border-plant-border pt-2 flex justify-between font-bold text-plant-text">
          <span>Tổng cộng</span>
          <span className="text-plant-primary text-lg">{formatCurrency(total)}</span>
        </div>
      </div>
    </div>
  );
}

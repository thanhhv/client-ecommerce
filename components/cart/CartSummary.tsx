"use client";

import Link from "next/link";
import { formatCurrency } from "@/lib/utils/formatCurrency";

const FREE_SHIPPING_THRESHOLD = 500_000;
const SHIPPING_FEE = 30_000;

interface CartSummaryProps {
  subtotal: number;
}

export default function CartSummary({ subtotal }: CartSummaryProps) {
  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = subtotal + shippingFee;
  const remaining = FREE_SHIPPING_THRESHOLD - subtotal;

  return (
    <div className="bg-white rounded-2xl border border-plant-border p-6 space-y-4">
      <h2 className="font-playfair text-xl font-bold text-plant-text">Tóm tắt đơn hàng</h2>

      {remaining > 0 && (
        <p className="text-xs text-plant-muted bg-plant-surface px-3 py-2 rounded-lg">
          🚚 Thêm {formatCurrency(remaining)} để được miễn phí vận chuyển
        </p>
      )}

      <div className="space-y-2 text-sm">
        <div className="flex justify-between text-plant-muted">
          <span>Tạm tính</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between text-plant-muted">
          <span>Phí vận chuyển</span>
          <span>
            {shippingFee === 0 ? (
              <span className="text-plant-primary font-medium">Miễn phí</span>
            ) : (
              formatCurrency(shippingFee)
            )}
          </span>
        </div>
        <div className="border-t border-plant-border pt-2 flex justify-between font-bold text-plant-text text-base">
          <span>Tổng cộng</span>
          <span>{formatCurrency(total)}</span>
        </div>
      </div>

      <Link
        href="/checkout"
        className="block w-full text-center bg-plant-primary hover:bg-plant-primary-light text-white font-semibold py-3 rounded-xl transition-colors"
      >
        Tiến hành thanh toán
      </Link>
      <Link
        href="/products"
        className="block w-full text-center border border-plant-border text-plant-muted hover:text-plant-text py-3 rounded-xl transition-colors text-sm"
      >
        Tiếp tục mua sắm
      </Link>
    </div>
  );
}

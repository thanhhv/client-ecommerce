"use client";

import Link from "next/link";
import { ShieldCheck, Truck, ChevronRight } from "lucide-react";
import { formatCurrency } from "@/lib/utils/formatCurrency";

const FREE_SHIPPING_THRESHOLD = 500_000;
const SHIPPING_FEE = 30_000;

interface CartSummaryProps {
  subtotal: number;
}

export default function CartSummary({ subtotal }: CartSummaryProps) {
  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = subtotal + shippingFee;
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  return (
    <div className="bg-white rounded-2xl border border-plant-border/60 shadow-sm overflow-hidden">
      <div className="p-6 space-y-5">
        <h2 className="font-semibold text-plant-text text-[17px]">Tóm tắt đơn hàng</h2>

        {/* Free shipping progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 text-plant-muted">
              <Truck size={13} className={remaining === 0 ? "text-plant-primary" : ""} />
              {remaining > 0
                ? <span>Thêm <strong className="text-plant-text">{formatCurrency(remaining)}</strong> để miễn phí ship</span>
                : <span className="text-plant-primary font-medium">Bạn được miễn phí vận chuyển! 🎉</span>
              }
            </span>
          </div>
          <div className="h-1.5 bg-plant-surface rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-plant-primary to-plant-primary-light rounded-full transition-all duration-700 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Price breakdown */}
        <div className="space-y-3">
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

        {/* CTA */}
        <Link
          href="/checkout"
          className="flex items-center justify-center gap-2 w-full bg-plant-primary hover:bg-plant-primary-light text-white font-semibold py-3.5 rounded-xl transition-all text-[15px] group shadow-sm hover:shadow-md"
        >
          Tiến hành thanh toán
          <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
        </Link>
        <Link
          href="/products"
          className="block w-full text-center text-plant-muted hover:text-plant-text text-sm transition-colors py-1"
        >
          ← Tiếp tục mua sắm
        </Link>
      </div>

      {/* Trust footer */}
      <div className="border-t border-plant-border/40 px-6 py-4 bg-plant-surface/60">
        <p className="flex items-center justify-center gap-1.5 text-plant-muted text-xs">
          <ShieldCheck size={13} className="text-plant-primary" />
          Thanh toán 100% bảo mật &amp; được mã hóa SSL
        </p>
      </div>
    </div>
  );
}

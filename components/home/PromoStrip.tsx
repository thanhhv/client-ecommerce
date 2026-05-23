"use client";
import { useState } from "react";
import { X, Leaf } from "lucide-react";

export default function PromoStrip() {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;
  return (
    <div className="bg-plant-text text-white text-xs py-2.5 px-4 flex items-center justify-center gap-3 relative">
      <Leaf size={13} className="text-green-400 shrink-0" />
      <span className="tracking-wide">Miễn phí vận chuyển cho đơn hàng trên <strong>500.000₫</strong> · Cam kết cây tươi 100%</span>
      <button
        onClick={() => setDismissed(true)}
        className="absolute right-4 top-1/2 -translate-y-1/2 hover:opacity-70 transition-opacity"
        aria-label="Đóng"
      >
        <X size={14} />
      </button>
    </div>
  );
}

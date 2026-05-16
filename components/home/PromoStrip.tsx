"use client";

import { useState } from "react";
import { X } from "lucide-react";

export default function PromoStrip() {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <div className="bg-plant-primary text-white text-sm py-2 px-4 text-center relative">
      <span>🌿 Miễn phí vận chuyển cho đơn hàng trên 500.000₫ | Cây tươi đảm bảo</span>
      <button
        onClick={() => setDismissed(true)}
        className="absolute right-4 top-1/2 -translate-y-1/2 hover:opacity-70 transition-opacity"
        aria-label="Đóng"
      >
        <X size={16} />
      </button>
    </div>
  );
}

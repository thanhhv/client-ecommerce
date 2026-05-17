"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, X } from "lucide-react";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import type { BeCartItem } from "@/lib/types/cart";

interface CartItemProps {
  item: BeCartItem;
  onUpdateQty: (itemId: string, quantity: number) => void;
  onRemove: (itemId: string) => void;
  isLoading?: boolean;
}

export default function CartItem({ item, onUpdateQty, onRemove, isLoading }: CartItemProps) {
  return (
    <div className={`flex gap-5 py-6 transition-opacity duration-200 ${isLoading ? "opacity-40 pointer-events-none" : ""}`}>
      <Link href={`/products/${item.productSlug}`} className="shrink-0">
        <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-plant-surface ring-1 ring-plant-border/60">
          {item.productImageUrl ? (
            <Image
              src={item.productImageUrl}
              alt={item.productName}
              fill
              className="object-cover hover:scale-105 transition-transform duration-300"
              sizes="96px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-3xl">🌿</div>
          )}
        </div>
      </Link>

      <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link
              href={`/products/${item.productSlug}`}
              className="font-medium text-plant-text text-[15px] leading-snug hover:text-plant-primary transition-colors line-clamp-2"
            >
              {item.productName}
            </Link>
            <p className="text-plant-muted text-sm mt-1">{formatCurrency(item.priceSnapshot)} / sản phẩm</p>
          </div>
          <button
            onClick={() => onRemove(item.id)}
            disabled={isLoading}
            className="shrink-0 mt-0.5 w-7 h-7 flex items-center justify-center rounded-full text-plant-muted/60 hover:text-red-500 hover:bg-red-50 transition-colors"
            aria-label="Xóa sản phẩm"
          >
            <X size={14} />
          </button>
        </div>

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center bg-plant-surface rounded-xl p-1 gap-0.5">
            <button
              onClick={() => onUpdateQty(item.id, item.quantity - 1)}
              disabled={item.quantity <= 1 || isLoading}
              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white hover:shadow-sm text-plant-text disabled:opacity-30 transition-all"
              aria-label="Giảm số lượng"
            >
              <Minus size={13} />
            </button>
            <span className="w-9 text-center text-[14px] font-semibold text-plant-text tabular-nums select-none">
              {item.quantity}
            </span>
            <button
              onClick={() => onUpdateQty(item.id, item.quantity + 1)}
              disabled={item.quantity >= item.currentStock || isLoading}
              className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white hover:shadow-sm text-plant-text disabled:opacity-30 transition-all"
              aria-label="Tăng số lượng"
            >
              <Plus size={13} />
            </button>
          </div>

          <p className="font-bold text-plant-text text-[15px] tabular-nums">
            {formatCurrency(item.lineTotal)}
          </p>
        </div>
      </div>
    </div>
  );
}

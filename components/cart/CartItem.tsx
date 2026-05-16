"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
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
    <div className={`flex gap-4 py-5 border-b border-plant-border last:border-0 ${isLoading ? "opacity-50" : ""}`}>
      {/* Product image */}
      <Link href={`/products/${item.productSlug}`} className="shrink-0">
        <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-plant-surface border border-plant-border">
          {item.productImageUrl ? (
            <Image
              src={item.productImageUrl}
              alt={item.productName}
              fill
              className="object-cover"
              sizes="80px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-2xl">🌿</div>
          )}
        </div>
      </Link>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <Link
          href={`/products/${item.productSlug}`}
          className="font-medium text-plant-text text-sm hover:text-plant-primary transition-colors line-clamp-2"
        >
          {item.productName}
        </Link>
        <p className="text-plant-primary font-semibold text-sm mt-1">
          {formatCurrency(item.priceSnapshot)}
        </p>

        {/* Quantity controls */}
        <div className="flex items-center gap-2 mt-2">
          <div className="flex items-center border border-plant-border rounded-lg overflow-hidden">
            <button
              onClick={() => onUpdateQty(item.id, item.quantity - 1)}
              disabled={item.quantity <= 1 || isLoading}
              className="w-8 h-8 flex items-center justify-center hover:bg-plant-surface text-plant-text disabled:opacity-40 transition-colors"
            >
              <Minus size={14} />
            </button>
            <span className="w-10 text-center text-sm font-semibold text-plant-text">
              {item.quantity}
            </span>
            <button
              onClick={() => onUpdateQty(item.id, item.quantity + 1)}
              disabled={item.quantity >= item.currentStock || isLoading}
              className="w-8 h-8 flex items-center justify-center hover:bg-plant-surface text-plant-text disabled:opacity-40 transition-colors"
            >
              <Plus size={14} />
            </button>
          </div>
          <button
            onClick={() => onRemove(item.id)}
            disabled={isLoading}
            className="ml-2 p-2 text-plant-muted hover:text-red-500 transition-colors disabled:opacity-40"
            aria-label="Xoá sản phẩm"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Line total */}
      <div className="text-right shrink-0">
        <p className="font-bold text-plant-text">{formatCurrency(item.lineTotal)}</p>
      </div>
    </div>
  );
}

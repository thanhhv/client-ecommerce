"use client";

import Link from "next/link";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/lib/hooks/useCart";
import CartItem from "@/components/cart/CartItem";
import CartSummary from "@/components/cart/CartSummary";
import { Skeleton } from "@/components/ui/skeleton";

function CartSkeleton() {
  return (
    <div className="divide-y divide-plant-border/60">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex gap-5 py-6">
          <Skeleton className="w-24 h-24 rounded-xl shrink-0" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-3 w-1/3" />
            <div className="flex items-center justify-between mt-4">
              <Skeleton className="h-9 w-28 rounded-xl" />
              <Skeleton className="h-5 w-20" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function CartPage() {
  const { query, updateItem, removeItem } = useCart();

  const beCart = query.data;

  if (query.isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Skeleton className="h-9 w-64 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
          <div className="bg-white rounded-2xl border border-plant-border/60 shadow-sm px-6">
            <CartSkeleton />
          </div>
          <Skeleton className="h-80 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (query.isError || !beCart) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center">
        <p className="text-plant-muted mb-4">Không thể tải giỏ hàng. Vui lòng thử lại.</p>
        <button onClick={() => query.refetch()} className="text-plant-primary underline text-sm font-medium">
          Thử lại
        </button>
      </div>
    );
  }

  if (beCart.items.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-24 text-center">
        <div className="w-20 h-20 rounded-2xl bg-plant-surface flex items-center justify-center mx-auto mb-6 ring-1 ring-plant-border/60">
          <ShoppingBag size={36} className="text-plant-border" />
        </div>
        <h1 className="font-playfair text-2xl font-bold text-plant-text mb-2">Giỏ hàng trống</h1>
        <p className="text-plant-muted mb-8">Bạn chưa có sản phẩm nào trong giỏ hàng.</p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 bg-plant-primary hover:bg-plant-primary-light text-white font-semibold px-8 py-3 rounded-xl transition-all shadow-sm hover:shadow-md"
        >
          Khám phá sản phẩm <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex items-baseline gap-3 mb-8">
        <h1 className="font-playfair text-3xl font-bold text-plant-text">Giỏ hàng</h1>
        <span className="text-plant-muted text-[15px]">{beCart.itemCount} sản phẩm</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-start">
        {/* Items card */}
        <div className="bg-white rounded-2xl border border-plant-border/60 shadow-sm px-6 divide-y divide-plant-border/50">
          {beCart.items.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              onUpdateQty={(itemId, qty) => updateItem.mutate({ itemId, quantity: qty })}
              onRemove={(itemId) => removeItem.mutate(itemId)}
              isLoading={
                (updateItem.isPending && (updateItem.variables as { itemId: string; quantity: number } | undefined)?.itemId === item.id) ||
                (removeItem.isPending && (removeItem.variables as string | undefined) === item.id)
              }
            />
          ))}
        </div>

        {/* Summary sticky */}
        <div className="lg:sticky lg:top-24">
          <CartSummary subtotal={beCart.subtotal} />
        </div>
      </div>
    </div>
  );
}

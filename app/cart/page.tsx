"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/hooks/useCart";
import { useCartStore } from "@/lib/stores/cartStore";
import CartItem from "@/components/cart/CartItem";
import CartSummary from "@/components/cart/CartSummary";
import { Skeleton } from "@/components/ui/skeleton";

function CartSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex gap-4 py-5 border-b border-plant-border">
          <Skeleton className="w-20 h-20 rounded-xl" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-8 w-28 mt-2" />
          </div>
          <Skeleton className="h-5 w-20" />
        </div>
      ))}
    </div>
  );
}

export default function CartPage() {
  const { query, updateItem, removeItem } = useCart();
  const { clear: clearLocalCart } = useCartStore();

  const beCart = query.data;

  // Sync local store from BE cart so CartDrawer badge stays accurate
  useEffect(() => {
    if (beCart) {
      useCartStore.setState({
        items: beCart.items.map((item) => ({
          productId: item.productId,
          name: item.productName,
          imageUrl: item.productImageUrl ?? "",
          price: item.priceSnapshot,
          quantity: item.quantity,
        })),
      });
    }
  }, [beCart]);

  if (query.isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="font-playfair text-3xl font-bold text-plant-text mb-8">Giỏ hàng</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <CartSkeleton />
          </div>
          <Skeleton className="h-64 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (query.isError || !beCart) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-plant-muted mb-4">Không thể tải giỏ hàng. Vui lòng thử lại.</p>
        <button
          onClick={() => query.refetch()}
          className="text-plant-primary underline"
        >
          Thử lại
        </button>
      </div>
    );
  }

  if (beCart.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <ShoppingBag size={64} className="mx-auto text-plant-border mb-4" />
        <h1 className="font-playfair text-2xl font-bold text-plant-text mb-2">Giỏ hàng trống</h1>
        <p className="text-plant-muted mb-6">Hãy thêm sản phẩm vào giỏ hàng nhé!</p>
        <Link
          href="/products"
          className="inline-block bg-plant-primary hover:bg-plant-primary-light text-white font-semibold px-8 py-3 rounded-xl transition-colors"
        >
          Khám phá sản phẩm
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="font-playfair text-3xl font-bold text-plant-text mb-8">
        Giỏ hàng ({beCart.itemCount} sản phẩm)
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart items */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-plant-border px-6">
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

        {/* Order summary (sticky on desktop) */}
        <div className="lg:sticky lg:top-24 self-start">
          <CartSummary subtotal={beCart.subtotal} />
        </div>
      </div>
    </div>
  );
}

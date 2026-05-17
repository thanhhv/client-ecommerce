"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useCartStore } from "@/lib/stores/cartStore";
import { useCart } from "@/lib/hooks/useCart";
import { useAuthStore } from "@/lib/stores/authStore";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { Minus, Plus, X, ShoppingBag, Truck, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { BeCartItem } from "@/lib/types/cart";

const FREE_SHIPPING_THRESHOLD = 500_000;
const SHIPPING_FEE = 30_000;

export default function CartDrawer() {
  const { drawerOpen, setDrawerOpen, items: localItems, updateQty: localUpdateQty, removeItem: localRemove, subtotal: localSubtotal, itemCount: localItemCount } =
    useCartStore();
  const user = useAuthStore((s) => s.user);
  const { query, updateItem, removeItem } = useCart();

  // For logged-in users prefer BE cart; fall back to local store when BE is
  // loading/refetching (e.g. right after add-to-cart invalidates the cache)
  const isLoggedIn = !!user;
  const beCart = isLoggedIn && !query.isFetching ? query.data ?? null : null;

  const localAsBe: BeCartItem[] = localItems.map((i) => ({
    id: i.productId,
    productId: i.productId,
    productName: i.name,
    productSlug: "",
    productImageUrl: i.imageUrl || null,
    quantity: i.quantity,
    priceSnapshot: i.price,
    lineTotal: i.price * i.quantity,
    currentStock: 9999,
  }));

  const items: BeCartItem[] = beCart ? beCart.items : localAsBe;
  const sub = beCart ? beCart.subtotal : localSubtotal();
  const count = beCart ? beCart.itemCount : localItemCount();

  function handleUpdateQty(item: BeCartItem, newQty: number) {
    if (newQty <= 0) return handleRemove(item);
    if (isLoggedIn) {
      updateItem.mutate(
        { itemId: item.id, quantity: newQty },
        {
          onSuccess: () => {
            // Keep local store in sync for badge
            localUpdateQty(item.productId, newQty);
          },
        },
      );
    } else {
      localUpdateQty(item.productId, newQty);
    }
  }

  function handleRemove(item: BeCartItem) {
    if (isLoggedIn) {
      removeItem.mutate(item.id, {
        onSuccess: () => {
          localRemove(item.productId);
        },
      });
    } else {
      localRemove(item.productId);
    }
  }

  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - sub);
  const progress = Math.min(100, (sub / FREE_SHIPPING_THRESHOLD) * 100);
  const isFreeShipping = sub >= FREE_SHIPPING_THRESHOLD;
  const shippingFee = isFreeShipping ? 0 : SHIPPING_FEE;
  const total = sub + shippingFee;

  return (
    <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
      <SheetContent className="w-full sm:max-w-[400px] flex flex-col p-0 gap-0">
        {/* Header */}
        <SheetHeader className="px-5 py-4 border-b border-plant-border/60">
          <SheetTitle className="font-playfair text-plant-text text-lg flex items-center gap-2">
            <ShoppingBag size={18} className="text-plant-primary" />
            Giỏ hàng
            <span className="ml-1 text-sm font-normal text-plant-muted bg-plant-surface rounded-full px-2 py-0.5">
              {count} sản phẩm
            </span>
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4 px-6 text-center">
            <div className="w-20 h-20 rounded-full bg-plant-surface flex items-center justify-center">
              <ShoppingBag size={32} className="text-plant-muted" />
            </div>
            <div>
              <p className="font-semibold text-plant-text mb-1">Giỏ hàng trống</p>
              <p className="text-sm text-plant-muted">Thêm sản phẩm để bắt đầu mua sắm</p>
            </div>
            <button
              onClick={() => setDrawerOpen(false)}
              className="mt-2 px-6 py-2.5 bg-plant-primary text-white rounded-xl text-sm font-medium hover:bg-plant-primary-light transition-colors"
            >
              Xem sản phẩm
            </button>
          </div>
        ) : (
          <>
            {/* Items list */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {items.map((item) => {
                const isMutating =
                  (updateItem.isPending && (updateItem.variables as { itemId: string } | undefined)?.itemId === item.id) ||
                  (removeItem.isPending && (removeItem.variables as string | undefined) === item.id);

                return (
                  <div key={item.id} className={`flex gap-3 ${isMutating ? "opacity-50 pointer-events-none" : ""}`}>
                    {/* Image */}
                    <div className="relative w-[72px] h-[72px] rounded-xl overflow-hidden flex-shrink-0 bg-plant-surface ring-1 ring-plant-border/60">
                      {item.productImageUrl ? (
                        <Image
                          src={item.productImageUrl}
                          alt={item.productName}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-plant-muted">
                          <ShoppingBag size={20} />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium text-plant-text line-clamp-2 leading-snug">
                          {item.productName}
                        </p>
                        <button
                          onClick={() => handleRemove(item)}
                          className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-plant-muted hover:text-red-500 hover:bg-red-50 transition-colors mt-0.5"
                          aria-label="Xóa"
                        >
                          {isMutating ? <Loader2 size={10} className="animate-spin" /> : <X size={12} />}
                        </button>
                      </div>

                      <p className="text-xs text-plant-muted mt-0.5">
                        {formatCurrency(item.priceSnapshot)} / sản phẩm
                      </p>

                      <div className="flex items-center justify-between mt-2">
                        {/* Qty stepper */}
                        <div className="flex items-center bg-plant-surface rounded-lg p-0.5 gap-0.5">
                          <button
                            onClick={() => handleUpdateQty(item, item.quantity - 1)}
                            className="w-7 h-7 rounded-md flex items-center justify-center text-plant-muted hover:bg-white hover:text-plant-text hover:shadow-sm transition-all"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="w-8 text-center text-sm font-semibold text-plant-text tabular-nums select-none">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleUpdateQty(item, item.quantity + 1)}
                            className="w-7 h-7 rounded-md flex items-center justify-center text-plant-muted hover:bg-white hover:text-plant-text hover:shadow-sm transition-all"
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        {/* Line total */}
                        <span className="text-sm font-semibold text-plant-primary tabular-nums">
                          {formatCurrency(item.lineTotal)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="border-t border-plant-border/60 bg-white px-5 pt-4 pb-5 space-y-4">
              {/* Free shipping progress */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1 text-plant-muted">
                    <Truck size={12} />
                    {isFreeShipping
                      ? "Bạn được miễn phí vận chuyển!"
                      : `Mua thêm ${formatCurrency(remaining)} để miễn phí vận chuyển`}
                  </span>
                  {isFreeShipping && (
                    <span className="text-plant-primary font-medium">Miễn phí</span>
                  )}
                </div>
                <div className="h-1.5 rounded-full bg-plant-surface overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-plant-primary to-plant-primary-light transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Price breakdown */}
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-plant-muted">
                  <span>Tạm tính</span>
                  <span className="tabular-nums">{formatCurrency(sub)}</span>
                </div>
                <div className="flex justify-between text-plant-muted">
                  <span>Phí vận chuyển</span>
                  <span className={`tabular-nums ${isFreeShipping ? "text-plant-primary font-medium" : ""}`}>
                    {isFreeShipping ? "Miễn phí" : formatCurrency(shippingFee)}
                  </span>
                </div>
                <div className="flex justify-between font-semibold text-plant-text pt-1 border-t border-plant-border/40">
                  <span>Tổng cộng</span>
                  <span className="tabular-nums text-plant-primary">{formatCurrency(total)}</span>
                </div>
              </div>

              {/* CTAs */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  href="/cart"
                  onClick={() => setDrawerOpen(false)}
                  className="text-center border border-plant-border text-plant-text py-2.5 rounded-xl text-sm font-medium hover:border-plant-primary hover:text-plant-primary transition-colors"
                >
                  Xem giỏ hàng
                </Link>
                <Link
                  href="/checkout"
                  onClick={() => setDrawerOpen(false)}
                  className="text-center bg-plant-primary text-white py-2.5 rounded-xl text-sm font-semibold hover:bg-plant-primary-light transition-colors shadow-sm"
                >
                  Thanh toán
                </Link>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

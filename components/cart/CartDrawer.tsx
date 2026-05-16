"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useCartStore } from "@/lib/stores/cartStore";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { Minus, Plus, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import EmptyState from "@/components/shared/EmptyState";

export default function CartDrawer() {
  const { items, drawerOpen, setDrawerOpen, removeItem, updateQty, itemCount, subtotal } =
    useCartStore();

  return (
    <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader>
          <SheetTitle className="font-playfair text-plant-text">
            Giỏ hàng ({itemCount()})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <EmptyState
              title="Giỏ hàng trống"
              description="Hãy thêm sản phẩm vào giỏ hàng"
              action={{ label: "Xem sản phẩm", onClick: () => setDrawerOpen(false) }}
            />
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              {items.map((item) => (
                <div key={item.productId} className="flex gap-3">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
                    {item.imageUrl && (
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-plant-text truncate">
                      {item.name}
                    </p>
                    <p className="text-sm text-plant-primary font-semibold">
                      {formatCurrency(item.price)}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <button
                        onClick={() => updateQty(item.productId, item.quantity - 1)}
                        className="w-6 h-6 rounded-full border border-plant-border flex items-center justify-center hover:bg-gray-50"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="text-sm w-6 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQty(item.productId, item.quantity + 1)}
                        className="w-6 h-6 rounded-full border border-plant-border flex items-center justify-center hover:bg-gray-50"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="text-plant-muted hover:text-plant-text flex-shrink-0"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>

            <div className="border-t border-plant-border pt-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-plant-muted">Tạm tính</span>
                <span className="font-semibold text-plant-text">
                  {formatCurrency(subtotal())}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/cart"
                  onClick={() => setDrawerOpen(false)}
                  className="text-center border border-plant-primary text-plant-primary py-2 rounded-lg text-sm font-medium hover:bg-green-50 transition-colors"
                >
                  Xem giỏ hàng
                </Link>
                <Link
                  href="/checkout"
                  onClick={() => setDrawerOpen(false)}
                  className="text-center bg-plant-primary text-white py-2 rounded-lg text-sm font-medium hover:bg-plant-primary-light transition-colors"
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

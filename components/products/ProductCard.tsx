"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/lib/stores/cartStore";
import PriceDisplay from "@/components/shared/PriceDisplay";
import StockBadge from "@/components/shared/StockBadge";
import type { ProductSummary } from "@/lib/types/product";

interface ProductCardProps {
  product: ProductSummary;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem, setDrawerOpen } = useCartStore();

  function handleAddToCart() {
    addItem({
      productId: product.id,
      name: product.name,
      imageUrl: product.primaryImageUrl ?? "",
      price: product.salePrice ?? product.basePrice,
      quantity: 1,
    });
    setDrawerOpen(true);
  }

  return (
    <div className="bg-white rounded-2xl border border-plant-border shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden group flex flex-col">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-plant-surface">
          {product.primaryImageUrl ? (
            <Image
              src={product.primaryImageUrl}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-5xl">
              🌿
            </div>
          )}
        </div>
      </Link>

      <div className="p-4 flex flex-col gap-2 flex-1">
        <Link href={`/products/${product.slug}`} className="flex-1">
          <p className="text-sm text-plant-muted line-clamp-1">
            {product.brand ?? "Cây Xanh"}
          </p>
          <h3 className="font-medium text-plant-text text-sm line-clamp-2 mt-0.5 leading-snug">
            {product.name}
          </h3>
        </Link>

        <PriceDisplay
          basePrice={product.basePrice}
          salePrice={product.salePrice ?? undefined}
        />
        <StockBadge stock={product.stock} />

        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="mt-auto w-full flex items-center justify-center gap-2 bg-plant-primary hover:bg-plant-primary-light text-white text-sm font-medium py-2 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ShoppingCart size={16} />
          {product.stock === 0 ? "Hết hàng" : "Thêm vào giỏ"}
        </button>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Heart } from "lucide-react";
import { useAddToCart } from "@/lib/hooks/useAddToCart";
import PriceDisplay from "@/components/shared/PriceDisplay";
import StockBadge from "@/components/shared/StockBadge";
import type { ProductSummary } from "@/lib/types/product";

interface ProductCardProps {
  product: ProductSummary;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addToCart = useAddToCart();
  const [added, setAdded] = useState(false);

  function handleAddToCart() {
    addToCart({
      productId: product.id,
      name: product.name,
      imageUrl: product.primaryImageUrl ?? "",
      price: product.salePrice ?? product.basePrice,
      quantity: 1,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div className="bg-white rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group flex flex-col hover:-translate-y-1">
      <Link href={`/products/${product.slug}`} className="block relative">
        <div className="relative aspect-square overflow-hidden bg-plant-surface rounded-t-3xl">
          {product.primaryImageUrl ? (
            <Image
              src={product.primaryImageUrl}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-plant-surface to-[#e8f5e3]">
              <span className="text-5xl opacity-40">🌿</span>
            </div>
          )}
        </div>
        {/* Wishlist button overlay */}
        <button
          onClick={(e) => e.preventDefault()}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white shadow-sm"
          aria-label="Yêu thích"
        >
          <Heart size={14} className="text-plant-muted" />
        </button>
        {/* Sale badge */}
        {product.salePrice && product.salePrice < product.basePrice && (
          <div className="absolute top-3 left-3 bg-plant-accent text-white text-xs font-semibold px-2.5 py-1 rounded-full">
            Sale
          </div>
        )}
      </Link>

      <div className="p-4 flex flex-col gap-2.5 flex-1">
        <Link href={`/products/${product.slug}`} className="flex-1">
          <p className="text-xs text-plant-muted uppercase tracking-wide font-medium">
            {product.brand ?? "Thế giới cây xanh"}
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
          disabled={product.stock === 0 || added}
          className={`mt-1 w-full flex items-center justify-center gap-2 text-white text-sm font-medium py-2.5 rounded-full transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5 active:translate-y-0 ${added ? 'bg-green-600' : 'bg-plant-primary hover:bg-plant-primary-light'}`}
        >
          {added ? '✓ Đã thêm' : (
            <><ShoppingCart size={15} />{product.stock === 0 ? "Hết hàng" : "Thêm vào giỏ"}</>
          )}
        </button>
      </div>
    </div>
  );
}

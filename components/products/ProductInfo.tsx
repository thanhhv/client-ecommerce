"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, Zap } from "lucide-react";
import { useCartStore } from "@/lib/stores/cartStore";
import PriceDisplay from "@/components/shared/PriceDisplay";
import StockBadge from "@/components/shared/StockBadge";
import BreadCrumb from "@/components/shared/BreadCrumb";
import type { ProductDetail } from "@/lib/types/product";

interface ProductInfoProps {
  product: ProductDetail;
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const router = useRouter();
  const { addItem, setDrawerOpen } = useCartStore();
  const [qty, setQty] = useState(1);

  const primaryImage = product.images.find((img) => img.isPrimary) ?? product.images[0];

  function handleAddToCart() {
    addItem({
      productId: product.id,
      name: product.name,
      imageUrl: primaryImage?.url ?? "",
      price: product.salePrice ?? product.basePrice,
      quantity: qty,
    });
    setDrawerOpen(true);
  }

  function handleBuyNow() {
    addItem({
      productId: product.id,
      name: product.name,
      imageUrl: primaryImage?.url ?? "",
      price: product.salePrice ?? product.basePrice,
      quantity: qty,
    });
    router.push("/checkout");
  }

  return (
    <div className="flex flex-col gap-4">
      <BreadCrumb
        items={[
          { label: "Trang chủ", href: "/" },
          { label: "Sản phẩm", href: "/products" },
          { label: product.name },
        ]}
      />

      {product.brand && (
        <p className="text-sm text-plant-muted font-medium uppercase tracking-wide">
          {product.brand}
        </p>
      )}

      <h1 className="font-playfair text-2xl md:text-3xl font-bold text-plant-text leading-tight">
        {product.name}
      </h1>

      <PriceDisplay
        basePrice={product.basePrice}
        salePrice={product.salePrice ?? undefined}
        className="text-xl"
      />

      <StockBadge stock={product.stock} />

      {product.description && (
        <p className="text-plant-muted text-sm leading-relaxed line-clamp-3">
          {product.description}
        </p>
      )}

      {/* Quantity selector */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-plant-text">Số lượng:</span>
        <div className="flex items-center border border-plant-border rounded-xl overflow-hidden">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="w-10 h-10 flex items-center justify-center hover:bg-plant-surface transition-colors text-plant-text disabled:opacity-40"
            disabled={qty <= 1}
          >
            −
          </button>
          <span className="w-12 text-center text-sm font-semibold text-plant-text">{qty}</span>
          <button
            onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
            className="w-10 h-10 flex items-center justify-center hover:bg-plant-surface transition-colors text-plant-text disabled:opacity-40"
            disabled={qty >= product.stock}
          >
            +
          </button>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className="flex-1 flex items-center justify-center gap-2 bg-plant-primary hover:bg-plant-primary-light text-white font-semibold py-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ShoppingCart size={18} />
          Thêm vào giỏ hàng
        </button>
        <button
          onClick={handleBuyNow}
          disabled={product.stock === 0}
          className="flex-1 flex items-center justify-center gap-2 border-2 border-plant-primary text-plant-primary hover:bg-green-50 font-semibold py-3 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Zap size={18} />
          Mua ngay
        </button>
      </div>

      {/* Trust icons */}
      <div className="grid grid-cols-3 gap-3 pt-2 border-t border-plant-border">
        {[
          { emoji: "🌿", text: "Cây tươi đảm bảo" },
          { emoji: "🚚", text: "Giao toàn quốc" },
          { emoji: "↩️", text: "Đổi trả 7 ngày" },
        ].map((item) => (
          <div key={item.text} className="flex flex-col items-center gap-1 text-center">
            <span className="text-xl">{item.emoji}</span>
            <span className="text-xs text-plant-muted">{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

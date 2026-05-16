"use client";

import { useState } from "react";
import Image from "next/image";
import type { ProductImage } from "@/lib/types/product";

interface ProductImageGalleryProps {
  images: ProductImage[];
  productName: string;
}

export default function ProductImageGallery({ images, productName }: ProductImageGalleryProps) {
  const sorted = [...images].sort((a, b) => a.sortOrder - b.sortOrder);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = sorted[activeIndex];

  if (sorted.length === 0) {
    return (
      <div className="aspect-square rounded-2xl bg-plant-surface flex items-center justify-center text-8xl">
        🌿
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Main image */}
      <div className="relative aspect-square rounded-2xl overflow-hidden bg-plant-surface group cursor-zoom-in">
        <Image
          src={activeImage.url}
          alt={productName}
          fill
          priority
          className="object-cover group-hover:scale-110 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>

      {/* Thumbnails */}
      {sorted.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 scroll-snap-x">
          {sorted.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setActiveIndex(i)}
              className={`relative w-16 h-16 shrink-0 rounded-lg overflow-hidden border-2 transition-colors ${
                i === activeIndex
                  ? "border-plant-primary"
                  : "border-plant-border hover:border-plant-primary/50"
              }`}
            >
              <Image
                src={img.url}
                alt={`${productName} ${i + 1}`}
                fill
                className="object-cover"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

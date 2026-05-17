"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { ProductImage } from "@/lib/types/product";

interface ProductImageGalleryProps {
  images: ProductImage[];
  productName: string;
}

export default function ProductImageGallery({
  images,
  productName,
}: ProductImageGalleryProps) {
  const sorted = [...images].sort((a, b) => a.sortOrder - b.sortOrder);
  const [activeIndex, setActiveIndex] = useState(0);
  const thumbnailRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const touchStartX = useRef<number | null>(null);

  const goTo = useCallback(
    (index: number) => {
      const clamped = (index + sorted.length) % sorted.length;
      setActiveIndex(clamped);
    },
    [sorted.length],
  );

  const prev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);
  const next = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);

  // Scroll active thumbnail into view
  useEffect(() => {
    thumbnailRefs.current[activeIndex]?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "nearest",
    });
  }, [activeIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [prev, next]);

  if (sorted.length === 0) {
    return (
      <div className="aspect-square rounded-2xl bg-plant-surface flex items-center justify-center text-8xl">
        🌿
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* ── Main image ─────────────────────────────────────── */}
      <div
        className="relative aspect-square rounded-2xl overflow-hidden bg-plant-surface group select-none"
        onTouchStart={(e) => {
          touchStartX.current = e.touches[0].clientX;
        }}
        onTouchEnd={(e) => {
          if (touchStartX.current === null) return;
          const delta = e.changedTouches[0].clientX - touchStartX.current;
          if (Math.abs(delta) > 40) delta < 0 ? next() : prev();
          touchStartX.current = null;
        }}
      >
        {/* Stacked images — fade via opacity */}
        {sorted.map((img, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={img.id}
            src={img.url}
            alt={`${productName} ${i + 1}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-400 ${
              i === activeIndex
                ? "opacity-100 z-10"
                : "opacity-0 z-0 pointer-events-none"
            }`}
          />
        ))}

        {sorted.length > 1 && (
          <>
            {/* Prev arrow */}
            <button
              onClick={prev}
              aria-label="Ảnh trước"
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-white hover:scale-110 active:scale-95"
            >
              <ChevronLeft size={18} className="text-plant-text" />
            </button>

            {/* Next arrow */}
            <button
              onClick={next}
              aria-label="Ảnh sau"
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-white hover:scale-110 active:scale-95"
            >
              <ChevronRight size={18} className="text-plant-text" />
            </button>

            {/* Counter badge */}
            <div className="absolute top-3 right-3 z-20 px-2 py-0.5 rounded-full bg-black/40 text-white text-xs font-medium backdrop-blur-sm tabular-nums select-none">
              {activeIndex + 1} / {sorted.length}
            </div>

            {/* Dot indicators */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5">
              {sorted.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  aria-label={`Xem ảnh ${i + 1}`}
                  className={`rounded-full transition-all duration-300 ${
                    i === activeIndex
                      ? "w-5 h-[6px] bg-white shadow"
                      : "w-[6px] h-[6px] bg-white/50 hover:bg-white/80"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* ── Thumbnail strip ────────────────────────────────── */}
      {sorted.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide scroll-smooth">
          {sorted.map((img, i) => (
            <button
              key={img.id}
              ref={(el) => { thumbnailRefs.current[i] = el; }}
              onClick={() => goTo(i)}
              aria-label={`Xem ảnh ${i + 1}`}
              className={`relative flex-shrink-0 w-[72px] h-[72px] rounded-xl overflow-hidden transition-all duration-200 ${
                i === activeIndex
                  ? "ring-2 ring-plant-primary ring-offset-1 opacity-100 scale-105"
                  : "ring-1 ring-plant-border opacity-60 hover:opacity-90 hover:scale-[1.03]"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.url}
                alt={`${productName} ${i + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

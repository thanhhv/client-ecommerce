"use client";

import { useState, useEffect, useRef } from "react";
import type { Category } from "@/lib/types/product";
import type { ProductFilter } from "@/lib/hooks/useProducts";

interface ProductFiltersProps {
  filter: ProductFilter;
  categories: Category[];
  onFilterChange: (updates: Partial<ProductFilter>) => void;
}

export default function ProductFilters({
  filter,
  categories,
  onFilterChange,
}: ProductFiltersProps) {
  // Local price state so inputs respond instantly while API call is debounced
  const [minInput, setMinInput] = useState(filter.minPrice?.toString() ?? "");
  const [maxInput, setMaxInput] = useState(filter.maxPrice?.toString() ?? "");
  const priceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Track last value sent to the API so we skip redundant calls
  const committedMin = useRef<number | undefined>(filter.minPrice);
  const committedMax = useRef<number | undefined>(filter.maxPrice);

  // Sync back when filters are cleared externally (e.g. "Clear all")
  useEffect(() => {
    setMinInput(filter.minPrice?.toString() ?? "");
    committedMin.current = filter.minPrice;
  }, [filter.minPrice]);

  useEffect(() => {
    setMaxInput(filter.maxPrice?.toString() ?? "");
    committedMax.current = filter.maxPrice;
  }, [filter.maxPrice]);

  function handlePriceInput(field: "minPrice" | "maxPrice", raw: string) {
    if (field === "minPrice") setMinInput(raw);
    else setMaxInput(raw);

    if (priceTimer.current) clearTimeout(priceTimer.current);
    priceTimer.current = setTimeout(() => {
      const parsed = raw !== "" ? Number(raw) : NaN;
      // Skip if the string isn't a valid, non-negative integer
      if (raw !== "" && (!Number.isFinite(parsed) || parsed < 0)) return;
      const next = raw !== "" && parsed > 0 ? parsed : undefined;
      const prev = field === "minPrice" ? committedMin.current : committedMax.current;
      // Skip if the resolved value hasn't actually changed
      if (next === prev) return;
      if (field === "minPrice") committedMin.current = next;
      else committedMax.current = next;
      onFilterChange({ [field]: next, page: 1 });
    }, 200);
  }

  return (
    <div className="space-y-6">
      {/* Category */}
      <div>
        <h3 className="font-semibold text-plant-text text-sm mb-3">Danh mục</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="radio"
              name="category"
              checked={!filter.categoryId}
              onChange={() => onFilterChange({ categoryId: undefined, page: 1 })}
              className="accent-[#3a6b35]"
            />
            <span className="text-sm text-plant-text group-hover:text-plant-primary transition-colors">
              Tất cả
            </span>
          </label>
          {categories.map((cat) => (
            <label key={cat.id} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="category"
                value={cat.id}
                checked={filter.categoryId === cat.id}
                onChange={() =>
                  onFilterChange({
                    categoryId: filter.categoryId === cat.id ? undefined : cat.id,
                    page: 1,
                  })
                }
                className="accent-[#3a6b35]"
              />
              <span className="text-sm text-plant-text group-hover:text-plant-primary transition-colors">
                {cat.name}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price range */}
      <div>
        <h3 className="font-semibold text-plant-text text-sm mb-3">Khoảng giá (₫)</h3>
        <div className="flex gap-2 items-center">
          <input
            type="number"
            placeholder="Từ"
            value={minInput}
            min={0}
            onChange={(e) => handlePriceInput("minPrice", e.target.value)}
            className="w-full border border-plant-border rounded-lg px-3 py-2 text-sm text-plant-text focus:outline-none focus:ring-2 focus:ring-plant-primary/40 focus:border-plant-primary/60"
          />
          <span className="text-plant-muted text-sm shrink-0">—</span>
          <input
            type="number"
            placeholder="Đến"
            value={maxInput}
            min={0}
            onChange={(e) => handlePriceInput("maxPrice", e.target.value)}
            className="w-full border border-plant-border rounded-lg px-3 py-2 text-sm text-plant-text focus:outline-none focus:ring-2 focus:ring-plant-primary/40 focus:border-plant-primary/60"
          />
        </div>
        {/* Quick preset chips */}
        <div className="flex flex-wrap gap-1.5 mt-2">
          {[
            { label: "< 100k", min: undefined, max: 100_000 },
            { label: "100–300k", min: 100_000, max: 300_000 },
            { label: "300–500k", min: 300_000, max: 500_000 },
            { label: "> 500k", min: 500_000, max: undefined },
          ].map((preset) => {
            const active =
              filter.minPrice === preset.min && filter.maxPrice === preset.max;
            return (
              <button
                key={preset.label}
                type="button"
                onClick={() => {
                  if (active) {
                    onFilterChange({ minPrice: undefined, maxPrice: undefined, page: 1 });
                  } else {
                    onFilterChange({ minPrice: preset.min, maxPrice: preset.max, page: 1 });
                  }
                }}
                className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                  active
                    ? "bg-plant-primary text-white border-plant-primary"
                    : "border-plant-border text-plant-muted hover:border-plant-primary hover:text-plant-primary"
                }`}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* In stock */}
      <div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={filter.inStock ?? false}
            onChange={(e) =>
              onFilterChange({ inStock: e.target.checked || undefined, page: 1 })
            }
            className="accent-[#3a6b35] w-4 h-4"
          />
          <span className="text-sm text-plant-text">Chỉ còn hàng</span>
        </label>
      </div>
    </div>
  );
}

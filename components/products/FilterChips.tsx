"use client";

import { X } from "lucide-react";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import type { Category } from "@/lib/types/product";

interface FilterChipsProps {
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  search?: string;
  categories: Category[];
  onRemove: (key: string) => void;
  onClearAll: () => void;
}

export default function FilterChips({
  categoryId,
  minPrice,
  maxPrice,
  inStock,
  search,
  categories,
  onRemove,
  onClearAll,
}: FilterChipsProps) {
  const chips: { key: string; label: string }[] = [];

  if (categoryId) {
    const cat = categories.find((c) => c.id === categoryId);
    if (cat) chips.push({ key: "categoryId", label: cat.name });
  }
  if (minPrice && minPrice > 0) chips.push({ key: "minPrice", label: `Từ ${formatCurrency(minPrice)}` });
  if (maxPrice && maxPrice > 0) chips.push({ key: "maxPrice", label: `Đến ${formatCurrency(maxPrice)}` });
  if (inStock) chips.push({ key: "inStock", label: "Còn hàng" });
  if (search) chips.push({ key: "search", label: `"${search}"` });

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <span
          key={chip.key}
          className="inline-flex items-center gap-1 bg-plant-primary/10 text-plant-primary text-xs font-medium px-2.5 py-1 rounded-full"
        >
          {chip.label}
          <button onClick={() => onRemove(chip.key)} className="hover:text-red-500 transition-colors">
            <X size={12} />
          </button>
        </span>
      ))}
      <button
        onClick={onClearAll}
        className="text-xs text-plant-muted hover:text-plant-text underline transition-colors"
      >
        Xoá tất cả
      </button>
    </div>
  );
}

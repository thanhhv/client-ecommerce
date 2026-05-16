"use client";

import type { Category } from "@/lib/types/product";
import type { ProductFilter } from "@/lib/hooks/useProducts";

interface ProductFiltersProps {
  filter: ProductFilter;
  categories: Category[];
  onFilterChange: (updates: Partial<ProductFilter>) => void;
}

export default function ProductFilters({ filter, categories, onFilterChange }: ProductFiltersProps) {
  return (
    <div className="space-y-6">
      {/* Category */}
      <div>
        <h3 className="font-semibold text-plant-text text-sm mb-3">Danh mục</h3>
        <div className="space-y-2">
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
        <h3 className="font-semibold text-plant-text text-sm mb-3">Khoảng giá</h3>
        <div className="flex gap-2 items-center">
          <input
            type="number"
            placeholder="Từ"
            value={filter.minPrice ?? ""}
            onChange={(e) =>
              onFilterChange({ minPrice: e.target.value ? Number(e.target.value) : undefined, page: 1 })
            }
            className="w-full border border-plant-border rounded-lg px-3 py-2 text-sm text-plant-text focus:outline-none focus:ring-2 focus:ring-plant-primary"
          />
          <span className="text-plant-muted text-sm shrink-0">—</span>
          <input
            type="number"
            placeholder="Đến"
            value={filter.maxPrice ?? ""}
            onChange={(e) =>
              onFilterChange({ maxPrice: e.target.value ? Number(e.target.value) : undefined, page: 1 })
            }
            className="w-full border border-plant-border rounded-lg px-3 py-2 text-sm text-plant-text focus:outline-none focus:ring-2 focus:ring-plant-primary"
          />
        </div>
      </div>

      {/* In stock */}
      <div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={filter.inStock ?? false}
            onChange={(e) => onFilterChange({ inStock: e.target.checked || undefined, page: 1 })}
            className="accent-[#3a6b35] w-4 h-4"
          />
          <span className="text-sm text-plant-text">Chỉ còn hàng</span>
        </label>
      </div>
    </div>
  );
}

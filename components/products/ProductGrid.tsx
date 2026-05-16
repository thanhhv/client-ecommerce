"use client";

import ProductCard from "./ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import EmptyState from "@/components/shared/EmptyState";
import type { ProductSummary } from "@/lib/types/product";

interface ProductGridProps {
  products: ProductSummary[];
  isLoading: boolean;
  onClearFilters: () => void;
}

function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-plant-border overflow-hidden">
      <Skeleton className="aspect-square w-full" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-8 w-full mt-2" />
      </div>
    </div>
  );
}

export default function ProductGrid({ products, isLoading, onClearFilters }: ProductGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="py-16">
        <EmptyState
          title="Không tìm thấy sản phẩm"
          description="Thử thay đổi bộ lọc hoặc từ khoá tìm kiếm"
          action={{ label: "Xoá bộ lọc", onClick: onClearFilters }}
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { SlidersHorizontal, Search, X } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useProducts } from "@/lib/hooks/useProducts";
import { useCategories } from "@/lib/hooks/useCategories";
import ProductGrid from "./ProductGrid";
import ProductFilters from "./ProductFilters";
import FilterChips from "./FilterChips";
import SortSelect from "./SortSelect";
import type { ProductFilter } from "@/lib/hooks/useProducts";

function parseFilter(searchParams: ReturnType<typeof useSearchParams>): ProductFilter {
  return {
    categoryId: searchParams.get("categoryId") ?? undefined,
    minPrice: searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined,
    maxPrice: searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined,
    inStock: searchParams.get("inStock") === "true" ? true : undefined,
    search: searchParams.get("search") ?? undefined,
    sort: (searchParams.get("sort") as ProductFilter["sort"]) ?? "newest",
    page: searchParams.get("page") ? Number(searchParams.get("page")) : 1,
  };
}

export default function ProductsContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const filter = parseFilter(searchParams);

  const { data, isLoading } = useProducts(filter);
  const { data: categories = [] } = useCategories();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(filter.search ?? "");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // sync search input when URL changes externally
  useEffect(() => {
    setSearchInput(filter.search ?? "");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.get("search")]);

  const updateURL = useCallback(
    (updates: Partial<ProductFilter>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value === undefined || value === null || value === "") {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      });
      if (!("page" in updates)) params.delete("page");
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [searchParams, router, pathname],
  );

  function handleSearchChange(value: string) {
    setSearchInput(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      updateURL({ search: value || undefined, page: 1 });
    }, 400);
  }

  function handleFilterChange(updates: Partial<ProductFilter>) {
    updateURL({ ...updates, page: 1 });
  }

  function handleRemoveFilter(key: string) {
    updateURL({ [key]: undefined, page: 1 });
    if (key === "search") setSearchInput("");
  }

  function handleClearAll() {
    router.push(pathname, { scroll: false });
    setSearchInput("");
  }

  const pagination = data?.pagination;
  const products = data?.data ?? [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Page title + search bar */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
        <h1 className="font-playfair text-3xl font-bold text-plant-text flex-1">Sản phẩm</h1>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-plant-muted" size={16} />
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchInput}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-plant-border rounded-xl text-sm text-plant-text placeholder:text-plant-muted focus:outline-none focus:ring-2 focus:ring-plant-primary bg-white"
          />
          {searchInput && (
            <button
              onClick={() => { setSearchInput(""); updateURL({ search: undefined, page: 1 }); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-plant-muted hover:text-plant-text"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Active filter chips */}
      <div className="mb-4">
        <FilterChips
          categoryId={filter.categoryId}
          minPrice={filter.minPrice}
          maxPrice={filter.maxPrice}
          inStock={filter.inStock}
          search={filter.search}
          categories={categories}
          onRemove={handleRemoveFilter}
          onClearAll={handleClearAll}
        />
      </div>

      <div className="flex gap-8">
        {/* Desktop sidebar */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-24 bg-white rounded-2xl border border-plant-border p-5">
            <h2 className="font-semibold text-plant-text mb-4">Bộ lọc</h2>
            <ProductFilters
              filter={filter}
              categories={categories}
              onFilterChange={handleFilterChange}
            />
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Sort + filter button row */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-plant-muted">
              {isLoading ? "Đang tải..." : `${pagination?.total ?? 0} sản phẩm`}
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setDrawerOpen(true)}
                className="lg:hidden flex items-center gap-2 border border-plant-border rounded-lg px-3 py-2 text-sm text-plant-text hover:bg-plant-surface transition-colors"
              >
                <SlidersHorizontal size={16} />
                Bộ lọc
              </button>
              <SortSelect
                value={filter.sort ?? "newest"}
                onChange={(v) => updateURL({ sort: v as ProductFilter["sort"], page: 1 })}
              />
            </div>
          </div>

          <ProductGrid
            products={products}
            isLoading={isLoading}
            onClearFilters={handleClearAll}
          />

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => { updateURL({ page: pagination.page - 1 }); if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" }); }}
                disabled={pagination.page <= 1}
                className="px-4 py-2 rounded-lg border border-plant-border text-sm text-plant-text hover:bg-plant-surface disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                ← Trước
              </button>
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                .filter((p) => Math.abs(p - pagination.page) <= 2)
                .map((p) => (
                  <button
                    key={p}
                    onClick={() => { updateURL({ page: p }); if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" }); }}
                    className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                      p === pagination.page
                        ? "bg-plant-primary text-white"
                        : "border border-plant-border text-plant-text hover:bg-plant-surface"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              <button
                onClick={() => { updateURL({ page: pagination.page + 1 }); if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" }); }}
                disabled={pagination.page >= pagination.totalPages}
                className="px-4 py-2 rounded-lg border border-plant-border text-sm text-plant-text hover:bg-plant-surface disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Tiếp →
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent side="left" className="w-80">
          <SheetHeader>
            <SheetTitle className="font-playfair text-plant-text">Bộ lọc</SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            <ProductFilters
              filter={filter}
              categories={categories}
              onFilterChange={(updates) => {
                handleFilterChange(updates);
                setDrawerOpen(false);
              }}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

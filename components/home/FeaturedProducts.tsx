import ProductCard from "@/components/products/ProductCard";
import type { ProductSummary } from "@/lib/types/product";
import Link from "next/link";

async function getFeaturedProducts(): Promise<ProductSummary[]> {
  try {
    const apiUrl = process.env.API_INTERNAL_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";
    const res = await fetch(
      `${apiUrl}/api/v1/products?sort=newest&limit=8`,
      { next: { revalidate: 300 } }
    );
    if (!res.ok) return [];
    const json = await res.json();
    return (json.data as ProductSummary[]) ?? [];
  } catch {
    return [];
  }
}

export default async function FeaturedProducts() {
  const products = await getFeaturedProducts();

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-plant-muted text-xs font-medium uppercase tracking-widest mb-1">Nổi bật</p>
            <h2 className="font-playfair text-3xl md:text-4xl font-bold text-plant-text">
              Bán chạy nhất
            </h2>
          </div>
          <Link
            href="/products"
            className="text-sm text-plant-primary hover:text-plant-primary-light font-medium transition-colors hidden sm:block"
          >
            Xem tất cả →
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20 text-plant-muted">
            <div className="w-16 h-16 rounded-full bg-plant-surface flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🌱</span>
            </div>
            <p className="font-medium">Sản phẩm đang được cập nhật...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

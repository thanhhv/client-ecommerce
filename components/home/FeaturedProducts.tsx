import ProductCard from "@/components/products/ProductCard";
import type { ProductSummary } from "@/lib/types/product";

async function getFeaturedProducts(): Promise<ProductSummary[]> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";
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
    <section className="bg-plant-surface py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-playfair text-3xl font-bold text-plant-text">
            Bán chạy nhất
          </h2>
          <a
            href="/products"
            className="text-sm text-plant-primary hover:text-plant-primary-light font-medium transition-colors"
          >
            Xem tất cả →
          </a>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-16 text-plant-muted">
            <div className="text-5xl mb-4">🌱</div>
            <p>Sản phẩm đang được cập nhật...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

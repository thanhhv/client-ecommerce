import ProductCard from "./ProductCard";
import type { ProductSummary } from "@/lib/types/product";

interface RelatedProductsProps {
  products: ProductSummary[];
}

export default function RelatedProducts({ products }: RelatedProductsProps) {
  if (products.length === 0) return null;

  return (
    <section>
      <h2 className="font-playfair text-2xl font-bold text-plant-text mb-6">
        Có thể bạn cũng thích
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

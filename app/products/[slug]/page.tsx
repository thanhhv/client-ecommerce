import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ProductImageGallery from "@/components/products/ProductImageGallery";
import ProductInfo from "@/components/products/ProductInfo";
import ProductDescription from "@/components/products/ProductDescription";
import RelatedProducts from "@/components/products/RelatedProducts";
import type { ProductDetail } from "@/lib/types/product";

async function getProduct(slug: string): Promise<ProductDetail | null> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";
    const res = await fetch(`${apiUrl}/api/v1/products/${slug}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data ?? null;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: "Sản phẩm không tìm thấy | Thế giới cây xanh" };
  const primaryImage = product.images.find((img) => img.isPrimary) ?? product.images[0];
  return {
    title: `${product.name} | Thế giới cây xanh`,
    description:
      product.description?.slice(0, 160) ??
      `Mua ${product.name} tại Thế giới cây xanh. Giao hàng toàn quốc, cây tươi đảm bảo.`,
    openGraph: {
      title: product.name,
      description: product.description ?? undefined,
      images: primaryImage ? [primaryImage.url] : [],
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description ?? undefined,
    brand: product.brand ? { "@type": "Brand", name: product.brand } : undefined,
    offers: {
      "@type": "Offer",
      price: product.salePrice ?? product.basePrice,
      priceCurrency: "VND",
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Product hero: 2-col on desktop, stacked on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 mb-12">
          <ProductImageGallery images={product.images} productName={product.name} />
          <ProductInfo product={product} />
        </div>

        {/* Below fold */}
        <div className="space-y-12">
          <ProductDescription description={product.description} />
          <RelatedProducts products={product.related} />
        </div>
      </div>
    </>
  );
}

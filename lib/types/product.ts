export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

export interface ProductSummary {
  id: string;
  name: string;
  slug: string;
  brand: string | null;
  categoryId: string;
  basePrice: number;
  salePrice: number | null;
  stock: number;
  primaryImageUrl: string | null;
}

export interface ProductImage {
  id: string;
  productId: string;
  url: string;
  isPrimary: boolean;
  sortOrder: number;
}

export interface ProductDetail {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  brand: string | null;
  categoryId: string;
  basePrice: number;
  salePrice: number | null;
  stock: number;
  isActive: boolean;
  images: ProductImage[];
  related: ProductSummary[];
  createdAt: string;
  updatedAt: string;
}

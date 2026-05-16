export interface BeCartItem {
  id: string;
  productId: string;
  productName: string;
  productSlug: string;
  productImageUrl: string | null;
  quantity: number;
  priceSnapshot: number;
  lineTotal: number;
  currentStock: number;
}

export interface BeCart {
  id: string;
  userId: string;
  items: BeCartItem[];
  subtotal: number;
  itemCount: number;
}

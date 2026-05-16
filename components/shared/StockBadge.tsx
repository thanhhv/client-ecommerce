import { cn } from "@/lib/utils/cn";

interface StockBadgeProps {
  stock: number;
  className?: string;
}

export default function StockBadge({ stock, className }: StockBadgeProps) {
  if (stock === 0) {
    return (
      <span
        className={cn(
          "text-xs font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded-full",
          className
        )}
      >
        Hết hàng
      </span>
    );
  }
  if (stock <= 5) {
    return (
      <span
        className={cn(
          "text-xs font-medium text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full",
          className
        )}
      >
        Chỉ còn {stock} sản phẩm
      </span>
    );
  }
  return (
    <span
      className={cn(
        "text-xs font-medium text-plant-primary bg-green-50 px-2 py-0.5 rounded-full",
        className
      )}
    >
      Còn hàng
    </span>
  );
}

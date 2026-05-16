import { formatCurrency } from "@/lib/utils/formatCurrency";
import { cn } from "@/lib/utils/cn";

interface PriceDisplayProps {
  basePrice: number;
  salePrice?: number;
  className?: string;
}

export default function PriceDisplay({
  basePrice,
  salePrice,
  className,
}: PriceDisplayProps) {
  const discount = salePrice
    ? Math.round((1 - salePrice / basePrice) * 100)
    : 0;

  return (
    <div className={cn("flex items-center gap-2 flex-wrap", className)}>
      {salePrice ? (
        <>
          <span className="text-plant-primary font-bold text-lg">
            {formatCurrency(salePrice)}
          </span>
          <span className="text-plant-muted line-through text-sm">
            {formatCurrency(basePrice)}
          </span>
          <span className="bg-plant-accent text-white text-xs px-1.5 py-0.5 rounded">
            -{discount}%
          </span>
        </>
      ) : (
        <span className="font-bold text-lg text-plant-text">
          {formatCurrency(basePrice)}
        </span>
      )}
    </div>
  );
}

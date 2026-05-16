import { cn } from "@/lib/utils/cn";

interface EmptyStateProps {
  title: string;
  description?: string;
  action?: { label: string; onClick: () => void };
  className?: string;
}

export default function EmptyState({
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-16 text-center",
        className
      )}
    >
      <div className="text-6xl mb-4">🌱</div>
      <h3 className="font-playfair text-xl font-semibold text-plant-text mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-plant-muted text-sm mb-6 max-w-xs">{description}</p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="bg-plant-primary text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-plant-primary-light transition-colors"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

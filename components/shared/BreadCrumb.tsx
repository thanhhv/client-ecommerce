import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface BreadCrumbItem {
  label: string;
  href?: string;
}

interface BreadCrumbProps {
  items: BreadCrumbItem[];
}

export default function BreadCrumb({ items }: BreadCrumbProps) {
  return (
    <nav className="flex items-center gap-1 text-sm text-plant-muted flex-wrap">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1">
          {i > 0 && <ChevronRight size={14} className="shrink-0" />}
          {item.href ? (
            <Link href={item.href} className="hover:text-plant-primary transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-plant-text font-medium line-clamp-1">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

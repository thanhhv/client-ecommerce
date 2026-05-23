import Link from "next/link";
import { categoriesApi } from "@/lib/api/categories";
import type { Category } from "@/lib/types/product";

// Visual styling mapped by index (cycled if more categories than entries)
const STYLES = [
  { gradient: "from-pink-500/20 to-rose-500/10", dot: "bg-pink-500" },
  { gradient: "from-emerald-500/20 to-teal-500/10", dot: "bg-emerald-500" },
  { gradient: "from-green-600/20 to-lime-500/10", dot: "bg-green-600" },
  { gradient: "from-amber-500/20 to-orange-500/10", dot: "bg-amber-500" },
  { gradient: "from-lime-500/20 to-green-400/10", dot: "bg-lime-500" },
  { gradient: "from-stone-400/20 to-amber-600/10", dot: "bg-stone-500" },
];

// Hardcoded fallback used when the API is unavailable or returns no data
const FALLBACK_CATEGORIES: Array<Category & { gradient: string; dot: string }> = [
  { id: "", name: "Hoa tươi", slug: "hoa", description: null, gradient: STYLES[0].gradient, dot: STYLES[0].dot },
  { id: "", name: "Cây trong nhà", slug: "indoor-plants", description: null, gradient: STYLES[1].gradient, dot: STYLES[1].dot },
  { id: "", name: "Cây ngoài trời", slug: "outdoor-plants", description: null, gradient: STYLES[2].gradient, dot: STYLES[2].dot },
  { id: "", name: "Dụng cụ vườn", slug: "dung-cu", description: null, gradient: STYLES[3].gradient, dot: STYLES[3].dot },
  { id: "", name: "Hạt giống", slug: "hat-giong", description: null, gradient: STYLES[4].gradient, dot: STYLES[4].dot },
  { id: "", name: "Chậu cây", slug: "chau-cay", description: null, gradient: STYLES[5].gradient, dot: STYLES[5].dot },
];

export default async function CategoryGrid() {
  let apiCategories: Category[] = [];
  try {
    const res = await categoriesApi.list();
    apiCategories = res.data.data ?? [];
  } catch {
    // API unavailable — fall through to hardcoded fallback
  }

  const categories =
    apiCategories.length > 0
      ? apiCategories.map((cat, i) => ({
          ...cat,
          ...STYLES[i % STYLES.length],
        }))
      : FALLBACK_CATEGORIES;

  return (
    <section className="max-w-7xl mx-auto px-4 py-14">
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="text-plant-muted text-xs font-medium uppercase tracking-widest mb-1">Danh mục</p>
          <h2 className="font-playfair text-3xl md:text-4xl font-bold text-plant-text">
            Khám phá theo loại
          </h2>
        </div>
        <Link href="/products" className="text-sm text-plant-primary hover:text-plant-primary-light font-medium transition-colors hidden sm:block">
          Xem tất cả →
        </Link>
      </div>

      {/* Scrollable pill row */}
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-none snap-x snap-mandatory">
        {categories.map((cat) => {
          // Use categoryId for real API categories; fall back to slug for hardcoded ones
          const href = cat.id ? `/products?categoryId=${cat.id}` : `/products?category=${cat.slug}`;
          return (
            <Link
              key={cat.id || cat.slug}
              href={href}
              className={`group flex-none snap-start flex items-center gap-2.5 bg-gradient-to-r ${cat.gradient} border border-plant-border hover:border-plant-primary/40 hover:shadow-md rounded-full px-5 py-3 transition-all duration-200 hover:-translate-y-0.5 whitespace-nowrap`}
            >
              <span className={`w-2 h-2 rounded-full ${cat.dot} shrink-0`} />
              <span className="text-sm font-medium text-plant-text group-hover:text-plant-primary transition-colors">
                {cat.name}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

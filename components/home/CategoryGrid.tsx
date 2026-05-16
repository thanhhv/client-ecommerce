import Link from "next/link";

const CATEGORIES = [
  { name: "Hoa", slug: "hoa", emoji: "🌸", description: "Hoa tươi, chậu hoa" },
  { name: "Cây trong nhà", slug: "indoor-plants", emoji: "🌿", description: "Xương rồng, lá chuối..." },
  { name: "Cây ngoài trời", slug: "outdoor-plants", emoji: "🌳", description: "Cây bóng mát, cây ăn quả" },
  { name: "Dụng cụ", slug: "dung-cu", emoji: "🧰", description: "Cuốc, xẻng, bình tưới" },
  { name: "Hạt giống", slug: "hat-giong", emoji: "🌱", description: "Rau, hoa, cỏ" },
  { name: "Chậu cây", slug: "chau-cay", emoji: "🪴", description: "Chậu đất, chậu nhựa, chậu gốm" },
];

export default function CategoryGrid() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="font-playfair text-3xl font-bold text-plant-text mb-8 text-center">
        Danh mục sản phẩm
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.slug}
            href={`/products?category=${cat.slug}`}
            className="group flex flex-col items-center gap-3 p-4 bg-white rounded-2xl border border-plant-border hover:border-plant-primary hover:shadow-md transition-all duration-200"
          >
            <span className="text-4xl group-hover:scale-110 transition-transform duration-200">
              {cat.emoji}
            </span>
            <div className="text-center">
              <p className="font-medium text-plant-text text-sm">{cat.name}</p>
              <p className="text-plant-muted text-xs mt-0.5 line-clamp-1">{cat.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

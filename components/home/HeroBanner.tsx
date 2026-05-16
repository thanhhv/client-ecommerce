import Link from "next/link";

export default function HeroBanner() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#2d5a28] via-[#3a6b35] to-[#4a7a44] min-h-[480px] md:min-h-[560px] flex items-center">
      {/* Decorative circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-white/5" />
        <div className="absolute bottom-0 -left-12 w-64 h-64 rounded-full bg-white/5" />
        <div className="absolute top-1/2 right-1/4 w-32 h-32 rounded-full bg-white/10" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-24">
        <div className="max-w-xl">
          <p className="text-plant-accent font-medium text-sm uppercase tracking-widest mb-3">
            Cửa hàng cây xanh
          </p>
          <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
            Mang Thiên Nhiên<br />
            Vào Ngôi Nhà Bạn
          </h1>
          <p className="text-white/80 text-lg mb-8 leading-relaxed">
            Khám phá hàng trăm loại cây, hoa và dụng cụ làm vườn chất lượng cao.
            Giao hàng toàn quốc, cam kết cây tươi.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-plant-accent hover:bg-[#c96e2f] text-white font-semibold px-8 py-3.5 rounded-xl transition-colors shadow-lg"
            >
              Mua ngay
            </Link>
            <Link
              href="/products?category=indoor-plants"
              className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white font-medium px-8 py-3.5 rounded-xl transition-colors border border-white/30"
            >
              Cây trong nhà
            </Link>
          </div>
        </div>
      </div>

      {/* Large emoji decoration */}
      <div className="hidden md:flex absolute right-8 top-1/2 -translate-y-1/2 text-[180px] leading-none select-none opacity-20">
        🌿
      </div>
    </section>
  );
}

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default function HeroBanner() {
  return (
    <section className="relative overflow-hidden bg-[#0d2010] min-h-[88vh] flex items-center">
      {/* Gradient mesh blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 left-1/4 w-[600px] h-[600px] rounded-full bg-[#1e4d1a]/70 blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-[#2d5a28]/50 blur-[100px]" />
        <div className="absolute top-1/2 left-0 w-[350px] h-[350px] rounded-full bg-plant-accent/8 blur-[80px]" />
      </div>

      {/* Subtle grid texture */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      <div className="relative w-full max-w-7xl mx-auto px-4 md:px-8 py-24 md:py-0 md:min-h-[88vh] flex items-center">
        <div className="grid md:grid-cols-5 gap-12 items-center w-full">
          {/* Left: copy — 3/5 */}
          <div className="md:col-span-3">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/15 rounded-full px-4 py-1.5 mb-8">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-white/70 text-xs font-medium tracking-widest uppercase">
                Cửa hàng cây xanh · 500+ sản phẩm
              </span>
            </div>

            <h1 className="font-playfair text-5xl md:text-6xl lg:text-[76px] font-bold text-white leading-[1.0] mb-6">
              Mang Thiên<br />
              Nhiên Vào<br />
              <span className="italic text-plant-accent">Ngôi Nhà Bạn</span>
            </h1>

            <p className="text-white/55 text-lg mb-10 max-w-md leading-relaxed">
              Hàng trăm loại cây, hoa và dụng cụ làm vườn chất lượng cao. Giao hàng toàn quốc, cam kết cây tươi.
            </p>

            <div className="flex flex-wrap gap-3 mb-14">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 bg-plant-accent hover:bg-[#c96e2f] text-white font-semibold px-8 py-4 rounded-full transition-all duration-200 shadow-lg shadow-plant-accent/25 hover:-translate-y-0.5 active:translate-y-0"
              >
                Khám phá ngay
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/products?category=indoor-plants"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-medium px-8 py-4 rounded-full transition-all duration-200 border border-white/15 hover:-translate-y-0.5 active:translate-y-0"
              >
                Cây trong nhà
              </Link>
            </div>

            {/* Stats */}
            <div className="flex gap-10">
              {[
                { number: "500+", label: "Sản phẩm" },
                { number: "10k+", label: "Khách hàng" },
                { number: "4.9★", label: "Đánh giá" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl font-bold text-white">{stat.number}</div>
                  <div className="text-white/40 text-xs mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: decorative panel — 2/5 */}
          <div className="hidden md:flex md:col-span-2 flex-col gap-4 items-end">
            {/* Floating product card */}
            <div className="w-64 bg-white/8 backdrop-blur-md border border-white/12 rounded-3xl p-5">
              <div className="w-full h-36 rounded-2xl bg-gradient-to-br from-[#1e4d1a] to-[#3a6b35] mb-4 flex items-center justify-center">
                <Sparkles size={40} className="text-white/30" />
              </div>
              <p className="text-white font-medium text-sm">Cây Thiên Lý</p>
              <p className="text-white/50 text-xs mt-0.5">78.000 ₫</p>
              <div className="mt-3 bg-plant-accent/80 rounded-full py-1.5 text-center text-white text-xs font-medium">
                Thêm vào giỏ
              </div>
            </div>

            {/* Delivery card */}
            <div className="w-52 bg-white/8 backdrop-blur-md border border-white/12 rounded-2xl px-4 py-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                <span className="text-green-400 text-lg">🚚</span>
              </div>
              <div>
                <p className="text-white text-xs font-medium">Giao toàn quốc</p>
                <p className="text-white/40 text-[11px]">2–5 ngày làm việc</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

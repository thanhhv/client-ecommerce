import { Leaf, Truck, MessageCircle, RotateCcw } from "lucide-react";

const TRUST_ITEMS = [
  { Icon: Leaf, title: "100% cây tươi", desc: "Cam kết cây sống khoẻ khi nhận hàng", color: "text-emerald-600", bg: "bg-emerald-50" },
  { Icon: Truck, title: "Giao toàn quốc", desc: "Giao nhanh 2–5 ngày làm việc", color: "text-blue-600", bg: "bg-blue-50" },
  { Icon: MessageCircle, title: "Tư vấn miễn phí", desc: "Hỗ trợ chăm sóc cây 24/7", color: "text-violet-600", bg: "bg-violet-50" },
  { Icon: RotateCcw, title: "Đổi trả dễ dàng", desc: "Hoàn tiền trong vòng 7 ngày", color: "text-orange-600", bg: "bg-orange-50" },
];

export default function TrustStrip() {
  return (
    <section className="bg-plant-text py-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {TRUST_ITEMS.map(({ Icon, title, desc, color, bg }) => (
            <div key={title} className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/8 transition-colors">
              <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-4`}>
                <Icon size={18} className={color} />
              </div>
              <p className="font-semibold text-white text-sm mb-1">{title}</p>
              <p className="text-white/45 text-xs leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

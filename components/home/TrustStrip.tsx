const TRUST_ITEMS = [
  { emoji: "🌿", title: "100% cây tươi", desc: "Cam kết cây sống khoẻ" },
  { emoji: "🚚", title: "Giao toàn quốc", desc: "Giao nhanh 2–5 ngày" },
  { emoji: "👨‍🌾", title: "Tư vấn miễn phí", desc: "Hỗ trợ chăm sóc cây" },
  { emoji: "↩️", title: "Đổi trả dễ dàng", desc: "Hoàn tiền trong 7 ngày" },
];

export default function TrustStrip() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {TRUST_ITEMS.map((item) => (
          <div key={item.title} className="flex items-start gap-3">
            <span className="text-3xl shrink-0">{item.emoji}</span>
            <div>
              <p className="font-semibold text-plant-text text-sm">{item.title}</p>
              <p className="text-plant-muted text-xs mt-0.5">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

interface ProductDescriptionProps {
  description: string | null;
}

const SHIPPING_INFO = `Chúng tôi giao hàng toàn quốc trong 2-5 ngày làm việc. Đơn hàng trên 500.000₫ được miễn phí vận chuyển. Cây được đóng gói cẩn thận để đảm bảo an toàn trong quá trình vận chuyển.`;

const CARE_INSTRUCTIONS = `• Tưới nước 2-3 lần/tuần hoặc khi đất khô
• Đặt ở nơi có ánh sáng tự nhiên, tránh ánh nắng trực tiếp
• Bón phân 1 lần/tháng trong mùa sinh trưởng
• Kiểm tra đất thường xuyên và thay chậu khi cần thiết`;

const sections = [
  { title: "Mô tả sản phẩm", contentKey: "description" as const },
  { title: "Hướng dẫn chăm sóc", contentKey: "care" as const },
  { title: "Thông tin vận chuyển", contentKey: "shipping" as const },
];

export default function ProductDescription({ description }: ProductDescriptionProps) {
  const contents = {
    description: description ?? "Liên hệ chúng tôi để biết thêm thông tin về sản phẩm này.",
    care: CARE_INSTRUCTIONS,
    shipping: SHIPPING_INFO,
  };

  return (
    <div className="border border-plant-border rounded-2xl overflow-hidden">
      {sections.map((section, i) => (
        <details
          key={section.title}
          className={`group ${i < sections.length - 1 ? "border-b border-plant-border" : ""}`}
          open={i === 0}
        >
          <summary className="flex items-center justify-between px-6 py-4 cursor-pointer select-none hover:bg-plant-surface transition-colors list-none">
            <span className="font-semibold text-plant-text">{section.title}</span>
            <span className="text-plant-muted text-xl transition-transform duration-200 group-open:rotate-45">
              +
            </span>
          </summary>
          <div className="px-6 pb-5 text-sm text-plant-muted leading-relaxed whitespace-pre-line">
            {contents[section.contentKey]}
          </div>
        </details>
      ))}
    </div>
  );
}

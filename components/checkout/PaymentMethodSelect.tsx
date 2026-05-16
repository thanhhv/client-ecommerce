"use client";

type PaymentMethod = "COD" | "BANK_TRANSFER";

interface PaymentMethodSelectProps {
  value: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
}

const METHODS = [
  {
    id: "COD" as PaymentMethod,
    emoji: "💵",
    title: "Thanh toán khi nhận hàng (COD)",
    desc: "Trả tiền mặt khi nhận hàng",
  },
  {
    id: "BANK_TRANSFER" as PaymentMethod,
    emoji: "🏦",
    title: "Chuyển khoản ngân hàng",
    desc: "Thông tin tài khoản sẽ được gửi sau khi đặt hàng",
  },
];

export default function PaymentMethodSelect({ value, onChange }: PaymentMethodSelectProps) {
  return (
    <div className="space-y-3">
      {METHODS.map((method) => (
        <label
          key={method.id}
          className={`flex items-start gap-4 p-4 rounded-xl border-2 cursor-pointer transition-colors ${
            value === method.id
              ? "border-plant-primary bg-green-50"
              : "border-plant-border hover:border-plant-primary/40"
          }`}
        >
          <input
            type="radio"
            name="paymentMethod"
            value={method.id}
            checked={value === method.id}
            onChange={() => onChange(method.id)}
            className="mt-0.5 accent-[#3a6b35]"
          />
          <span className="text-2xl">{method.emoji}</span>
          <div>
            <p className="font-medium text-plant-text text-sm">{method.title}</p>
            <p className="text-xs text-plant-muted mt-0.5">{method.desc}</p>
          </div>
        </label>
      ))}
    </div>
  );
}

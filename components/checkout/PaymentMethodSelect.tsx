"use client";

import { Banknote, Building2, CheckCircle2 } from "lucide-react";

type PaymentMethod = "COD" | "BANK_TRANSFER";

interface PaymentMethodSelectProps {
  value: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
}

const METHODS = [
  {
    id: "COD" as PaymentMethod,
    icon: Banknote,
    title: "Thanh toán khi nhận hàng",
    badge: "COD",
    desc: "Trả tiền mặt khi nhận hàng tại địa chỉ của bạn",
  },
  {
    id: "BANK_TRANSFER" as PaymentMethod,
    icon: Building2,
    title: "Chuyển khoản ngân hàng",
    badge: "ATM / Internet Banking",
    desc: "Thông tin tài khoản sẽ được gửi sau khi đặt hàng",
  },
];

export default function PaymentMethodSelect({ value, onChange }: PaymentMethodSelectProps) {
  return (
    <div className="space-y-3">
      {METHODS.map((method) => {
        const Icon = method.icon;
        const selected = value === method.id;
        return (
          <label
            key={method.id}
            className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all select-none ${
              selected
                ? "border-plant-primary bg-green-50/60 shadow-sm"
                : "border-plant-border hover:border-plant-primary/40 hover:bg-plant-surface/50"
            }`}
          >
            <input
              type="radio"
              name="paymentMethod"
              value={method.id}
              checked={selected}
              onChange={() => onChange(method.id)}
              className="sr-only"
            />
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              selected ? "bg-plant-primary text-white" : "bg-plant-surface text-plant-muted"
            } transition-all`}>
              <Icon size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-medium text-plant-text text-[15px]">{method.title}</p>
                <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${
                  selected ? "bg-plant-primary/10 text-plant-primary" : "bg-plant-surface text-plant-muted"
                }`}>
                  {method.badge}
                </span>
              </div>
              <p className="text-sm text-plant-muted mt-0.5">{method.desc}</p>
            </div>
            <div className={`shrink-0 transition-all ${selected ? "opacity-100" : "opacity-0"}`}>
              <CheckCircle2 size={20} className="text-plant-primary" />
            </div>
          </label>
        );
      })}
    </div>
  );
}

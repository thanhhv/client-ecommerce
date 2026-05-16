"use client";

interface AddressFormData {
  shippingName: string;
  shippingPhone: string;
  shippingAddress: string;
}

interface AddressFormProps {
  data: AddressFormData;
  onChange: (updates: Partial<AddressFormData>) => void;
  errors: Partial<Record<keyof AddressFormData, string>>;
}

export default function AddressForm({ data, onChange, errors }: AddressFormProps) {
  const field = (
    id: keyof AddressFormData,
    label: string,
    placeholder: string,
    type: string = "text",
    multiline = false,
  ) => (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-plant-text mb-1">
        {label} <span className="text-red-500">*</span>
      </label>
      {multiline ? (
        <textarea
          id={id}
          rows={3}
          value={data[id]}
          onChange={(e) => onChange({ [id]: e.target.value })}
          placeholder={placeholder}
          className={`w-full border rounded-xl px-4 py-2.5 text-sm text-plant-text placeholder:text-plant-muted focus:outline-none focus:ring-2 focus:ring-plant-primary resize-none ${
            errors[id] ? "border-red-400" : "border-plant-border"
          }`}
        />
      ) : (
        <input
          id={id}
          type={type}
          value={data[id]}
          onChange={(e) => onChange({ [id]: e.target.value })}
          placeholder={placeholder}
          className={`w-full border rounded-xl px-4 py-2.5 text-sm text-plant-text placeholder:text-plant-muted focus:outline-none focus:ring-2 focus:ring-plant-primary ${
            errors[id] ? "border-red-400" : "border-plant-border"
          }`}
        />
      )}
      {errors[id] && <p className="text-xs text-red-500 mt-1">{errors[id]}</p>}
    </div>
  );

  return (
    <div className="space-y-4">
      {field("shippingName", "Họ và tên", "Nguyễn Văn A")}
      {field("shippingPhone", "Số điện thoại", "0901234567", "tel")}
      {field("shippingAddress", "Địa chỉ giao hàng", "Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố", "text", true)}
    </div>
  );
}

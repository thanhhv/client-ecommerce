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

const inputBase =
  "w-full border rounded-xl px-4 py-3 text-[15px] text-plant-text placeholder:text-plant-muted/60 focus:outline-none focus:ring-2 focus:ring-plant-primary/15 focus:border-plant-primary/60 transition-all bg-white";
const inputError =
  "border-red-400 focus:ring-red-400/15 focus:border-red-400";
const inputNormal = "border-plant-border";

export default function AddressForm({ data, onChange, errors }: AddressFormProps) {
  return (
    <div className="space-y-4">
      {/* Name + Phone row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="shippingName" className="block text-sm font-medium text-plant-text mb-1.5">
            Họ và tên <span className="text-red-500">*</span>
          </label>
          <input
            id="shippingName"
            type="text"
            value={data.shippingName}
            onChange={(e) => onChange({ shippingName: e.target.value })}
            placeholder="Nguyễn Văn A"
            className={`${inputBase} ${errors.shippingName ? inputError : inputNormal}`}
          />
          {errors.shippingName && (
            <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
              <span>⚠</span> {errors.shippingName}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="shippingPhone" className="block text-sm font-medium text-plant-text mb-1.5">
            Số điện thoại <span className="text-red-500">*</span>
          </label>
          <input
            id="shippingPhone"
            type="tel"
            value={data.shippingPhone}
            onChange={(e) => onChange({ shippingPhone: e.target.value })}
            placeholder="0901 234 567"
            className={`${inputBase} ${errors.shippingPhone ? inputError : inputNormal}`}
          />
          {errors.shippingPhone && (
            <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
              <span>⚠</span> {errors.shippingPhone}
            </p>
          )}
        </div>
      </div>

      {/* Address */}
      <div>
        <label htmlFor="shippingAddress" className="block text-sm font-medium text-plant-text mb-1.5">
          Địa chỉ giao hàng <span className="text-red-500">*</span>
        </label>
        <textarea
          id="shippingAddress"
          rows={3}
          value={data.shippingAddress}
          onChange={(e) => onChange({ shippingAddress: e.target.value })}
          placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố"
          className={`${inputBase} resize-none ${errors.shippingAddress ? inputError : inputNormal}`}
        />
        {errors.shippingAddress && (
          <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1">
            <span>⚠</span> {errors.shippingAddress}
          </p>
        )}
      </div>
    </div>
  );
}

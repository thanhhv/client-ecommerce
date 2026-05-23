"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { Eye, EyeOff } from "lucide-react";
import { authApi } from "@/lib/api/auth";
import { markAuthOk } from "@/lib/api/client";
import { useAuthStore } from "@/lib/stores/authStore";
import axios from "axios";

interface FormFields {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  address: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function RegisterContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";
  const { setAuth } = useAuthStore();

  const [fields, setFields] = useState<FormFields>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  function update(field: keyof FormFields) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setFields((prev) => ({ ...prev, [field]: e.target.value }));
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    };
  }

  function validate(): boolean {
    const newErrors: FormErrors = {};
    if (!fields.name.trim()) {
      newErrors.name = "Vui lòng nhập họ và tên";
    }
    if (!fields.email.trim()) {
      newErrors.email = "Vui lòng nhập email";
    } else if (!isValidEmail(fields.email)) {
      newErrors.email = "Email không hợp lệ";
    }
    if (!fields.password) {
      newErrors.password = "Vui lòng nhập mật khẩu";
    } else if (fields.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }
    if (!fields.confirmPassword) {
      newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu";
    } else if (fields.confirmPassword !== fields.password) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError(null);
    if (!validate()) return;

    setLoading(true);
    try {
      const payload: {
        name: string;
        email: string;
        password: string;
        phone?: string;
        address?: string;
      } = {
        name: fields.name.trim(),
        email: fields.email.trim(),
        password: fields.password,
      };
      if (fields.phone.trim()) payload.phone = fields.phone.trim();
      if (fields.address.trim()) payload.address = fields.address.trim();

      const res = await authApi.register(payload);
      const { accessToken, user } = res.data.data;
      markAuthOk();
      setAuth(
        {
          id: user.id,
          name: user.name ?? user.email,
          email: user.email,
          avatar: undefined,
          role: user.role,
        },
        accessToken
      );
      router.replace(redirect);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setServerError(
          err.response?.data?.error?.message ?? "Đăng ký thất bại. Vui lòng thử lại."
        );
      } else {
        setServerError("Đăng ký thất bại. Vui lòng thử lại.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-plant-surface flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center gap-6">
        <Link href="/" className="font-playfair text-2xl font-bold text-plant-primary">
          🌿 Thế giới cây xanh
        </Link>

        <div className="text-center">
          <h1 className="font-playfair text-xl font-semibold text-plant-text mb-1">
            Đăng ký
          </h1>
          <p className="text-plant-muted text-sm">
            Mang thiên nhiên vào ngôi nhà của bạn
          </p>
        </div>

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4" noValidate>
          {serverError && (
            <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-red-700 text-sm">
              {serverError}
            </div>
          )}

          {/* Họ và tên */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-plant-text" htmlFor="reg-name">
              Họ và tên <span className="text-red-500">*</span>
            </label>
            <input
              id="reg-name"
              type="text"
              autoComplete="name"
              value={fields.name}
              onChange={update("name")}
              placeholder="Nguyễn Văn A"
              className={`rounded-xl border px-4 py-3 text-sm text-plant-text placeholder:text-plant-muted focus:outline-none focus:ring-2 focus:ring-plant-primary/40 ${
                errors.name ? "border-red-400" : "border-plant-border"
              }`}
            />
            {errors.name && (
              <p className="text-xs text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-plant-text" htmlFor="reg-email">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              id="reg-email"
              type="email"
              autoComplete="email"
              value={fields.email}
              onChange={update("email")}
              placeholder="you@example.com"
              className={`rounded-xl border px-4 py-3 text-sm text-plant-text placeholder:text-plant-muted focus:outline-none focus:ring-2 focus:ring-plant-primary/40 ${
                errors.email ? "border-red-400" : "border-plant-border"
              }`}
            />
            {errors.email && (
              <p className="text-xs text-red-600">{errors.email}</p>
            )}
          </div>

          {/* Mật khẩu */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-plant-text" htmlFor="reg-password">
              Mật khẩu <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                id="reg-password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                value={fields.password}
                onChange={update("password")}
                placeholder="Ít nhất 6 ký tự"
                className={`w-full rounded-xl border px-4 py-3 pr-11 text-sm text-plant-text placeholder:text-plant-muted focus:outline-none focus:ring-2 focus:ring-plant-primary/40 ${
                  errors.password ? "border-red-400" : "border-plant-border"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-plant-muted hover:text-plant-text transition-colors"
                aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-600">{errors.password}</p>
            )}
          </div>

          {/* Xác nhận mật khẩu */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-plant-text" htmlFor="reg-confirm">
              Xác nhận mật khẩu <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                id="reg-confirm"
                type={showConfirm ? "text" : "password"}
                autoComplete="new-password"
                value={fields.confirmPassword}
                onChange={update("confirmPassword")}
                placeholder="Nhập lại mật khẩu"
                className={`w-full rounded-xl border px-4 py-3 pr-11 text-sm text-plant-text placeholder:text-plant-muted focus:outline-none focus:ring-2 focus:ring-plant-primary/40 ${
                  errors.confirmPassword ? "border-red-400" : "border-plant-border"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-plant-muted hover:text-plant-text transition-colors"
                aria-label={showConfirm ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
              >
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-xs text-red-600">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Số điện thoại (optional) */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-plant-text" htmlFor="reg-phone">
              Số điện thoại
            </label>
            <input
              id="reg-phone"
              type="text"
              autoComplete="tel"
              value={fields.phone}
              onChange={update("phone")}
              placeholder="0901234567"
              className="rounded-xl border border-plant-border px-4 py-3 text-sm text-plant-text placeholder:text-plant-muted focus:outline-none focus:ring-2 focus:ring-plant-primary/40"
            />
          </div>

          {/* Địa chỉ (optional) */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-plant-text" htmlFor="reg-address">
              Địa chỉ
            </label>
            <textarea
              id="reg-address"
              rows={2}
              value={fields.address}
              onChange={update("address")}
              placeholder="123 Đường ABC, Phường XYZ, TP. HCM"
              className="rounded-xl border border-plant-border px-4 py-3 text-sm text-plant-text placeholder:text-plant-muted focus:outline-none focus:ring-2 focus:ring-plant-primary/40 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-plant-primary text-white py-3 text-sm font-semibold hover:bg-plant-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading && (
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
            )}
            Đăng ký
          </button>

          <p className="text-center text-sm text-plant-muted">
            Đã có tài khoản?{" "}
            <Link href="/auth/login" className="text-plant-primary font-medium hover:underline">
              Đăng nhập
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterContent />
    </Suspense>
  );
}

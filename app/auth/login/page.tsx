"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { authApi } from "@/lib/api/auth";
import { markAuthOk } from "@/lib/api/client";
import { useAuthStore } from "@/lib/stores/authStore";
import axios from "axios";

type Tab = "google" | "email";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";
  const googleAuthUrl = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"}/api/v1/auth/google?redirect=${encodeURIComponent(redirect)}`;

  const { setAuth } = useAuthStore();

  const [tab, setTab] = useState<Tab>("google");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await authApi.login({ email, password });
      const { accessToken, user } = res.data.data;
      markAuthOk();
      setAuth(
        {
          id: user.id,
          name: user.name ?? user.email,
          email: user.email,
          avatar: user.avatarUrl ?? undefined,
          role: user.role,
        },
        accessToken
      );
      router.replace(redirect);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.error?.message ?? "Email hoặc mật khẩu không đúng"
        );
      } else {
        setError("Email hoặc mật khẩu không đúng");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left decorative panel — desktop only */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0d2010] relative overflow-hidden flex-col items-center justify-center p-12">
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-[#1e4d1a]/60 blur-[80px]" />
        <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-[#2d5a28]/50 blur-[60px]" />
        <div className="relative text-center">
          <div className="text-8xl mb-6">🌿</div>
          <h2 className="font-playfair text-4xl font-bold text-white mb-3 leading-tight">
            Mang thiên nhiên<br />vào ngôi nhà bạn
          </h2>
          <p className="text-white/50 text-sm max-w-xs leading-relaxed">
            Hơn 500 loại cây xanh, hoa và dụng cụ làm vườn. Giao hàng toàn quốc.
          </p>
        </div>
      </div>

      {/* Right: form panel */}
      <div className="flex-1 bg-plant-surface flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-sm p-8 flex flex-col items-center gap-6">
        <Link href="/" className="font-playfair text-2xl font-bold text-plant-primary">
          🌿 Thế giới cây xanh
        </Link>

        <div className="text-center">
          <h1 className="font-playfair text-xl font-semibold text-plant-text mb-1">
            Đăng nhập
          </h1>
          <p className="text-plant-muted text-sm">
            Mang thiên nhiên vào ngôi nhà của bạn
          </p>
        </div>

        {/* Tab switcher */}
        <div className="w-full flex rounded-xl border border-plant-border overflow-hidden">
          <button
            type="button"
            onClick={() => { setTab("google"); setError(null); }}
            className={`flex-1 py-2 text-sm font-medium transition-colors ${
              tab === "google"
                ? "bg-plant-primary text-white"
                : "bg-white text-plant-muted hover:bg-plant-surface"
            }`}
          >
            Google
          </button>
          <button
            type="button"
            onClick={() => { setTab("email"); setError(null); }}
            className={`flex-1 py-2 text-sm font-medium transition-colors ${
              tab === "email"
                ? "bg-plant-primary text-white"
                : "bg-white text-plant-muted hover:bg-plant-surface"
            }`}
          >
            Email
          </button>
        </div>

        {/* Tab: Google */}
        {tab === "google" && (
          <a
            href={googleAuthUrl}
            className="w-full flex items-center justify-center gap-3 border border-plant-border rounded-xl px-4 py-3 text-plant-text text-sm font-medium hover:bg-plant-surface transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              <path fill="none" d="M0 0h48v48H0z"/>
            </svg>
            Tiếp tục với Google
          </a>
        )}

        {/* Tab: Email */}
        {tab === "email" && (
          <form onSubmit={handleEmailLogin} className="w-full flex flex-col gap-4">
            {error && (
              <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-red-700 text-sm">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-plant-text" htmlFor="login-email">
                Email
              </label>
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="rounded-xl border border-plant-border px-4 py-3 text-sm text-plant-text placeholder:text-plant-muted focus:outline-none focus:ring-2 focus:ring-plant-primary/40"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-plant-text" htmlFor="login-password">
                Mật khẩu
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••"
                  className="w-full rounded-xl border border-plant-border px-4 py-3 pr-11 text-sm text-plant-text placeholder:text-plant-muted focus:outline-none focus:ring-2 focus:ring-plant-primary/40"
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
              Đăng nhập
            </button>

            <p className="text-center text-sm text-plant-muted">
              Chưa có tài khoản?{" "}
              <Link href="/auth/register" className="text-plant-primary font-medium hover:underline">
                Đăng ký ngay
              </Link>
            </p>
          </form>
        )}

        <p className="text-xs text-plant-muted text-center">
          Bằng cách đăng nhập, bạn đồng ý với{" "}
          <span className="text-plant-primary">điều khoản dịch vụ</span> của chúng tôi.
        </p>
      </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginContent />
    </Suspense>
  );
}

"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/lib/stores/authStore";
import { authApi } from "@/lib/api/auth";
import { markAuthOk } from "@/lib/api/client";

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAuth = useAuthStore((s) => s.setAuth);

  const error = searchParams.get("error");

  useEffect(() => {
    if (error) return; // Don't attempt auth when there's already an error param
    async function handleCallback() {
      try {
        // Try to restore session using the refresh_token cookie set by backend
        const { data } = await authApi.refresh();
        const accessToken = data.data.accessToken;

        // Get user profile
        const profileRes = await authApi.getProfile();
        const user = profileRes.data.data;

        markAuthOk();
        setAuth(
          {
            id: user.id,
            name: user.name ?? user.email,
            email: user.email,
            avatar: user.avatarUrl ?? undefined,
            role: user.role,
          },
          accessToken,
        );

        const redirect = searchParams.get("redirect") || "/";
        router.replace(redirect);
      } catch {
        router.replace("/auth/callback?error=oauth_failed");
      }
    }
    handleCallback();
  }, [router, searchParams, setAuth, error]);

  if (error === "oauth_failed") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-plant-surface">
        <div className="text-center">
          <p className="text-red-600 mb-2 font-medium">Đăng nhập thất bại</p>
          <p className="text-plant-muted text-sm">Vui lòng thử lại hoặc dùng email để đăng nhập.</p>
          <a href="/auth/login" className="mt-4 inline-block text-plant-primary underline text-sm">
            Quay lại đăng nhập
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-plant-surface">
      <div className="text-center">
        <div className="text-5xl mb-4 animate-pulse">🌿</div>
        <p className="text-plant-muted">Đang đăng nhập...</p>
      </div>
    </div>
  );
}

export default function CallbackPage() {
  return (
    <Suspense>
      <CallbackContent />
    </Suspense>
  );
}

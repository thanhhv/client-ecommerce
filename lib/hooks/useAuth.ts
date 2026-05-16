"use client";

import { useEffect, useRef } from "react";
import { useAuthStore } from "@/lib/stores/authStore";
import { authApi } from "@/lib/api/auth";

export function useSessionRestore() {
  const { accessToken, setAuth } = useAuthStore();
  const attempted = useRef(false);

  useEffect(() => {
    if (accessToken || attempted.current) return;
    attempted.current = true;

    async function restore() {
      try {
        const { data } = await authApi.refresh();
        const token = data.data.accessToken;
        const profileRes = await authApi.getProfile();
        const user = profileRes.data.data;
        setAuth(
          {
            id: user.id,
            name: user.name ?? user.email,
            email: user.email,
            avatar: user.avatarUrl ?? undefined,
            role: user.role,
          },
          token,
        );
      } catch {
        // no active session — stay logged out silently
      }
    }
    restore();
  }, [accessToken, setAuth]);
}

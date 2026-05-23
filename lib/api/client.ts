import axios from "axios";
import { useAuthStore } from "@/lib/stores/authStore";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

const apiClient = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// Attach access token to every request
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- Refresh state (module-level, shared across all in-flight requests) ---

// Single in-flight refresh promise — all concurrent 401s wait on the same call.
let refreshPromise: Promise<string> | null = null;

// Once refresh fails, stop retrying until the user authenticates again.
// Prevents hammering /auth/refresh when the cookie is simply gone.
let refreshBroken = false;

// Called by login / OAuth callback after a successful sign-in.
export function markAuthOk() {
  refreshBroken = false;
  refreshPromise = null;
}

function redirectToLogin() {
  if (typeof window === "undefined") return;
  const path = window.location.pathname;
  // Never redirect to login from an auth page — that's the infinite loop.
  if (path.startsWith("/auth/")) return;
  window.location.href = `/auth/login?redirect=${encodeURIComponent(path)}`;
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    // Skip retry when:
    // • Not a 401
    // • Already retried this request
    // • The failing request IS the refresh endpoint (recursive refresh = the bug)
    // • The failing request is logout (no point retrying)
    // • We already know refresh is broken this session
    if (
      error.response?.status !== 401 ||
      original._retried ||
      original.url?.includes("/auth/refresh") ||
      original.url?.includes("/auth/logout") ||
      refreshBroken
    ) {
      return Promise.reject(error);
    }

    original._retried = true;

    // If no refresh is in-flight, start one. All concurrent 401s share this promise.
    if (!refreshPromise) {
      refreshPromise = axios
        .post<{ data: { accessToken: string } }>(
          `${BASE_URL}/api/v1/auth/refresh`,
          {},
          { withCredentials: true },
        )
        .then((res) => {
          const newToken = res.data.data.accessToken;
          const currentUser = useAuthStore.getState().user;
          if (currentUser) useAuthStore.getState().setAuth(currentUser, newToken);
          return newToken;
        })
        .catch((err) => {
          refreshBroken = true;
          useAuthStore.getState().logout();
          redirectToLogin();
          throw err;
        })
        .finally(() => {
          refreshPromise = null;
        });
    }

    try {
      const newToken = await refreshPromise;
      original.headers.Authorization = `Bearer ${newToken}`;
      return apiClient(original);
    } catch {
      return Promise.reject(error);
    }
  },
);

export default apiClient;

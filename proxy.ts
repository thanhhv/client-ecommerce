import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedPaths = ["/cart", "/checkout", "/orders", "/profile"];

/**
 * Next.js Edge Middleware — Route Protection
 *
 * LIMITATION: This middleware checks for the presence of a `refresh_token`
 * cookie (set as httpOnly by the backend on login/refresh). It cannot validate
 * the token itself at the edge — an expired or forged cookie will still pass
 * this guard. True validation happens server-side when the first authenticated
 * API call is made, at which point the client-side interceptor in lib/api/client.ts
 * will redirect to /auth/login.
 *
 * This guard exists to prevent the flash of authenticated-looking UI for users
 * who are clearly unauthenticated (no cookie at all).
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = protectedPaths.some((path) =>
    pathname.startsWith(path)
  );

  if (isProtected) {
    // The BE sets a 7-day httpOnly `refresh_token` cookie on login.
    // The access token only lives in client memory (Zustand) so we can't
    // read it here. Checking refresh_token is the correct gate — absent
    // means the user has never logged in or explicitly logged out.
    const refreshToken = request.cookies.get("refresh_token")?.value;
    if (!refreshToken) {
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/cart/:path*",
    "/checkout/:path*",
    "/orders/:path*",
    "/profile/:path*",
  ],
};

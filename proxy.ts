import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedPaths = ["/cart", "/checkout", "/orders", "/profile"];

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

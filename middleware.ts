/**
 * middleware.ts  (place at project root, next to package.json)
 * ─────────────────────────────────────────────────────────────────────────────
 * Next.js Edge Middleware for route protection.
 *
 * Since we're using localStorage (client-only), this middleware reads a
 * cookie fallback. To make server-side protection work properly in production,
 * switch to cookie-based sessions (see comment below).
 *
 * Production upgrade path:
 *   1. Set an HttpOnly cookie in loginUser() via a /api/auth/login route
 *   2. Read that cookie here with request.cookies.get('session')
 *   3. Verify JWT / session token against your DB
 */

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that require authentication and their required roles
const PROTECTED_PATHS: Array<{ pattern: RegExp; role: string }> = [
  { pattern: /^\/admin(\/|$)/, role: "admin" },
  { pattern: /^\/vendor\/dashboard(\/|$)/, role: "vendor" },
  { pattern: /^\/dashboard(\/|$)/, role: "customer" },
  { pattern: /^\/delivery(\/|$)/, role: "delivery_partner" },
];

// Public paths that never need auth
const PUBLIC_PATHS = ["/", "/login", "/register", "/vendors", "/packages", "/vendor/register", "/flowers", "/profile", "/book"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public paths
  if (PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    return NextResponse.next();
  }

  // Check protected paths
  const matched = PROTECTED_PATHS.find(({ pattern }) => pattern.test(pathname));
  if (!matched) return NextResponse.next();

  /**
   * Read session from cookie.
   * This cookie is set by the loginUser() function:
   *   document.cookie = `es_session=${user.role}; path=/; max-age=86400`;
   * 
   * NOTE: For true security, use HttpOnly cookies via a /api/auth route.
   * localStorage cannot be read by middleware (server-side).
   */
  const sessionCookie = request.cookies.get("es_session");

  if (!sessionCookie) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const user = JSON.parse(decodeURIComponent(sessionCookie.value));

    // Role mismatch — redirect to their own dashboard
    if (user.role !== matched.role) {
      const roleRoutes: Record<string, string> = {
        admin: "/admin/dashboard",
        vendor: "/vendor/dashboard",
        customer: "/dashboard",
        delivery_partner: "/delivery/dashboard",
      };
      return NextResponse.redirect(new URL(roleRoutes[user.role] || "/", request.url));
    }
  } catch {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/vendor/dashboard/:path*",
    "/dashboard/:path*",
    "/delivery/:path*",
  ],
};

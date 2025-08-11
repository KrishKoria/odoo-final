import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

type Role = "USER" | "FACILITY_OWNER" | "ADMIN";

// Define protected routes and their required roles
const protectedRoutes: Record<string, Role[]> = {
  "/dashboard": ["USER", "FACILITY_OWNER", "ADMIN"],
  "/admin": ["ADMIN"],
  "/facility": ["FACILITY_OWNER", "ADMIN"],
  "/profile": ["USER", "FACILITY_OWNER", "ADMIN"],
  "/bookings": ["USER", "FACILITY_OWNER", "ADMIN"],
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the route is protected
  const route = Object.keys(protectedRoutes).find((route) =>
    pathname.startsWith(route),
  );

  if (!route) {
    return NextResponse.next();
  }

  // Simple cookie-based check to avoid database calls in Edge Runtime
  // We'll do proper session validation on the client side
  const sessionCookie = request.cookies.get("better-auth.session_token");

  console.log("Middleware - Cookie check:", {
    pathname,
    hasSessionCookie: !!sessionCookie,
    cookieValue: sessionCookie?.value ? "***exists***" : "none",
  });

  // If no session cookie, redirect to login
  if (!sessionCookie?.value) {
    console.log("Middleware - No session cookie, redirecting to login");
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // For protected routes, let the request pass through
  // The actual session validation will happen on the client side
  // If the session is invalid, the client will handle the redirect
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api/auth|_next/static|_next/image|favicon.ico|public|auth).*)",
  ],
};

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

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

  try {
    // Get session from better-auth
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    // If no session, redirect to login
    if (!session) {
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Check if user has required role
    const requiredRoles = protectedRoutes[route];
    if (!requiredRoles) {
      return NextResponse.next();
    }

    // For now, we'll assume all users have USER role since the role field
    // might not be available in the session. In a real implementation,
    // you'd need to extend the better-auth session to include the role
    const userRole: Role = "USER"; // This should come from session.user.role

    if (!requiredRoles.includes(userRole)) {
      // Redirect to dashboard for unauthorized access
      const redirectUrl = "/dashboard";
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }

    // Check if email is verified for sensitive routes
    if (pathname.startsWith("/admin") || pathname.startsWith("/facility")) {
      if (!session.user.emailVerified) {
        const verifyUrl = new URL("/auth/verify-email", request.url);
        return NextResponse.redirect(verifyUrl);
      }
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    // Redirect to login on any auth error
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (auth API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     * - auth (auth pages)
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico|public|auth).*)",
  ],
};

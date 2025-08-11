"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import type { UserRole } from "@/generated/prisma";

interface SessionGuardProps {
  children: React.ReactNode;
  requiredRoles?: UserRole[];
  requireEmailVerification?: boolean;
  redirectTo?: string;
}

export function SessionGuard({
  children,
  requiredRoles = ["USER"],
  requireEmailVerification = false,
  redirectTo = "/auth/login",
}: SessionGuardProps) {
  const [isValidating, setIsValidating] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;

    const validateSession = async () => {
      try {
        // Get session from better-auth client
        const { data: session, error } = await authClient.getSession();

        if (!isMounted) return;

        if (error || !session?.user) {
          console.log("SessionGuard - No valid session, redirecting to login");
          router.replace(redirectTo);
          return;
        }

        // Check email verification if required
        if (requireEmailVerification && !session.user.emailVerified) {
          console.log(
            "SessionGuard - Email not verified, redirecting to verification",
          );
          router.replace("/auth/verify-email");
          return;
        }

        // Fetch user profile to get role
        try {
          const response = await fetch("/api/profile", {
            method: "GET",
            credentials: "include",
          });

          if (!response.ok) {
            throw new Error("Failed to fetch user profile");
          }

          const profile = await response.json();
          const currentUserRole: UserRole = profile.role || "USER";

          if (!isMounted) return;

          setUserRole(currentUserRole);

          // Check if user has required role
          if (!requiredRoles.includes(currentUserRole)) {
            console.log(
              `SessionGuard - Insufficient permissions. User role: ${currentUserRole}, Required: ${requiredRoles.join(", ")}`,
            );

            // Redirect based on user role
            if (
              currentUserRole === "FACILITY_OWNER" ||
              currentUserRole === "ADMIN"
            ) {
              router.replace("/dashboard");
            } else {
              router.replace("/");
            }
            return;
          }

          setIsAuthorized(true);
        } catch (profileError) {
          console.error("SessionGuard - Profile fetch error:", profileError);
          // If we can't get the profile, assume USER role
          const fallbackRole: UserRole = "USER";
          setUserRole(fallbackRole);

          if (requiredRoles.includes(fallbackRole)) {
            setIsAuthorized(true);
          } else {
            router.replace("/");
          }
        }
      } catch (error) {
        console.error("SessionGuard - Session validation error:", error);
        if (isMounted) {
          router.replace(redirectTo);
        }
      } finally {
        if (isMounted) {
          setIsValidating(false);
        }
      }
    };

    void validateSession();

    return () => {
      isMounted = false;
    };
  }, [router, requiredRoles, requireEmailVerification, redirectTo]);

  if (isValidating) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
          <p className="text-sm text-gray-600">Validating session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null; // Router will handle redirect
  }

  return <>{children}</>;
}

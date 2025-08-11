"use client";

import { authClient } from "@/lib/auth-client";
import { UserRole } from "@/types/venue";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface SessionGuardProps {
  children: React.ReactNode;
  requiredRoles?: UserRole[];
  requireEmailVerification?: boolean;
  redirectTo?: string;
}

export function SessionGuard({
  children,
  requiredRoles = [UserRole.USER],
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

        console.log("SessionGuard - Session check:", { session, error });

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
          // Convert string role to UserRole enum - more explicit conversion
          const roleString = profile.role || "USER";
          let currentUserRole: UserRole;

          // Explicit role mapping to ensure proper enum conversion
          switch (roleString) {
            case "ADMIN":
              currentUserRole = UserRole.ADMIN;
              break;
            case "FACILITY_OWNER":
              currentUserRole = UserRole.FACILITY_OWNER;
              break;
            case "USER":
            default:
              currentUserRole = UserRole.USER;
              break;
          }

          console.log("SessionGuard - Profile data:", {
            profile,
            roleString,
            currentUserRole,
            requiredRoles,
            includes: requiredRoles.includes(currentUserRole),
          });

          if (!isMounted) return;

          setUserRole(currentUserRole);

          // Check if user has required role
          console.log("SessionGuard - Role comparison debug:", {
            currentUserRole,
            requiredRoles,
            includes: requiredRoles.includes(currentUserRole),
            typeOfCurrentRole: typeof currentUserRole,
            typeOfRequiredRoles: typeof requiredRoles,
            enumComparison: currentUserRole === UserRole.ADMIN,
          });

          if (!requiredRoles.includes(currentUserRole)) {
            console.log(
              `SessionGuard - Insufficient permissions. User role: ${currentUserRole}, Required: ${requiredRoles.join(", ")}`,
            );

            // Redirect based on user role
            if (
              currentUserRole === UserRole.FACILITY_OWNER ||
              currentUserRole === UserRole.ADMIN
            ) {
              router.replace("/dashboard");
            } else {
              router.replace("/");
            }
            return;
          }

          console.log(
            "SessionGuard - Authorization GRANTED! Setting isAuthorized to true",
          );
          setIsAuthorized(true);
          console.log("SessionGuard - isAuthorized has been set to true");
        } catch (profileError) {
          console.error("SessionGuard - Profile fetch error:", profileError);
          // If we can't get the profile, assume USER role
          const fallbackRole: UserRole = UserRole.USER;
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

  console.log("SessionGuard - Render state:", { isValidating, isAuthorized });

  if (isValidating) {
    console.log("SessionGuard - Showing validation loading screen");
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
    console.log(
      "SessionGuard - Not authorized, returning null (should redirect)",
    );
    return null; // Router will handle redirect
  }

  console.log("SessionGuard - Authorized! Rendering children");
  return <>{children}</>;
}

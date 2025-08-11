"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

interface SessionGuardProps {
  children: React.ReactNode;
  requiredRoles?: ("USER" | "FACILITY_OWNER" | "ADMIN")[];
  requireEmailVerification?: boolean;
}

export function SessionGuard({
  children,
  requiredRoles = ["USER"],
  requireEmailVerification = false,
}: SessionGuardProps) {
  const [isValidating, setIsValidating] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
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
          router.replace("/auth/login");
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

        // For now, assume all users have USER role
        // In a real implementation, you'd check session.user.role
        const userRole: "USER" | "FACILITY_OWNER" | "ADMIN" = "USER";

        if (!requiredRoles.includes(userRole)) {
          console.log(
            "SessionGuard - Insufficient permissions, redirecting to dashboard",
          );
          router.replace("/dashboard");
          return;
        }

        setIsAuthorized(true);
      } catch (error) {
        console.error("SessionGuard - Session validation error:", error);
        if (isMounted) {
          router.replace("/auth/login");
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
  }, [router, requiredRoles, requireEmailVerification]);

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

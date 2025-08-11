"use client";

import { authClient } from "@/lib/auth-client";
import { UserRole } from "@/types/venue";
import { useEffect, useState } from "react";

export default function DebugAuthPage() {
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Get session
        const { data: session, error } = await authClient.getSession();

        // Get profile
        const profileResponse = await fetch("/api/profile", {
          method: "GET",
          credentials: "include",
        });

        const profile = profileResponse.ok
          ? await profileResponse.json()
          : null;

        const roleString = profile?.role || "USER";
        const currentUserRole =
          UserRole[roleString as keyof typeof UserRole] || UserRole.USER;
        const requiredRoles = [UserRole.ADMIN];

        setDebugInfo({
          hasSession: !!session,
          sessionError: error,
          profileData: profile,
          roleString,
          currentUserRole,
          requiredRoles,
          roleComparison: {
            includes: requiredRoles.includes(currentUserRole),
            stringToEnum: UserRole[roleString as keyof typeof UserRole],
            adminEnum: UserRole.ADMIN,
            equality: currentUserRole === UserRole.ADMIN,
          },
        });
      } catch (error) {
        setDebugInfo({ error: error.message });
      } finally {
        setLoading(false);
      }
    };

    void checkAuth();
  }, []);

  if (loading) {
    return <div className="p-8">Loading debug info...</div>;
  }

  return (
    <div className="mx-auto max-w-4xl p-8">
      <h1 className="mb-4 text-2xl font-bold">Auth Debug Information</h1>
      <pre className="overflow-auto rounded bg-gray-100 p-4 text-sm">
        {JSON.stringify(debugInfo, null, 2)}
      </pre>
    </div>
  );
}

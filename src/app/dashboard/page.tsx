"use client";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/auth/login");
    }
  }, [session, isPending, router]);

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push("/auth/login");
  };

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Welcome to QuickCourt</h1>
            <p className="text-muted-foreground mt-2">
              Manage your court bookings and sports activities
            </p>
          </div>
          <Button onClick={handleSignOut} variant="outline">
            Sign Out
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* User Profile Card */}
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">Profile</h2>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                {session.user.image ? (
                  <img
                    src={session.user.image}
                    alt="Avatar"
                    className="h-12 w-12 rounded-full border object-cover"
                  />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200">
                    <span className="font-medium text-gray-600">
                      {session.user.name?.charAt(0)?.toUpperCase() || "U"}
                    </span>
                  </div>
                )}
                <div>
                  <p className="font-medium">{session.user.name || "User"}</p>
                  <p className="text-muted-foreground text-sm">
                    {session.user.email}
                  </p>
                </div>
              </div>
              <div className="mt-4 space-y-1">
                <p className="text-sm">
                  <span className="font-medium">Email Verified:</span>{" "}
                  {session.user.emailVerified ? "Yes" : "No"}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Account Created:</span>{" "}
                  {new Date(session.user.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">Quick Actions</h2>
            <div className="space-y-3">
              <Button className="w-full" variant="outline">
                Book a Court
              </Button>
              <Button className="w-full" variant="outline">
                View Bookings
              </Button>
              <Button className="w-full" variant="outline">
                Find Players
              </Button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">Recent Activity</h2>
            <div className="text-muted-foreground space-y-3 text-sm">
              <p>No recent activity yet</p>
              <p>Start by booking your first court!</p>
            </div>
          </div>
        </div>

        {/* Session Debug Info (Development Only) */}
        {process.env.NODE_ENV === "development" && (
          <div className="mt-8 rounded-lg bg-gray-100 p-4">
            <h3 className="mb-2 font-medium">Session Debug Info:</h3>
            <pre className="overflow-auto text-xs">
              {JSON.stringify(session, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

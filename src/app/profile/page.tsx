"use client";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProfilePage() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/auth/login");
    }
  }, [session, isPending, router]);

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
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-8 text-3xl font-bold">Profile</h1>

        <Card>
          <CardHeader>
            <CardTitle>User Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage
                  src={session.user.image ?? ""}
                  alt={session.user.name ?? "User"}
                />
                <AvatarFallback className="text-xl">
                  {session.user.name?.charAt(0)?.toUpperCase() ?? "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold">
                  {session.user.name ?? "User"}
                </h2>
                <p className="text-muted-foreground">{session.user.email}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Email Verified</label>
                <p className="text-muted-foreground text-sm">
                  {session.user.emailVerified ? "Yes" : "No"}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium">Account Created</label>
                <p className="text-muted-foreground text-sm">
                  {new Date(session.user.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() => router.push("/dashboard")}
              >
                Back to Dashboard
              </Button>
              <Button variant="outline" disabled>
                Edit Profile (Coming Soon)
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

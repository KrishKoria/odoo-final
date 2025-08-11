import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    console.log("Debug API - Session:", session);

    if (!session?.user) {
      return NextResponse.json({ error: "No session" }, { status: 401 });
    }

    // Fetch the user's player profile with role information
    const playerProfile = await prisma.playerProfile.findUnique({
      where: { userId: session.user.id },
      select: {
        id: true,
        role: true,
        phoneNumber: true,
        isActive: true,
        isBanned: true,
        bannedUntil: true,
      },
    });

    console.log("Debug API - Player Profile:", playerProfile);

    return NextResponse.json({
      user: session.user,
      profile: playerProfile,
      hasSession: !!session,
      hasUser: !!session?.user,
      userRole: playerProfile?.role || "USER",
    });
  } catch (error) {
    console.error("Debug API error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error },
      { status: 500 },
    );
  }
}

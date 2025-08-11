/* eslint-disable @typescript-eslint/no-unsafe-call */
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Validation schema for profile updates
const updateProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  email: z.string().email("Invalid email address").optional(),
  phoneNumber: z.string().optional(),
  oldPassword: z.string().optional(),
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .optional(),
});

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch the user's phone number from PlayerProfile
    let playerProfile;
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      playerProfile = await prisma.playerProfile.findUnique({
        where: { userId: session.user.id },
        select: { phoneNumber: true },
      });
    } catch (error) {
      console.error("Error fetching player profile:", error);
      playerProfile = null;
    }

    return NextResponse.json({
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      phoneNumber: playerProfile?.phoneNumber ?? null,
    });
  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    // Check authentication
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as unknown;
    const validatedData = updateProfileSchema.parse(body);

    // Start building the update object
    const updateData: { name?: string; email?: string } = {};

    // Handle basic profile fields
    if (validatedData.name) {
      updateData.name = validatedData.name;
    }

    if (validatedData.email) {
      updateData.email = validatedData.email;
    }

    // Handle password change
    if (validatedData.oldPassword && validatedData.newPassword) {
      // In a real app, you would:
      // 1. Verify the old password using better-auth
      // 2. Hash the new password
      // 3. Update the password in the Account table
      console.log("Password change requested - implement with better-auth");
    }

    // Update user in database
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
    });

    // Handle PlayerProfile updates
    if (validatedData.phoneNumber !== undefined) {
      await prisma.playerProfile.upsert({
        where: { userId: session.user.id },
        update: { phoneNumber: validatedData.phoneNumber },
        create: {
          userId: session.user.id,
          phoneNumber: validatedData.phoneNumber,
        },
      });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        image: updatedUser.image,
      },
    });
  } catch (error) {
    console.error("Profile update error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.errors },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { uploadAvatar, validateAvatarFile } from "@/lib/avatar-upload";

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

    // Fetch the user's player profile with role information
    let playerProfile;
    try {
      playerProfile = await prisma.playerProfile.findUnique({
        where: { userId: session.user.id },
        select: {
          id: true,
          role: true,
          phoneNumber: true,
          avatar: true,
          isActive: true,
          isBanned: true,
          bannedUntil: true,
          createdAt: true,
          updatedAt: true,
        },
      });
    } catch (error) {
      console.error("Error fetching player profile:", error);
      playerProfile = null;
    }

    // Check if user is banned
    if (playerProfile?.isBanned) {
      const now = new Date();
      if (playerProfile.bannedUntil && playerProfile.bannedUntil > now) {
        return NextResponse.json(
          {
            error: "Account suspended",
            bannedUntil: playerProfile.bannedUntil.toISOString(),
          },
          { status: 403 },
        );
      }
    }

    return NextResponse.json({
      id: playerProfile?.id ?? null,
      role: playerProfile?.role ?? "USER",
      phoneNumber: playerProfile?.phoneNumber ?? null,
      avatar: playerProfile?.avatar ?? null,
      isActive: playerProfile?.isActive ?? true,
      user: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        emailVerified: session.user.emailVerified,
        image: session.user.image,
      },
      createdAt: playerProfile?.createdAt?.toISOString() ?? null,
      updatedAt: playerProfile?.updatedAt?.toISOString() ?? null,
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

    const contentType = request.headers.get("content-type");
    let validatedData;
    let avatarFile: File | null = null;

    if (contentType?.includes("multipart/form-data")) {
      // Handle file upload
      const formData = await request.formData();

      // Extract avatar file if present
      const avatar = formData.get("avatar") as File | null;
      if (avatar && avatar.size > 0) {
        avatarFile = avatar;
      }

      // Extract other form fields
      const profileData = {
        name: (formData.get("name") as string) || undefined,
        email: (formData.get("email") as string) || undefined,
        phoneNumber: (formData.get("phoneNumber") as string) || undefined,
        oldPassword: (formData.get("oldPassword") as string) || undefined,
        newPassword: (formData.get("newPassword") as string) || undefined,
      };

      // Remove empty fields
      Object.keys(profileData).forEach((key) => {
        if (!profileData[key as keyof typeof profileData]) {
          delete profileData[key as keyof typeof profileData];
        }
      });

      validatedData = updateProfileSchema.parse(profileData);
    } else {
      // Handle JSON data (existing flow)
      const body = (await request.json()) as unknown;
      validatedData = updateProfileSchema.parse(body);
    }

    // Start building the update object
    const updateData: { name?: string; email?: string; image?: string } = {};

    // Handle avatar upload
    if (avatarFile) {
      try {
        // Validate the avatar file
        const validationError = validateAvatarFile(avatarFile);
        if (validationError) {
          return NextResponse.json({ error: validationError }, { status: 400 });
        }

        // Upload the avatar
        const uploadedFile = await uploadAvatar(avatarFile);
        updateData.image = uploadedFile.url;
      } catch (error) {
        console.error("Error processing avatar:", error);
        return NextResponse.json(
          { error: "Failed to process avatar image" },
          { status: 400 },
        );
      }
    }

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

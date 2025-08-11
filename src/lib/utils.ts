import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { prisma } from "./prisma";
import { tryCatch } from "./trycatch";
import type { UserRole } from "@/generated/prisma";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Utility function to create player profile for new users
export async function createPlayerProfile(
  userId: string,
  userData?: { image?: string | null; name?: string },
  role: UserRole = "USER",
): Promise<{ success: boolean; error?: string }> {
  const { error } = await tryCatch(
    prisma.playerProfile.upsert({
      where: { userId },
      update: {
        // Only update if needed - avoid unnecessary writes
        ...(userData?.image !== undefined && { avatar: userData.image }),
        role, // Update role if user already exists
        isActive: true, // Reactivate if user returns
      },
      create: {
        userId,
        role, // Use the provided role instead of hardcoded "USER"
        avatar: userData?.image ?? null,
        isActive: true,
        isBanned: false,
      },
      // Select only what you need - avoid SELECT *
      select: {
        id: true,
        userId: true,
        role: true,
        isActive: true,
      },
    }),
  );

  if (error) {
    // Structured error logging for better monitoring
    console.error("Failed to create player profile:", {
      userId,
      role,
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to create player profile",
    };
  }
  return { success: true };
}

/* eslint-disable @typescript-eslint/no-unused-vars */
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { prisma } from "./prisma";
import { tryCatch } from "./trycatch";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Utility function to create player profile for new users
export async function createPlayerProfile(
  userId: string,
  userData?: { image?: string | null; name?: string },
): Promise<{ success: boolean; error?: string }> {
  const { error } = await tryCatch(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-call
    prisma.playerProfile.upsert({
      where: { userId },
      update: {
        // Only update if needed - avoid unnecessary writes
        ...(userData?.image !== undefined && { avatar: userData.image }),
        isActive: true, // Reactivate if user returns
      },
      create: {
        userId,
        role: "USER",
        avatar: userData?.image ?? null,
        isActive: true,
        isBanned: false,
      },
      // Select only what you need - avoid SELECT *
      select: {
        id: true,
        userId: true,
        isActive: true,
      },
    }),
  );

  console.log(`Player profile handled for user: ${userId}`);
  if (error) {
    // Structured error logging for better monitoring
    console.error("Failed to create player profile:", {
      userId,
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

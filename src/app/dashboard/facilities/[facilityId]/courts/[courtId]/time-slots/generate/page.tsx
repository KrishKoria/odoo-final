import { GenerateTimeSlotsForm } from "@/components/dashboard/generate-time-slots-form";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";

interface PageProps {
  params: Promise<{
    facilityId: string;
    courtId: string;
  }>;
}

export default async function GenerateTimeSlotsPage({ params }: PageProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const { facilityId, courtId } = await params;

  if (!session?.user) {
    redirect("/auth/login");
  }

  // Get the court and verify access
  const court = await prisma.court.findUnique({
    where: { id: courtId },
    include: {
      facility: {
        select: {
          id: true,
          name: true,
          ownerId: true,
        },
      },
    },
  });

  if (!court || court.facilityId !== facilityId) {
    notFound();
  }

  // Check authorization
  const userRole = session.user.role;
  const isOwner = court.facility.ownerId === session.user.id;
  const isAdmin = userRole === "ADMIN";

  if (!isOwner && !isAdmin) {
    redirect("/dashboard");
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Generate Time Slots</h1>
        <p className="text-muted-foreground">
          Bulk generate time slots for {court.name} at {court.facility.name}
        </p>
      </div>

      <GenerateTimeSlotsForm courtId={courtId} facilityId={facilityId} />
    </div>
  );
}

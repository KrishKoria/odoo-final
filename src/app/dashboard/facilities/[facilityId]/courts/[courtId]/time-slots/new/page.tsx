import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect, notFound } from "next/navigation";
import { TimeSlotForm } from "@/components/dashboard/time-slot-form";

interface PageProps {
  params: {
    facilityId: string;
    courtId: string;
  };
}

export default async function NewTimeSlotPage({ params }: PageProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/auth/login");
  }

  // Get the court and verify access
  const court = await prisma.court.findUnique({
    where: { id: params.courtId },
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

  if (!court || court.facilityId !== params.facilityId) {
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
        <h1 className="text-3xl font-bold">Create Time Slot</h1>
        <p className="text-muted-foreground">
          Add a new time slot for {court.name} at {court.facility.name}
        </p>
      </div>

      <TimeSlotForm
        courtId={params.courtId}
        facilityId={params.facilityId}
        isEditing={false}
      />
    </div>
  );
}

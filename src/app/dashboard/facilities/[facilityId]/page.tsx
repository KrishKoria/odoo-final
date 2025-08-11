import { getFacilityById } from "@/actions/facility-actions";
import { FacilityDetails } from "@/components/dashboard/facility-details";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Edit } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

interface FacilityPageProps {
  params: {
    facilityId: string;
  };
}

export default async function FacilityPage({ params }: FacilityPageProps) {
  let facility;

  try {
    facility = await getFacilityById(params.facilityId);
  } catch (error) {
    console.error("Failed to fetch facility:", error);
    notFound();
  }

  if (!facility) {
    notFound();
  }

  return (
    <div className="space-y-6 px-4 lg:px-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/facilities">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Facilities
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {facility.name}
            </h1>
            <p className="text-muted-foreground">{facility.address}</p>
          </div>
        </div>
        <Button asChild>
          <Link href={`/dashboard/facilities/${params.facilityId}/edit`}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Facility
          </Link>
        </Button>
      </div>

      {/* Facility Details */}
      <FacilityDetails facility={facility} />
    </div>
  );
}

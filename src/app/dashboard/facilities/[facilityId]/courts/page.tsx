import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus } from "lucide-react";
import Link from "next/link";

interface CourtsPageProps {
  params: Promise<{
    facilityId: string;
  }>;
}

export default async function CourtsPage({ params }: CourtsPageProps) {
  const { facilityId } = await params;
  return (
    <div className="space-y-6 px-4 lg:px-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/dashboard/facilities/${facilityId}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Facility
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Court Management
            </h1>
            <p className="text-muted-foreground">
              Manage courts, pricing, and availability
            </p>
          </div>
        </div>
        <Button asChild>
          <Link href={`/dashboard/facilities/${facilityId}/courts/new`}>
            <Plus className="mr-2 h-4 w-4" />
            Add Court
          </Link>
        </Button>
      </div>

      {/* Courts List */}
      <div className="rounded-lg border p-6">
        <p className="text-muted-foreground">
          Court management system coming soon...
        </p>
        <p className="mt-2 text-sm text-gray-500">
          This will include court creation, pricing management, and availability
          scheduling.
        </p>
      </div>
    </div>
  );
}

import { AdminKPIs } from "@/components/admin/admin-kpis";
import { AdminCharts } from "@/components/admin/admin-charts";
import {
  getGlobalStats,
  getBookingActivityData,
  getUserRegistrationTrends,
  getFacilityApprovalTrends,
  getMostActiveSports,
} from "@/actions/admin-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Shield,
  Users,
  Building2,
  AlertTriangle,
  Settings,
} from "lucide-react";
import Link from "next/link";

export default async function AdminPage() {
  // Fetch all data in parallel for better performance
  const [
    stats,
    bookingActivity,
    userRegistrations,
    facilityApprovals,
    activeSports,
  ] = await Promise.all([
    getGlobalStats(),
    getBookingActivityData(),
    getUserRegistrationTrends(),
    getFacilityApprovalTrends(),
    getMostActiveSports(),
  ]);

  return (
    <div className="space-y-6 px-4 lg:px-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-3xl font-bold tracking-tight">
            <Shield className="h-8 w-8 text-blue-600" />
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">
            System-wide overview and management tools
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline">
            <Link href="/admin/users">
              <Users className="mr-2 h-4 w-4" />
              Manage Users
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/facilities">
              <Building2 className="mr-2 h-4 w-4" />
              Facility Approvals
              {stats.pendingFacilities > 0 && (
                <span className="ml-1 rounded-full bg-orange-500 px-2 py-0.5 text-xs text-white">
                  {stats.pendingFacilities}
                </span>
              )}
            </Link>
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <AdminKPIs stats={stats} />

      {/* Charts Section */}
      <AdminCharts
        bookingActivity={bookingActivity}
        userRegistrations={userRegistrations}
        facilityApprovals={facilityApprovals}
        activeSports={activeSports}
      />

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              User Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-muted-foreground text-sm">
              Manage user accounts, roles, and permissions
            </p>
            <div className="space-y-2">
              <Button asChild variant="outline" size="sm" className="w-full">
                <Link href="/admin/users">View All Users</Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="w-full">
                <Link href="/admin/users?filter=banned">View Banned Users</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Facility Oversight
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-muted-foreground text-sm">
              Review and approve facility registrations
            </p>
            <div className="space-y-2">
              <Button asChild variant="outline" size="sm" className="w-full">
                <Link href="/admin/facilities">
                  Pending Approvals
                  {stats.pendingFacilities > 0 && (
                    <span className="ml-2 rounded-full bg-orange-500 px-2 py-0.5 text-xs text-white">
                      {stats.pendingFacilities}
                    </span>
                  )}
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="w-full">
                <Link href="/admin/facilities?status=approved">
                  Approved Facilities
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              System Health
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-muted-foreground text-sm">
              Monitor system performance and issues
            </p>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Database Status</span>
                <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-800">
                  Healthy
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">API Response</span>
                <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-800">
                  Fast
                </span>
              </div>
              {stats.pendingFacilities > 5 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm">Approval Queue</span>
                  <span className="rounded-full bg-orange-100 px-2 py-1 text-xs text-orange-800">
                    High Volume
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Alerts */}
      {stats.pendingFacilities > 0 && (
        <Card className="border-orange-200 bg-orange-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <AlertTriangle className="h-5 w-5" />
              Action Required
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-3 text-orange-700">
              {stats.pendingFacilities} facilities are awaiting approval. Review
              them to keep the platform running smoothly.
            </p>
            <Button
              asChild
              size="sm"
              className="bg-orange-600 hover:bg-orange-700"
            >
              <Link href="/admin/facilities">Review Pending Facilities</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

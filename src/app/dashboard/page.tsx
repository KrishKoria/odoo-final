import { DashboardKPIs } from "@/components/dashboard/dashboard-kpis";
import { DashboardCharts } from "@/components/dashboard/dashboard-charts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Settings, Users, Building2 } from "lucide-react";
import Link from "next/link";

export default function Page() {
  return (
    <div className="space-y-6 px-4 lg:px-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your facilities, bookings, and performance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="outline">
            <Link href="/dashboard/facilities">
              <Building2 className="h-4 w-4 mr-2" />
              Manage Facilities
            </Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard/facilities/new">
              <Plus className="h-4 w-4 mr-2" />
              Add Facility
            </Link>
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <DashboardKPIs />

      {/* Charts Section */}
      <DashboardCharts />

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Facilities
            </CardTitle>
            <CardDescription>
              Manage your sports facilities and courts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button asChild variant="outline" size="sm" className="w-full">
              <Link href="/dashboard/facilities">View All Facilities</Link>
            </Button>
            <Button asChild size="sm" className="w-full">
              <Link href="/dashboard/facilities/new">Add New Facility</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Bookings
            </CardTitle>
            <CardDescription>
              View and manage customer bookings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button asChild variant="outline" size="sm" className="w-full">
              <Link href="/dashboard/bookings">View All Bookings</Link>
            </Button>
            <Button asChild size="sm" className="w-full">
              <Link href="/dashboard/time-slots">Manage Time Slots</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Settings
            </CardTitle>
            <CardDescription>
              Update your profile and preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button asChild variant="outline" size="sm" className="w-full">
              <Link href="/dashboard/profile">Edit Profile</Link>
            </Button>
            <Button asChild size="sm" className="w-full">
              <Link href="/dashboard/settings">Account Settings</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

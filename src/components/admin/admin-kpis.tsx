import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Users,
  Building2,
  Calendar,
  Activity,
  AlertTriangle,
} from "lucide-react";

interface AdminKPIsProps {
  stats: {
    totalUsers: number;
    totalFacilityOwners: number;
    totalBookings: number;
    totalActiveCourts: number;
    pendingFacilities: number;
  };
}

export function AdminKPIs({ stats }: AdminKPIsProps) {
  const kpis = [
    {
      title: "Total Users",
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      description: "Registered users",
      trend: "+12% from last month",
    },
    {
      title: "Facility Owners",
      value: stats.totalFacilityOwners.toLocaleString(),
      icon: Building2,
      description: "Active facility owners",
      trend: "+8% from last month",
    },
    {
      title: "Total Bookings",
      value: stats.totalBookings.toLocaleString(),
      icon: Calendar,
      description: "All-time bookings",
      trend: "+23% from last month",
    },
    {
      title: "Active Courts",
      value: stats.totalActiveCourts.toLocaleString(),
      icon: Activity,
      description: "Available courts",
      trend: "+5% from last month",
    },
    {
      title: "Pending Approvals",
      value: stats.pendingFacilities.toLocaleString(),
      icon: AlertTriangle,
      description: "Facilities awaiting approval",
      trend:
        stats.pendingFacilities > 0 ? "Requires attention" : "All caught up!",
      urgent: stats.pendingFacilities > 0,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      {kpis.map((kpi) => (
        <Card key={kpi.title} className={kpi.urgent ? "border-orange-200" : ""}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
            <kpi.icon
              className={`h-4 w-4 ${kpi.urgent ? "text-orange-600" : "text-muted-foreground"}`}
            />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${kpi.urgent ? "text-orange-600" : ""}`}
            >
              {kpi.value}
            </div>
            <p className="text-muted-foreground text-xs">{kpi.description}</p>
            <p
              className={`mt-1 text-xs ${kpi.urgent ? "text-orange-600" : "text-green-600"}`}
            >
              {kpi.trend}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

import { StatsCards } from "@/features/dashboard/components/StatsCards"
import { VisitorsChart } from "@/features/dashboard/components/VisitorsChart"
import { RecentBookingsList } from "@/features/dashboard/components/RecentBookingsList"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <StatsCards />
      <VisitorsChart />
      <RecentBookingsList />
    </div>
  )
}
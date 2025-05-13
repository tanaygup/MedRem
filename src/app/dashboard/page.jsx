import DashboardLayout from "@/components/dashboard/dash-layout";
import MedicationOverview from "@/components/dashboard/medOverview";
import UpcomingAppointments from "@/components/dashboard/upcomingAppts";
import CompletionRateChart from "@/components/dashboard/completion_chart";
import HealthMetrics from "@/components/dashboard/healthmetrics";
import RecentActivity from "@/components/dashboard/recentAct";
import MedicationSchedule from "@/components/dashboard/medSchedule";

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <MedicationOverview />
        </div>
        <div>
          <UpcomingAppointments />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <CompletionRateChart />
        {/* <HealthMetrics /> */}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="md:col-span-2">
          <MedicationSchedule />
        </div>
        <div>
          <RecentActivity />
        </div>
      </div>
    </DashboardLayout>
  );
}

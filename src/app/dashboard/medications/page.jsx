import DashboardLayout from "@/components/dashboard/dash-layout";
import MedicationCalendar from "@/components/medications/medCalendar";
// import MedicationWeekView from "@/components/medications/medication-week-view";
// import MedicationList from "@/components/medications/medication-list";
// import MedicationStats from "@/components/medications/medication-stats";
// import RefillReminders from "@/components/medications/refill-reminders";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, ListFilter, PieChart } from "lucide-react";

export default function MedicationsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Medications</h1>
          <p className="text-muted-foreground">
            Manage your medications, schedule, and track your adherence.
          </p>
        </div>

        <Tabs defaultValue="calendar" className="space-y-4">
          <TabsList>
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Calendar View</span>
            </TabsTrigger>
            <TabsTrigger value="list" className="flex items-center gap-2">
              <ListFilter className="h-4 w-4" />
              <span>Medication List</span>
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center gap-2">
              <PieChart className="h-4 w-4" />
              <span>Statistics</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calendar" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <MedicationCalendar />
              </div>
              {/* <div>
                <RefillReminders />
              </div> */}
            </div>
            {/* <MedicationWeekView /> */}
          </TabsContent>

          <TabsContent value="list">
            {/* <MedicationList /> */}Meds List{" "}
          </TabsContent>

          <TabsContent value="stats">
            {/* <MedicationStats /> */}Meds Stats
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CheckCircle,
  AlertCircle,
  CalendarPlus,
  Pill,
  RefreshCw,
} from "lucide-react";

export default function RecentActivity() {
  // Mock data
  const activities = [
    {
      id: 1,
      type: "medication-taken",
      title: "Lisinopril taken",
      description: "10mg - Morning dose",
      time: "Today, 8:05 AM",
      icon: CheckCircle,
      iconColor: "text-green-600",
      iconBg: "bg-green-100",
    },
    {
      id: 2,
      type: "appointment-added",
      title: "New appointment added",
      description: "Dr. Sarah Johnson - Cardiologist",
      time: "Today, 9:30 AM",
      icon: CalendarPlus,
      iconColor: "text-purple-600",
      iconBg: "bg-purple-100",
    },
    {
      id: 3,
      type: "medication-missed",
      title: "Metformin missed",
      description: "500mg - Afternoon dose",
      time: "Yesterday, 1:30 PM",
      icon: AlertCircle,
      iconColor: "text-red-600",
      iconBg: "bg-red-100",
    },
    {
      id: 4,
      type: "medication-added",
      title: "New medication added",
      description: "Vitamin D - 1000 IU daily",
      time: "Yesterday, 10:15 AM",
      icon: Pill,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-100",
    },
    {
      id: 5,
      type: "prescription-refill",
      title: "Prescription refill reminder",
      description: "Atorvastatin - 7 days remaining",
      time: "Yesterday, 9:00 AM",
      icon: RefreshCw,
      iconColor: "text-amber-600",
      iconBg: "bg-amber-100",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Recent Activity</CardTitle>
        <CardDescription>
          Your latest medication and health activities
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex gap-3">
              <div
                className={`p-2 rounded-full h-8 w-8 flex items-center justify-center ${activity.iconBg} ${activity.iconColor} shrink-0`}
              >
                <activity.icon className="h-4 w-4" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-medium">{activity.title}</h4>
                <p className="text-xs text-muted-foreground">
                  {activity.description}
                </p>
                <p className="text-xs text-gray-400">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

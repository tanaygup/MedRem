"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CalendarClock, MapPin, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function UpcomingAppointments() {
  const router= useRouter();
  const apps = [
    {
      id: 1,
      doctor: "Dr. Sarah Johnson",
      status: "Completed",
      date: "May 15, 2025",
      time: "10:30 AM",
      location: "Heart Care Center",
    },
    {
      id: 2,
      doctor: "Dr. Michael Chen",
      status: "Pending",
      date: "May 22, 2025",
      time: "2:15 PM",
      location: "Diabetes Care Clinic",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Upcoming Appointments</CardTitle>
        <CardDescription>Your scheduled doctor visits</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {apps.map((appointment) => (
            <div
              key={appointment.id}
              className="p-3 rounded-lg border bg-card hover:bg-accent/10 transition-colors"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="p-2 rounded-full bg-purple-100 text-purple-600">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-medium">{appointment.doctor}</h4>
                  <p className="text-sm text-muted-foreground">
                    {appointment.specialty}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="flex items-center gap-1.5 text-sm">
                  <CalendarClock className="h-3.5 w-3.5 text-gray-500" />
                  <span>{appointment.date}</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm">
                  <CalendarClock className="h-3.5 w-3.5 text-gray-500" />
                  <span>{appointment.time}</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-sm mb-3">
                <MapPin className="h-3.5 w-3.5 text-gray-500" />
                <span>{appointment.location}</span>
              </div>

              <div className="flex gap-2 items-center justify-center">
                <Button variant="outline" size="sm" className="w-auto">
                  Reschedule
                </Button>
                <Button size="sm" className="w-auto">
                  Details
                </Button>
              </div>
            </div>
          ))}
        </div>

        <Button variant="outline" className="w-full mt-4 hover:cursor-pointer"
        onClick={() => router.push("/dashboard/appointments/schedule-appointment")}
        >
          <CalendarClock className="mr-2 h-4 w-4" />
          Schedule New Appointment
        </Button>
      </CardContent>
    </Card>
  );
}

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Pill, Clock } from "lucide-react";

export default function MedicationSchedule() {
  // Mock data
  const weeklySchedule = [
    {
      day: "Monday",
      medications: [
        { id: 1, name: "Lisinopril", dosage: "10mg", time: "8:00 AM" },
        { id: 2, name: "Metformin", dosage: "500mg", time: "1:00 PM" },
        { id: 3, name: "Atorvastatin", dosage: "20mg", time: "8:00 PM" },
      ],
    },
    {
      day: "Tuesday",
      medications: [
        { id: 1, name: "Lisinopril", dosage: "10mg", time: "8:00 AM" },
        { id: 2, name: "Metformin", dosage: "500mg", time: "1:00 PM" },
        { id: 3, name: "Atorvastatin", dosage: "20mg", time: "8:00 PM" },
      ],
    },
    {
      day: "Wednesday",
      medications: [
        { id: 1, name: "Lisinopril", dosage: "10mg", time: "8:00 AM" },
        { id: 2, name: "Metformin", dosage: "500mg", time: "1:00 PM" },
        { id: 3, name: "Atorvastatin", dosage: "20mg", time: "8:00 PM" },
        { id: 4, name: "Vitamin D", dosage: "1000 IU", time: "8:00 AM" },
      ],
    },
    {
      day: "Thursday",
      medications: [
        { id: 1, name: "Lisinopril", dosage: "10mg", time: "8:00 AM" },
        { id: 2, name: "Metformin", dosage: "500mg", time: "1:00 PM" },
        { id: 3, name: "Atorvastatin", dosage: "20mg", time: "8:00 PM" },
      ],
    },
    {
      day: "Friday",
      medications: [
        { id: 1, name: "Lisinopril", dosage: "10mg", time: "8:00 AM" },
        { id: 2, name: "Metformin", dosage: "500mg", time: "1:00 PM" },
        { id: 3, name: "Atorvastatin", dosage: "20mg", time: "8:00 PM" },
      ],
    },
    {
      day: "Saturday",
      medications: [
        { id: 1, name: "Lisinopril", dosage: "10mg", time: "8:00 AM" },
        { id: 3, name: "Atorvastatin", dosage: "20mg", time: "8:00 PM" },
      ],
    },
    {
      day: "Sunday",
      medications: [
        { id: 1, name: "Lisinopril", dosage: "10mg", time: "8:00 AM" },
        { id: 3, name: "Atorvastatin", dosage: "20mg", time: "8:00 PM" },
      ],
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Weekly Medication Schedule</CardTitle>
        <CardDescription>Your medication plan for the week</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="Monday">
          <TabsList className="mb-4 grid grid-cols-7 h-auto">
            {weeklySchedule.map((day) => (
              <TabsTrigger
                key={day.day}
                value={day.day}
                className="text-xs py-1.5"
              >
                {day.day.substring(0, 3)}
                <Badge className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-[10px]">
                  {day.medications.length}
                </Badge>
              </TabsTrigger>
            ))}
          </TabsList>

          {weeklySchedule.map((day) => (
            <TabsContent key={day.day} value={day.day}>
              <div className="space-y-3">
                {day.medications.map((med) => (
                  <div
                    key={med.id}
                    className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/10 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-blue-100 text-blue-600">
                        <Pill className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="font-medium">{med.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {med.dosage}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 text-sm font-medium">
                        <Clock className="h-3.5 w-3.5 text-gray-500" />
                        {med.time}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pill, Clock, CheckCircle, AlertCircle } from "lucide-react";

export default function MedicationOverview() {
  // Mock data
  const medications = [
    {
      id: 1,
      name: "Lisinopril",
      dosage: "10mg",
      time: "8:00 AM",
      status: "taken",
    },
    {
      id: 2,
      name: "Metformin",
      dosage: "500mg",
      time: "1:00 PM",
      status: "upcoming",
    },
    {
      id: 3,
      name: "Atorvastatin",
      dosage: "20mg",
      time: "8:00 PM",
      status: "upcoming",
    },
    {
      id: 4,
      name: "Aspirin",
      dosage: "81mg",
      time: "8:00 AM",
      status: "taken",
    },
  ];

  const stats = {
    total: 4,
    taken: 2,
    upcoming: 2,
    missed: 0,
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex flex-col gap-4 justify-between">
          <div className="flex flex-row gap-2">
          <div>
            <CardTitle className="text-xl">Today's Medications</CardTitle>
            <CardDescription>
              Track your daily medication schedule
            </CardDescription>
          </div>
          </div>
          <div className="flex gap-2">
            <Badge
              variant="outline"
              className="bg-green-50 text-green-700 hover:bg-green-100"
            >
              <CheckCircle className="mr-1 h-3 w-3" /> {stats.taken} Taken
            </Badge>
            <Badge
              variant="outline"
              className="bg-blue-50 text-blue-700 hover:bg-blue-100"
            >
              <Clock className="mr-1 h-3 w-3" /> {stats.upcoming} Upcoming
            </Badge>
            <Badge
              variant="outline"
              className="bg-red-50 text-red-700 hover:bg-red-100"
            >
              <AlertCircle className="mr-1 h-3 w-3" /> {stats.missed} Missed
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {medications.map((med) => (
            <div
              key={med.id}
              className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/10 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-full ${
                    med.status === "taken"
                      ? "bg-green-100 text-green-600"
                      : med.status === "upcoming"
                      ? "bg-blue-100 text-blue-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  <Pill className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-medium">{med.name}</h4>
                  <p className="text-sm text-muted-foreground">{med.dosage}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="flex items-center gap-1 text-sm font-medium">
                    <Clock className="h-3.5 w-3.5 text-gray-500" />
                    {med.time}
                  </div>
                </div>

                {med.status === "taken" ? (
                  <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                ) : (
                  <button className="h-8 w-8 rounded-full border border-blue-200 bg-blue-50 flex items-center justify-center text-blue-600 hover:bg-blue-100 transition-colors">
                    <CheckCircle className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

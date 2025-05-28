"use client";
import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Calendar } from "../ui/calendar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

function medCalendar() {
  const [addMedicineOpen, setAddMedicineOpen] = useState(false);
  const [date, setDate] = useState(null);

  const medicationDates = [
    new Date(2025, 4, 1),
    new Date(2025, 4, 2),
    new Date(2025, 4, 3),
    new Date(2025, 4, 4),
    new Date(2025, 4, 5),
    new Date(2025, 4, 6),
    new Date(2025, 4, 7),
    new Date(2025, 4, 8),
    new Date(2025, 4, 9),
    new Date(2025, 4, 10),
    new Date(2025, 4, 11),
    new Date(2025, 4, 12),
    new Date(2025, 4, 13),
    new Date(2025, 4, 14),
    new Date(2025, 4, 15),
    new Date(2025, 4, 16),
    new Date(2025, 4, 17),
    new Date(2025, 4, 18),
    new Date(2025, 4, 19),
    new Date(2025, 4, 20),
  ];

  // Mock data for medication counts by date
  const medicationCounts = {
    "2025-05-01": 3,
    "2025-05-02": 3,
    "2025-05-03": 2,
    "2025-05-04": 2,
    "2025-05-05": 4,
    "2025-05-06": 3,
    "2025-05-07": 3,
    "2025-05-08": 3,
    "2025-05-09": 3,
    "2025-05-10": 2,
    "2025-05-11": 2,
    "2025-05-12": 4,
    "2025-05-13": 3,
    "2025-05-14": 3,
    "2025-05-15": 3,
    "2025-05-16": 3,
    "2025-05-17": 2,
    "2025-05-18": 2,
    "2025-05-19": 4,
    "2025-05-20": 3,
  };

  const getMedicationCount = (date) => {
    const dateString = date.toISOString().split("T")[0];
    return medicationCounts[dateString] || 0;
  };

  // Function to render calendar day content
  const renderDay = (day) => {
    const count = getMedicationCount(day);
    if (count === 0) return null;

    return (
      <Badge
        variant="secondary"
        className="absolute bottom-1 right-1 h-4 w-4 p-0 flex items-center justify-center text-[10px]"
      >
        {count}
      </Badge>
    );
  };

  // Function to navigate to today
  const goToToday = () => {
    setDate(new Date());
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-xl">Medication Calendar</CardTitle>
          <CardDescription>
            Schedule and view your medications by date
          </CardDescription>
        </div>
        <Button
          onClick={() => setAddMedicineOpen(true)}
          size="sm"
          className="flex items-center gap-1"
        >
          <Plus className="h-4 w-4" />
          Add Medication
        </Button>
      </CardHeader>

      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <Button variant="outline" size="sm" onClick={goToToday}>
            Today
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="h-8 w-8">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border"
          components={{
            DayContent: (props) => (
              <div className="relative h-9 w-9 p-0 font-normal aria-selected:opacity-100">
                <span className="flex h-full w-full items-center justify-center">
                  {props.day}
                </span>
                {renderDay(props.date)}
              </div>
            ),
          }}
        />
        {date && (
          <div className="mt-6">
            <h3 className="font-medium text-sm mb-2">
              Medications for{" "}
              {date.toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </h3>
            <div className="space-y-2">
              {getMedicationCount(date) > 0 ? (
                Array.from({ length: getMedicationCount(date) }).map((_, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center p-2 bg-gray-50 rounded-md"
                  >
                    <div>
                      {/* <p className="font-medium">
                        {
                          [
                            "Lisinopril",
                            "Metformin",
                            "Atorvastatin",
                            "Aspirin",
                          ][i % 4]
                        }
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {["10mg", "500mg", "20mg", "81mg"][i % 4]} -{" "}
                        {["Morning", "Afternoon", "Evening", "Bedtime"][i % 4]}
                      </p> */}
                    </div>
                    <p>Here we will display all the medicines for this date</p>
                    <Badge variant={i % 2 === 0 ? "success" : "outline"}>
                      {i % 2 === 0 ? "Taken" : "Pending"}
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  No medications scheduled for this date.
                </p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default medCalendar;

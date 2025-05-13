"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function CompletionRateChart() {
  const weeklyData = [
    { name: "Mon", completed: 100, missed: 0 },
    { name: "Tue", completed: 100, missed: 0 },
    { name: "Wed", completed: 75, missed: 25 },
    { name: "Thu", completed: 100, missed: 0 },
    { name: "Fri", completed: 50, missed: 50 },
    { name: "Sat", completed: 100, missed: 0 },
    { name: "Sun", completed: 100, missed: 0 },
  ];

  const monthlyData = [
    { name: "Week 1", completed: 95, missed: 5 },
    { name: "Week 2", completed: 90, missed: 10 },
    { name: "Week 3", completed: 85, missed: 15 },
    { name: "Week 4", completed: 89, missed: 11 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Medication Adherence</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="weekly" className="w-full">
          <TabsList>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
          </TabsList>

          <TabsContent value="weekly">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData} stackOffset="expand" barSize={40}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => `${value}%`} />
                  <Tooltip />
                  <Bar dataKey="completed" stackId="a" fill="#4ade80" />
                  <Bar dataKey="missed" stackId="a" fill="#f87171" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="monthly">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData} stackOffset="expand" barSize={40}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => `${value}%`} />
                  <Tooltip />
                  <Bar dataKey="completed" stackId="a" fill="#4ade80" />
                  <Bar dataKey="missed" stackId="a" fill="#f87171" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

// "use client";

// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import {
//   Chart,
//   ChartContainer,
//   ChartTooltip,
//   ChartTooltipContent,
//   ChartLegend,
//   ChartLegendItem,
// } from "@/components/ui/chart";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   ResponsiveContainer,
// } from "recharts";

// export default function HealthMetrics() {
//   // Mock data
//   const bloodPressureData = [
//     { date: "May 1", systolic: 125, diastolic: 82 },
//     { date: "May 3", systolic: 128, diastolic: 84 },
//     { date: "May 5", systolic: 130, diastolic: 85 },
//     { date: "May 7", systolic: 127, diastolic: 83 },
//     { date: "May 9", systolic: 124, diastolic: 80 },
//     { date: "May 11", systolic: 126, diastolic: 81 },
//     { date: "May 13", systolic: 123, diastolic: 79 },
//   ];

//   const glucoseData = [
//     { date: "May 1", level: 110 },
//     { date: "May 3", level: 115 },
//     { date: "May 5", level: 108 },
//     { date: "May 7", level: 112 },
//     { date: "May 9", level: 105 },
//     { date: "May 11", level: 107 },
//     { date: "May 13", level: 103 },
//   ];

//   return (
//     <Card>
//       <CardHeader className="pb-2">
//         <CardTitle className="text-xl">Health Metrics</CardTitle>
//         <CardDescription>Track your vital health measurements</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <Tabs defaultValue="bp">
//           <TabsList className="mb-4">
//             <TabsTrigger value="bp">Blood Pressure</TabsTrigger>
//             <TabsTrigger value="glucose">Blood Glucose</TabsTrigger>
//           </TabsList>

//           <TabsContent value="bp" className="h-[250px]">
//             <Chart>
//               <ChartContainer>
//                 <ResponsiveContainer width="100%" height="100%">
//                   <LineChart
//                     data={bloodPressureData}
//                     margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
//                   >
//                     <CartesianGrid strokeDasharray="3 3" vertical={false} />
//                     <XAxis dataKey="date" tickLine={false} axisLine={false} />
//                     <YAxis
//                       tickLine={false}
//                       axisLine={false}
//                       domain={["dataMin - 10", "dataMax + 10"]}
//                     />
//                     <ChartTooltip
//                       content={({ active, payload }) => {
//                         if (active && payload && payload.length) {
//                           return (
//                             <ChartTooltipContent>
//                               <div className="font-medium">
//                                 {payload[0].payload.date}
//                               </div>
//                               <div className="flex items-center">
//                                 <div className="h-2 w-2 rounded-full bg-red-500 mr-1" />
//                                 <span>Systolic: {payload[0].value} mmHg</span>
//                               </div>
//                               <div className="flex items-center">
//                                 <div className="h-2 w-2 rounded-full bg-blue-500 mr-1" />
//                                 <span>Diastolic: {payload[1].value} mmHg</span>
//                               </div>
//                             </ChartTooltipContent>
//                           );
//                         }
//                         return null;
//                       }}
//                     />
//                     <Line
//                       type="monotone"
//                       dataKey="systolic"
//                       stroke="#ef4444"
//                       strokeWidth={2}
//                       dot={{ r: 4 }}
//                       activeDot={{ r: 6 }}
//                     />
//                     <Line
//                       type="monotone"
//                       dataKey="diastolic"
//                       stroke="#3b82f6"
//                       strokeWidth={2}
//                       dot={{ r: 4 }}
//                       activeDot={{ r: 6 }}
//                     />
//                   </LineChart>
//                 </ResponsiveContainer>
//               </ChartContainer>
//             </Chart>
//             <ChartLegend className="mt-4 justify-center">
//               <ChartLegendItem color="#ef4444" name="Systolic" />
//               <ChartLegendItem color="#3b82f6" name="Diastolic" />
//             </ChartLegend>
//           </TabsContent>

//           <TabsContent value="glucose" className="h-[250px]">
//             <Chart>
//               <ChartContainer>
//                 <ResponsiveContainer width="100%" height="100%">
//                   <LineChart
//                     data={glucoseData}
//                     margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
//                   >
//                     <CartesianGrid strokeDasharray="3 3" vertical={false} />
//                     <XAxis dataKey="date" tickLine={false} axisLine={false} />
//                     <YAxis
//                       tickLine={false}
//                       axisLine={false}
//                       domain={["dataMin - 10", "dataMax + 10"]}
//                     />
//                     <ChartTooltip
//                       content={({ active, payload }) => {
//                         if (active && payload && payload.length) {
//                           return (
//                             <ChartTooltipContent>
//                               <div className="font-medium">
//                                 {payload[0].payload.date}
//                               </div>
//                               <div className="flex items-center">
//                                 <div className="h-2 w-2 rounded-full bg-purple-500 mr-1" />
//                                 <span>Glucose: {payload[0].value} mg/dL</span>
//                               </div>
//                             </ChartTooltipContent>
//                           );
//                         }
//                         return null;
//                       }}
//                     />
//                     <Line
//                       type="monotone"
//                       dataKey="level"
//                       stroke="#8b5cf6"
//                       strokeWidth={2}
//                       dot={{ r: 4 }}
//                       activeDot={{ r: 6 }}
//                     />
//                   </LineChart>
//                 </ResponsiveContainer>
//               </ChartContainer>
//             </Chart>
//             <ChartLegend className="mt-4 justify-center">
//               <ChartLegendItem color="#8b5cf6" name="Blood Glucose" />
//             </ChartLegend>
//           </TabsContent>
//         </Tabs>
//       </CardContent>
//     </Card>
//   );
// }

// "use client";

// import { useState, useEffect } from "react";
// import { useUser } from "@clerk/nextjs";
// import { useRouter } from "next/navigation";
// import { toast } from "sonner";
// import { format } from "date-fns";
// import { CalendarIcon, Plus, Trash2 } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Calendar } from "@/components/ui/calendar";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Checkbox } from "@/components/ui/checkbox";

// export function AddPrescriptionDialog({ open, onOpenChange }) {
//   const { user } = useUser();
//   const router = useRouter();
//   const [loading, setLoading] = useState(false);
//   const [doctors, setDoctors] = useState([]);
//   const [appointments, setAppointments] = useState([]);
//   const [userId, setUserId] = useState(null);

//   // Form state
//   const [formData, setFormData] = useState({
//     doctorId: "",
//     appointmentId: "",
//     startDate: new Date(),
//     endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
//     processedText: "",
//     medicines: [
//       {
//         medicineName: "",
//         dosage: "",
//         medsLeft: 0,
//         totalDoses: 0,
//         schedule: {
//           morning: false,
//           afternoon: false,
//           evening: false,
//           night: false,
//         },
//       },
//     ],
//   });

//   // Fetch user ID, doctors and appointments on component mount
//   useEffect(() => {
//     const fetchUserData = async () => {
//       if (!user?.id) return;

//       try {
//         // Fetch user data to get userId
//         const userRes = await fetch(`/api/get-user?clerkId=${user.id}`);
//         const userData = await userRes.json();

//         console.log("get-user returned:", userData);
//         if (userRes.ok && typeof userData.userId === "number") {
//           setUserId(userData.userId);
//         } else {
//           toast.error("Unable to retrieve your user record");
//         }
//         // setIsDetailsUpdated(userData.isDetailsUpdated);

//         // Fetch doctors
//         const drRes = await fetch(`/api/doctors/get-doctors`);
//         const drJson = await drRes.json();
//         if (drRes.ok) {
//           // drJson = { doctorData: [...] }
//           setDoctors(Array.isArray(drJson.doctorData) ? drJson.doctorData : []);
//         } else {
//           console.error("Failed loading doctors", drJson);
//         }

//         // Fetch appointments
//         const appointmentsRes = await fetch(
//           `/api/get-appointments?clerkId=${user.id}`
//         );
//         const appointmentsData = await appointmentsRes.json();

//         if (appointmentsRes.ok) {
//           setAppointments(appointmentsData);
//         }
//       } catch (error) {
//         console.error("Error fetching data:", error);
//         toast.error("Failed to load necessary data");
//       }
//     };

//     fetchUserData();
//   }, [user?.id]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleDateChange = (field, date) => {
//     setFormData((prev) => ({
//       ...prev,
//       [field]: date,
//     }));
//   };

//   const handleMedicineChange = (index, field, value) => {
//     setFormData((prev) => {
//       const updatedMedicines = [...prev.medicines];
//       updatedMedicines[index] = {
//         ...updatedMedicines[index],
//         [field]: value,
//       };
//       return {
//         ...prev,
//         medicines: updatedMedicines,
//       };
//     });
//   };

//   const handleScheduleChange = (index, field, checked) => {
//     setFormData((prev) => {
//       const updatedMedicines = [...prev.medicines];
//       updatedMedicines[index] = {
//         ...updatedMedicines[index],
//         schedule: {
//           ...updatedMedicines[index].schedule,
//           [field]: checked,
//         },
//       };
//       return {
//         ...prev,
//         medicines: updatedMedicines,
//       };
//     });
//   };

//   const addMedicine = () => {
//     setFormData((prev) => ({
//       ...prev,
//       medicines: [
//         ...prev.medicines,
//         {
//           medicineName: "",
//           dosage: "",
//           medsLeft: 0,
//           totalDoses: 0,
//           schedule: {
//             morning: false,
//             afternoon: false,
//             evening: false,
//             night: false,
//           },
//         },
//       ],
//     }));
//   };

//   const removeMedicine = (index) => {
//     setFormData((prev) => {
//       const updatedMedicines = [...prev.medicines];
//       updatedMedicines.splice(index, 1);
//       return {
//         ...prev,
//         medicines: updatedMedicines,
//       };
//     });
//   };

//   const calculateTotalDoses = (medicine) => {
//     const { schedule } = medicine;
//     const daysCount =
//       Math.ceil(
//         (formData.endDate - formData.startDate) / (1000 * 60 * 60 * 24)
//       ) + 1;

//     const dosesPerDay = Object.values(schedule).filter(Boolean).length;
//     return daysCount * dosesPerDay;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!userId || !user?.id) {
//       toast.error("User information is missing");
//       return;
//     }

//     if (formData.medicines.some((m) => !m.medicineName || !m.dosage)) {
//       toast.error("Please fill in all medicine details");
//       return;
//     }

//     setLoading(true);

//     try {
//       // Calculate total doses for each medicine
//       const medicinesWithTotalDoses = formData.medicines.map((medicine) => ({
//         ...medicine,
//         totalDoses: calculateTotalDoses(medicine),
//         medsLeft: calculateTotalDoses(medicine),
//       }));

//       // Create prescription
//       const prescriptionPayload = {
//         user_id: userId,
//         clerk_id: user.id,
//         doctor_id: formData.doctorId || null,
//         appointment_id: formData.appointmentId || null,
//         created_at: new Date().toISOString().split("T")[0],
//         start_date: formData.startDate.toISOString().split("T")[0],
//         end_date: formData.endDate.toISOString().split("T")[0],
//         processed_text: formData.processedText,
//       };

//       const prescriptionRes = await fetch("/api/prescription", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(prescriptionPayload),
//       });

//       const prescriptionData = await prescriptionRes.json();

//       if (!prescriptionRes.ok) {
//         throw new Error("Failed to create prescription");
//       }

//       // Add medicines to the prescription
//       for (const medicine of medicinesWithTotalDoses) {
//         const medicinePayload = {
//           prescription_id: prescriptionData.prescriptionId,
//           medicine_name: medicine.medicineName,
//           dosage: medicine.dosage,
//           meds_left: medicine.medsLeft,
//           total_doses_taken: 0,
//           total_doses: medicine.totalDoses,
//         };

//         const medicineRes = await fetch("/api/medicines", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(medicinePayload),
//         });

//         if (!medicineRes.ok) {
//           throw new Error("Failed to add medicine");
//         }

//         // We would also need to create schedules for each medicine, but that's not implemented in this example
//       }

//       toast.success("Prescription added successfully");
//       onOpenChange(false);
//       router.refresh();
//     } catch (error) {
//       console.error("Error submitting prescription:", error);
//       toast.error("Failed to add prescription");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle>Add New Prescription</DialogTitle>
//           <DialogDescription>
//             Enter the details of your prescription and medications.
//           </DialogDescription>
//         </DialogHeader>

//         <form onSubmit={handleSubmit} className="space-y-6 py-4">
//           <div className="grid grid-cols-2 gap-4">
//             {/* Doctor Selection */}
//             <div className="space-y-2">
//               <Label htmlFor="doctorId">Doctor</Label>
//               <Select
//                 value={formData.doctorId}
//                 onValueChange={(value) =>
//                   setFormData((prev) => ({ ...prev, doctorId: value }))
//                 }
//               >
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select a doctor" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="none">None</SelectItem>
//                   {doctors.map((doctor) => (
//                     <SelectItem
//                       key={doctor.doctorId}
//                       value={doctor.doctorId.toString()}
//                     >
//                       {doctor.doctorName}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>

//             {/* Appointment Selection */}
//             <div className="space-y-2">
//               <Label htmlFor="appointmentId">Related Appointment</Label>
//               <Select
//                 value={formData.appointmentId}
//                 onValueChange={(value) =>
//                   setFormData((prev) => ({ ...prev, appointmentId: value }))
//                 }
//               >
//                 <SelectTrigger>
//                   <SelectValue placeholder="Select an appointment" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="none">None</SelectItem>
//                   {appointments.map((appointment) => (
//                     <SelectItem
//                       key={appointment.appointmentId}
//                       value={appointment.appointmentId.toString()}
//                     >
//                       {format(new Date(appointment.appointmentDate), "PPP")}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             {/* Start Date */}
//             <div className="space-y-2">
//               <Label>Start Date</Label>
//               <Popover>
//                 <PopoverTrigger asChild>
//                   <Button
//                     variant="outline"
//                     className="w-full justify-start text-left font-normal"
//                   >
//                     <CalendarIcon className="mr-2 h-4 w-4" />
//                     {formData.startDate ? (
//                       format(formData.startDate, "PPP")
//                     ) : (
//                       <span>Pick a date</span>
//                     )}
//                   </Button>
//                 </PopoverTrigger>
//                 <PopoverContent className="w-auto p-0">
//                   <Calendar
//                     mode="single"
//                     selected={formData.startDate}
//                     onSelect={(date) => handleDateChange("startDate", date)}
//                     initialFocus
//                   />
//                 </PopoverContent>
//               </Popover>
//             </div>

//             {/* End Date */}
//             <div className="space-y-2">
//               <Label>End Date</Label>
//               <Popover>
//                 <PopoverTrigger asChild>
//                   <Button
//                     variant="outline"
//                     className="w-full justify-start text-left font-normal"
//                   >
//                     <CalendarIcon className="mr-2 h-4 w-4" />
//                     {formData.endDate ? (
//                       format(formData.endDate, "PPP")
//                     ) : (
//                       <span>Pick a date</span>
//                     )}
//                   </Button>
//                 </PopoverTrigger>
//                 <PopoverContent className="w-auto p-0">
//                   <Calendar
//                     mode="single"
//                     selected={formData.endDate}
//                     onSelect={(date) => handleDateChange("endDate", date)}
//                     initialFocus
//                   />
//                 </PopoverContent>
//               </Popover>
//             </div>
//           </div>

//           {/* Notes */}
//           <div className="space-y-2">
//             <Label htmlFor="processedText">Notes</Label>
//             <Textarea
//               id="processedText"
//               name="processedText"
//               value={formData.processedText}
//               onChange={handleInputChange}
//               placeholder="Enter any additional notes about the prescription"
//               className="min-h-[100px]"
//             />
//           </div>

//           {/* Medicines Section */}
//           <div className="space-y-4">
//             <div className="flex items-center justify-between">
//               <h3 className="text-lg font-medium">Medicines</h3>
//               <Button
//                 type="button"
//                 onClick={addMedicine}
//                 variant="outline"
//                 size="sm"
//                 className="flex items-center gap-1"
//               >
//                 <Plus className="h-4 w-4" /> Add Medicine
//               </Button>
//             </div>

//             {formData.medicines.map((medicine, index) => (
//               <div
//                 key={index}
//                 className="p-4 border rounded-md space-y-4 bg-gray-50"
//               >
//                 <div className="flex justify-between items-center">
//                   <h4 className="font-medium">Medicine {index + 1}</h4>
//                   {formData.medicines.length > 1 && (
//                     <Button
//                       type="button"
//                       onClick={() => removeMedicine(index)}
//                       variant="ghost"
//                       size="sm"
//                       className="text-red-500 hover:text-red-700 hover:bg-red-50"
//                     >
//                       <Trash2 className="h-4 w-4" />
//                     </Button>
//                   )}
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <Label htmlFor={`medicine-name-${index}`}>Name</Label>
//                     <Input
//                       id={`medicine-name-${index}`}
//                       value={medicine.medicineName}
//                       onChange={(e) =>
//                         handleMedicineChange(
//                           index,
//                           "medicineName",
//                           e.target.value
//                         )
//                       }
//                       placeholder="Medicine name"
//                       required
//                     />
//                   </div>

//                   <div className="space-y-2">
//                     <Label htmlFor={`medicine-dosage-${index}`}>Dosage</Label>
//                     <Input
//                       id={`medicine-dosage-${index}`}
//                       value={medicine.dosage}
//                       onChange={(e) =>
//                         handleMedicineChange(index, "dosage", e.target.value)
//                       }
//                       placeholder="e.g., 10mg, 1 tablet"
//                       required
//                     />
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <Label>Schedule</Label>
//                   <div className="flex flex-wrap gap-4 mt-2">
//                     <div className="flex items-center space-x-2">
//                       <Checkbox
//                         id={`morning-${index}`}
//                         checked={medicine.schedule.morning}
//                         onCheckedChange={(checked) =>
//                           handleScheduleChange(index, "morning", checked)
//                         }
//                       />
//                       <Label
//                         htmlFor={`morning-${index}`}
//                         className="text-sm font-normal"
//                       >
//                         Morning
//                       </Label>
//                     </div>

//                     <div className="flex items-center space-x-2">
//                       <Checkbox
//                         id={`afternoon-${index}`}
//                         checked={medicine.schedule.afternoon}
//                         onCheckedChange={(checked) =>
//                           handleScheduleChange(index, "afternoon", checked)
//                         }
//                       />
//                       <Label
//                         htmlFor={`afternoon-${index}`}
//                         className="text-sm font-normal"
//                       >
//                         Afternoon
//                       </Label>
//                     </div>

//                     <div className="flex items-center space-x-2">
//                       <Checkbox
//                         id={`evening-${index}`}
//                         checked={medicine.schedule.evening}
//                         onCheckedChange={(checked) =>
//                           handleScheduleChange(index, "evening", checked)
//                         }
//                       />
//                       <Label
//                         htmlFor={`evening-${index}`}
//                         className="text-sm font-normal"
//                       >
//                         Evening
//                       </Label>
//                     </div>

//                     <div className="flex items-center space-x-2">
//                       <Checkbox
//                         id={`night-${index}`}
//                         checked={medicine.schedule.night}
//                         onCheckedChange={(checked) =>
//                           handleScheduleChange(index, "night", checked)
//                         }
//                       />
//                       <Label
//                         htmlFor={`night-${index}`}
//                         className="text-sm font-normal"
//                       >
//                         Night
//                       </Label>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>

//           <DialogFooter>
//             <Button
//               type="button"
//               variant="outline"
//               onClick={() => onOpenChange(false)}
//               disabled={loading}
//             >
//               Cancel
//             </Button>
//             <Button type="submit" disabled={loading}>
//               {loading ? "Saving..." : "Save Prescription"}
//             </Button>
//           </DialogFooter>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// }

// "use client";

// import { useState } from "react";
// import { format } from "date-fns";
// import { CalendarIcon, Plus, Trash2, X } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogClose,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Calendar } from "@/components/ui/calendar";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Checkbox } from "@/components/ui/checkbox";
// import { Badge } from "@/components/ui/badge";
// import { Card, CardContent } from "@/components/ui/card";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// export function AddPrescriptionDialog({ open, onOpenChange }) {
//   // Mock data for UI demonstration
//   const mockDoctors = [
//     { id: "1", name: "Dr. Sarah Johnson" },
//     { id: "2", name: "Dr. Michael Chen" },
//     { id: "3", name: "Dr. Emily Rodriguez" },
//   ];

//   const mockAppointments = [
//     { id: "1", date: new Date(2025, 4, 15), doctor: "Dr. Sarah Johnson" },
//     { id: "2", date: new Date(2025, 4, 22), doctor: "Dr. Michael Chen" },
//     { id: "3", date: new Date(2025, 5, 5), doctor: "Dr. Emily Rodriguez" },
//   ];

//   // Form state
//   const [formData, setFormData] = useState({
//     doctorId: "",
//     appointmentId: "",
//     startDate: new Date(),
//     endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
//     processedText: "",
//     medicines: [
//       {
//         medicineName: "",
//         dosage: "",
//         medsLeft: 30,
//         totalDoses: 30,
//         schedule: {
//           morning: false,
//           afternoon: false,
//           evening: false,
//           night: false,
//         },
//         instructions: "",
//       },
//     ],
//   });

//   const handleDateChange = (field, date) => {
//     setFormData((prev) => ({
//       ...prev,
//       [field]: date,
//     }));
//   };

//   const handleMedicineChange = (index, field, value) => {
//     setFormData((prev) => {
//       const updatedMedicines = [...prev.medicines];
//       updatedMedicines[index] = {
//         ...updatedMedicines[index],
//         [field]: value,
//       };
//       return {
//         ...prev,
//         medicines: updatedMedicines,
//       };
//     });
//   };

//   const handleScheduleChange = (index, field, checked) => {
//     setFormData((prev) => {
//       const updatedMedicines = [...prev.medicines];
//       updatedMedicines[index] = {
//         ...updatedMedicines[index],
//         schedule: {
//           ...updatedMedicines[index].schedule,
//           [field]: checked,
//         },
//       };
//       return {
//         ...prev,
//         medicines: updatedMedicines,
//       };
//     });
//   };

//   const addMedicine = () => {
//     setFormData((prev) => ({
//       ...prev,
//       medicines: [
//         ...prev.medicines,
//         {
//           medicineName: "",
//           dosage: "",
//           medsLeft: 30,
//           totalDoses: 30,
//           schedule: {
//             morning: false,
//             afternoon: false,
//             evening: false,
//             night: false,
//           },
//           instructions: "",
//         },
//       ],
//     }));
//   };

//   const removeMedicine = (index) => {
//     setFormData((prev) => {
//       const updatedMedicines = [...prev.medicines];
//       updatedMedicines.splice(index, 1);
//       return {
//         ...prev,
//         medicines: updatedMedicines,
//       };
//     });
//   };

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
//         <DialogHeader className="space-y-3">
//           <div className="flex items-center justify-between">
//             <DialogTitle className="text-2xl font-bold">
//               Add New Prescription
//             </DialogTitle>
//             <DialogClose className="rounded-full hover:bg-gray-100 p-1">
//               <X className="h-5 w-5" />
//               <span className="sr-only">Close</span>
//             </DialogClose>
//           </div>
//           <DialogDescription>
//             Enter prescription details and add medications to your treatment
//             plan
//           </DialogDescription>
//         </DialogHeader>

//         <Tabs defaultValue="details" className="mt-2">
//           <TabsList className="grid w-full grid-cols-2">
//             <TabsTrigger value="details">Prescription Details</TabsTrigger>
//             <TabsTrigger value="medications">Medications</TabsTrigger>
//           </TabsList>

//           <TabsContent value="details" className="space-y-6 py-4">
//             <div className="grid grid-cols-2 gap-4">
//               {/* Doctor Selection */}
//               <div className="space-y-2">
//                 <Label htmlFor="doctorId">Doctor</Label>
//                 <Select
//                   value={formData.doctorId}
//                   onValueChange={(value) =>
//                     setFormData((prev) => ({ ...prev, doctorId: value }))
//                   }
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select a doctor" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="none">None</SelectItem>
//                     {mockDoctors.map((doctor) => (
//                       <SelectItem key={doctor.id} value={doctor.id}>
//                         {doctor.name}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>

//               {/* Appointment Selection */}
//               <div className="space-y-2">
//                 <Label htmlFor="appointmentId">Related Appointment</Label>
//                 <Select
//                   value={formData.appointmentId}
//                   onValueChange={(value) =>
//                     setFormData((prev) => ({ ...prev, appointmentId: value }))
//                   }
//                 >
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select an appointment" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="none">None</SelectItem>
//                     {mockAppointments.map((appointment) => (
//                       <SelectItem key={appointment.id} value={appointment.id}>
//                         {format(appointment.date, "PPP")} - {appointment.doctor}
//                       </SelectItem>
//                     ))}
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//               {/* Start Date */}
//               <div className="space-y-2">
//                 <Label>Start Date</Label>
//                 <Popover>
//                   <PopoverTrigger asChild>
//                     <Button
//                       variant="outline"
//                       className="w-full justify-start text-left font-normal"
//                     >
//                       <CalendarIcon className="mr-2 h-4 w-4" />
//                       {formData.startDate ? (
//                         format(formData.startDate, "PPP")
//                       ) : (
//                         <span>Pick a date</span>
//                       )}
//                     </Button>
//                   </PopoverTrigger>
//                   <PopoverContent className="w-auto p-0">
//                     <Calendar
//                       mode="single"
//                       selected={formData.startDate}
//                       onSelect={(date) => handleDateChange("startDate", date)}
//                       initialFocus
//                     />
//                   </PopoverContent>
//                 </Popover>
//               </div>

//               {/* End Date */}
//               <div className="space-y-2">
//                 <Label>End Date</Label>
//                 <Popover>
//                   <PopoverTrigger asChild>
//                     <Button
//                       variant="outline"
//                       className="w-full justify-start text-left font-normal"
//                     >
//                       <CalendarIcon className="mr-2 h-4 w-4" />
//                       {formData.endDate ? (
//                         format(formData.endDate, "PPP")
//                       ) : (
//                         <span>Pick a date</span>
//                       )}
//                     </Button>
//                   </PopoverTrigger>
//                   <PopoverContent className="w-auto p-0">
//                     <Calendar
//                       mode="single"
//                       selected={formData.endDate}
//                       onSelect={(date) => handleDateChange("endDate", date)}
//                       initialFocus
//                     />
//                   </PopoverContent>
//                 </Popover>
//               </div>
//             </div>

//             {/* Notes */}
//             <div className="space-y-2">
//               <Label htmlFor="processedText">Notes</Label>
//               <Textarea
//                 id="processedText"
//                 value={formData.processedText}
//                 onChange={(e) =>
//                   setFormData((prev) => ({
//                     ...prev,
//                     processedText: e.target.value,
//                   }))
//                 }
//                 placeholder="Enter any additional notes about the prescription"
//                 className="min-h-[120px]"
//               />
//             </div>
//           </TabsContent>

//           <TabsContent value="medications" className="space-y-6 py-4">
//             <div className="flex items-center justify-between">
//               <h3 className="text-lg font-medium">Medications</h3>
//               <Button
//                 onClick={addMedicine}
//                 variant="outline"
//                 size="sm"
//                 className="flex items-center gap-1"
//               >
//                 <Plus className="h-4 w-4" /> Add Medication
//               </Button>
//             </div>

//             <div className="space-y-4">
//               {formData.medicines.map((medicine, index) => (
//                 <Card key={index} className="overflow-hidden">
//                   <div className="bg-gray-50 px-4 py-3 flex justify-between items-center border-b">
//                     <h4 className="font-medium">
//                       {medicine.medicineName
//                         ? medicine.medicineName
//                         : `Medication ${index + 1}`}
//                     </h4>
//                     {formData.medicines.length > 1 && (
//                       <Button
//                         onClick={() => removeMedicine(index)}
//                         variant="ghost"
//                         size="sm"
//                         className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
//                       >
//                         <Trash2 className="h-4 w-4" />
//                         <span className="sr-only">Remove medication</span>
//                       </Button>
//                     )}
//                   </div>
//                   <CardContent className="p-4 space-y-4">
//                     <div className="grid grid-cols-2 gap-4">
//                       <div className="space-y-2">
//                         <Label htmlFor={`medicine-name-${index}`}>Name</Label>
//                         <Input
//                           id={`medicine-name-${index}`}
//                           value={medicine.medicineName}
//                           onChange={(e) =>
//                             handleMedicineChange(
//                               index,
//                               "medicineName",
//                               e.target.value
//                             )
//                           }
//                           placeholder="Medication name"
//                         />
//                       </div>

//                       <div className="space-y-2">
//                         <Label htmlFor={`medicine-dosage-${index}`}>
//                           Dosage
//                         </Label>
//                         <Input
//                           id={`medicine-dosage-${index}`}
//                           value={medicine.dosage}
//                           onChange={(e) =>
//                             handleMedicineChange(
//                               index,
//                               "dosage",
//                               e.target.value
//                             )
//                           }
//                           placeholder="e.g., 10mg, 1 tablet"
//                         />
//                       </div>
//                     </div>

//                     <div className="space-y-2">
//                       <Label>Schedule</Label>
//                       <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2">
//                         <div className="flex items-center space-x-2 bg-gray-50 p-2 rounded-md">
//                           <Checkbox
//                             id={`morning-${index}`}
//                             checked={medicine.schedule.morning}
//                             onCheckedChange={(checked) =>
//                               handleScheduleChange(index, "morning", checked)
//                             }
//                           />
//                           <Label
//                             htmlFor={`morning-${index}`}
//                             className="text-sm font-normal cursor-pointer"
//                           >
//                             Morning
//                           </Label>
//                         </div>

//                         <div className="flex items-center space-x-2 bg-gray-50 p-2 rounded-md">
//                           <Checkbox
//                             id={`afternoon-${index}`}
//                             checked={medicine.schedule.afternoon}
//                             onCheckedChange={(checked) =>
//                               handleScheduleChange(index, "afternoon", checked)
//                             }
//                           />
//                           <Label
//                             htmlFor={`afternoon-${index}`}
//                             className="text-sm font-normal cursor-pointer"
//                           >
//                             Afternoon
//                           </Label>
//                         </div>

//                         <div className="flex items-center space-x-2 bg-gray-50 p-2 rounded-md">
//                           <Checkbox
//                             id={`evening-${index}`}
//                             checked={medicine.schedule.evening}
//                             onCheckedChange={(checked) =>
//                               handleScheduleChange(index, "evening", checked)
//                             }
//                           />
//                           <Label
//                             htmlFor={`evening-${index}`}
//                             className="text-sm font-normal cursor-pointer"
//                           >
//                             Evening
//                           </Label>
//                         </div>

//                         <div className="flex items-center space-x-2 bg-gray-50 p-2 rounded-md">
//                           <Checkbox
//                             id={`night-${index}`}
//                             checked={medicine.schedule.night}
//                             onCheckedChange={(checked) =>
//                               handleScheduleChange(index, "night", checked)
//                             }
//                           />
//                           <Label
//                             htmlFor={`night-${index}`}
//                             className="text-sm font-normal cursor-pointer"
//                           >
//                             Night
//                           </Label>
//                         </div>
//                       </div>
//                     </div>

//                     <div className="space-y-2">
//                       <Label htmlFor={`medicine-instructions-${index}`}>
//                         Special Instructions
//                       </Label>
//                       <Textarea
//                         id={`medicine-instructions-${index}`}
//                         value={medicine.instructions || ""}
//                         onChange={(e) =>
//                           handleMedicineChange(
//                             index,
//                             "instructions",
//                             e.target.value
//                           )
//                         }
//                         placeholder="Any special instructions (e.g., take with food)"
//                         className="min-h-[80px]"
//                       />
//                     </div>

//                     <div className="grid grid-cols-2 gap-4">
//                       <div className="space-y-2">
//                         <Label htmlFor={`medicine-total-${index}`}>
//                           Total Doses
//                         </Label>
//                         <Input
//                           id={`medicine-total-${index}`}
//                           type="number"
//                           min="1"
//                           value={medicine.totalDoses}
//                           onChange={(e) =>
//                             handleMedicineChange(
//                               index,
//                               "totalDoses",
//                               Number.parseInt(e.target.value) || 0
//                             )
//                           }
//                         />
//                       </div>

//                       <div className="space-y-2">
//                         <Label htmlFor={`medicine-left-${index}`}>
//                           Doses Left
//                         </Label>
//                         <Input
//                           id={`medicine-left-${index}`}
//                           type="number"
//                           min="0"
//                           value={medicine.medsLeft}
//                           onChange={(e) =>
//                             handleMedicineChange(
//                               index,
//                               "medsLeft",
//                               Number.parseInt(e.target.value) || 0
//                             )
//                           }
//                         />
//                       </div>
//                     </div>

//                     <div className="pt-2">
//                       <Badge variant="outline" className="bg-gray-50">
//                         {
//                           Object.values(medicine.schedule).filter(Boolean)
//                             .length
//                         }{" "}
//                         times daily
//                       </Badge>
//                     </div>
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>
//           </TabsContent>
//         </Tabs>

//         <DialogFooter className="pt-2">
//           <Button variant="outline" onClick={() => onOpenChange(false)}>
//             Cancel
//           </Button>
//           <Button onClick={() => onOpenChange(false)}>Save Prescription</Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }

// import React, { useState } from "react";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
//   DialogFooter,
//   DialogClose,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { supabase } from "@/utils/supabaseClient"; // Adjusted path
// import { useUser } from "@clerk/nextjs";
// import { toast } from "sonner";

// export function AddPrescriptionDialog({ open, onOpenChange }) {
//   const { user } = useUser();
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     setIsLoading(true);
//     setError(null);

//     if (!user) {
//       setError("User not authenticated. Please log in.");
//       setIsLoading(false);
//       toast.error("User not authenticated. Please log in.");
//       return;
//     }

//     const elements = event.target.elements;
//     const appointmentId = elements.appointmentId.value || null;
//     const doctorId = elements.doctorId.value || null;
//     const startDate = elements.startDate.value || null;
//     const endDate = elements.endDate.value || null;
//     const processedText = elements.processedText.value;

//     if (!processedText) {
//       setError("Notes field cannot be empty.");
//       setIsLoading(false);
//       toast.error("Notes field cannot be empty.");
//       return;
//     }

//     let fetchedUserId;
//     try {
//       const { data: userData, error: userError } = await supabase
//         .from("users")
//         .select("user_id")
//         .eq("clerk_id", user.id)
//         .single();

//       if (userError || !userData) {
//         console.error("Error fetching user ID:", userError);
//         const errorMessage =
//           userError?.message ||
//           "Failed to fetch user details. Cannot save prescription.";
//         setError(errorMessage);
//         toast.error(errorMessage);
//         setIsLoading(false);
//         return;
//       }
//       fetchedUserId = userData.user_id;

//       const prescriptionData = {
//         appointment_id: appointmentId, // Ensure snake_case for DB columns
//         doctor_id: doctorId, // Ensure snake_case for DB columns
//         user_id: fetchedUserId,
//         clerk_id: user.id,
//         start_date: startDate, // Ensure snake_case for DB columns
//         end_date: endDate, // Ensure snake_case for DB columns
//         processed_text: processedText, // Ensure snake_case for DB columns
//         created_at: new Date().toISOString().split("T")[0],
//       };

//       const { data: insertData, error: insertError } = await supabase
//         .from("prescriptions")
//         .insert([prescriptionData])
//         .select(); // Optionally .select() to get the inserted data back

//       if (insertError) {
//         console.error("Error inserting prescription:", insertError);
//         setError(insertError.message);
//         toast.error(`Error: ${insertError.message}`);
//       } else {
//         console.log("Prescription added:", insertData);
//         toast.success("Prescription added successfully!");
//         onOpenChange(false); // Close dialog
//         event.target.reset(); // Reset form
//       }
//     } catch (err) {
//       console.error("Unexpected error during submission:", err);
//       setError("An unexpected error occurred. Please try again.");
//       toast.error("An unexpected error occurred. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-[425px]">
//         <DialogHeader>
//           <DialogTitle>Add New Prescription</DialogTitle>
//           <DialogDescription>
//             Fill in the details below to add a new prescription. Click submit
//             when done.
//           </DialogDescription>
//         </DialogHeader>
//         {error && (
//           <div
//             className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
//             role="alert"
//           >
//             <strong className="font-bold">Error: </strong>
//             <span className="block sm:inline">{error}</span>
//           </div>
//         )}
//         <form onSubmit={handleSubmit}>
//           <div className="grid gap-4 py-4">
//             <div className="grid grid-cols-4 items-center gap-4">
//               <Label htmlFor="appointmentId" className="text-right">
//                 Appointment ID
//               </Label>
//               <Input
//                 id="appointmentId"
//                 name="appointmentId"
//                 className="col-span-3"
//               />
//             </div>
//             <div className="grid grid-cols-4 items-center gap-4">
//               <Label htmlFor="doctorId" className="text-right">
//                 Doctor ID
//               </Label>
//               <Input id="doctorId" name="doctorId" className="col-span-3" />
//             </div>
//             <div className="grid grid-cols-4 items-center gap-4">
//               <Label htmlFor="startDate" className="text-right">
//                 Start Date
//               </Label>
//               <Input
//                 id="startDate"
//                 name="startDate"
//                 type="date"
//                 className="col-span-3"
//               />
//             </div>
//             <div className="grid grid-cols-4 items-center gap-4">
//               <Label htmlFor="endDate" className="text-right">
//                 End Date
//               </Label>
//               <Input
//                 id="endDate"
//                 name="endDate"
//                 type="date"
//                 className="col-span-3"
//               />
//             </div>
//             <div className="grid grid-cols-4 items-center gap-4">
//               <Label htmlFor="processedText" className="text-right">
//                 Notes
//               </Label>
//               <Textarea
//                 id="processedText"
//                 name="processedText"
//                 className="col-span-3"
//                 required
//               />
//             </div>
//           </div>
//           <DialogFooter>
//             <DialogClose asChild>
//               <Button type="button" variant="outline" disabled={isLoading}>
//                 Cancel
//               </Button>
//             </DialogClose>
//             <Button type="submit" disabled={isLoading}>
//               {isLoading ? "Submitting..." : "Submit Prescription"}
//             </Button>
//           </DialogFooter>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// }

// export default AddPrescriptionDialog;

// import React, { useState } from "react";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
//   DialogFooter,
//   DialogClose,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { supabase } from "@/utils/supabaseClient"; // Adjusted path
// import { useUser } from "@clerk/nextjs";
// import { toast } from "sonner";
// import { useRouter } from "next/navigation"; // Added useRouter

// export function AddPrescriptionDialog({ open, onOpenChange }) {
//   const { user } = useUser();
//   const router = useRouter(); // Initialized router
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     setIsLoading(true);
//     setError(null);

//     if (!user) {
//       setError("User not authenticated. Please log in.");
//       setIsLoading(false);
//       toast.error("User not authenticated. Please log in.");
//       return;
//     }

//     const elements = event.target.elements;
//     const appointmentId = elements.appointmentId.value || null;
//     const doctorId = elements.doctorId.value || null;
//     const startDate = elements.startDate.value || null;
//     const endDate = elements.endDate.value || null;
//     const processedText = elements.processedText.value;

//     if (!processedText) {
//       setError("Notes field cannot be empty.");
//       setIsLoading(false);
//       toast.error("Notes field cannot be empty.");
//       return;
//     }

//     let fetchedUserId;
//     try {
//       const { data: userData, error: userError } = await supabase
//         .from("users")
//         .select("user_id")
//         .eq("clerk_id", user.id)
//         .single();

//       if (userError || !userData) {
//         console.error("Error fetching user ID:", userError);
//         const errorMessage =
//           userError?.message ||
//           "Failed to fetch user details. Cannot save prescription.";
//         setError(errorMessage);
//         toast.error(errorMessage);
//         setIsLoading(false);
//         return;
//       }
//       fetchedUserId = userData.user_id;

//       const prescriptionData = {
//         appointment_id: appointmentId, // Ensure snake_case for DB columns
//         doctor_id: doctorId, // Ensure snake_case for DB columns
//         user_id: fetchedUserId,
//         clerk_id: user.id,
//         start_date: startDate, // Ensure snake_case for DB columns
//         end_date: endDate, // Ensure snake_case for DB columns
//         processed_text: processedText, // Ensure snake_case for DB columns
//         created_at: new Date().toISOString().split("T")[0],
//       };

//       const { data: insertData, error: insertError } = await supabase
//         .from("prescriptions")
//         .insert([prescriptionData])
//         .select(); // Optionally .select() to get the inserted data back

//       if (insertError) {
//         console.error("Error inserting prescription:", insertError);
//         setError(insertError.message);
//         toast.error(`Error: ${insertError.message}`);
//       } else {
//         console.log("Prescription added:", insertData);
//         toast.success("Prescription added successfully!");
//         onOpenChange(false); // Close dialog
//         event.target.reset(); // Reset form
//         router.push("/dashboard/prescriptions"); // Added redirection
//       }
//     } catch (err) {
//       console.error("Unexpected error during submission:", err);
//       setError("An unexpected error occurred. Please try again.");
//       toast.error("An unexpected error occurred. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-[425px]">
//         <DialogHeader>
//           <DialogTitle>Add New Prescription</DialogTitle>
//           <DialogDescription>
//             Fill in the details below to add a new prescription. Click submit
//             when done.
//           </DialogDescription>
//         </DialogHeader>
//         {error && (
//           <div
//             className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
//             role="alert"
//           >
//             <strong className="font-bold">Error: </strong>
//             <span className="block sm:inline">{error}</span>
//           </div>
//         )}
//         <form onSubmit={handleSubmit}>
//           <div className="grid gap-4 py-4">
//             <div className="grid grid-cols-4 items-center gap-4">
//               <Label htmlFor="appointmentId" className="text-right">
//                 Appointment ID
//               </Label>
//               <Input
//                 id="appointmentId"
//                 name="appointmentId"
//                 className="col-span-3"
//               />
//             </div>
//             <div className="grid grid-cols-4 items-center gap-4">
//               <Label htmlFor="doctorId" className="text-right">
//                 Doctor ID
//               </Label>
//               <Input id="doctorId" name="doctorId" className="col-span-3" />
//             </div>
//             <div className="grid grid-cols-4 items-center gap-4">
//               <Label htmlFor="startDate" className="text-right">
//                 Start Date
//               </Label>
//               <Input
//                 id="startDate"
//                 name="startDate"
//                 type="date"
//                 className="col-span-3"
//               />
//             </div>
//             <div className="grid grid-cols-4 items-center gap-4">
//               <Label htmlFor="endDate" className="text-right">
//                 End Date
//               </Label>
//               <Input
//                 id="endDate"
//                 name="endDate"
//                 type="date"
//                 className="col-span-3"
//               />
//             </div>
//             <div className="grid grid-cols-4 items-center gap-4">
//               <Label htmlFor="processedText" className="text-right">
//                 Notes
//               </Label>
//               <Textarea
//                 id="processedText"
//                 name="processedText"
//                 className="col-span-3"
//                 required
//               />
//             </div>
//           </div>
//           <DialogFooter>
//             <DialogClose asChild>
//               <Button type="button" variant="outline" disabled={isLoading}>
//                 Cancel
//               </Button>
//             </DialogClose>
//             <Button type="submit" disabled={isLoading}>
//               {isLoading ? "Submitting..." : "Submit Prescription"}
//             </Button>
//           </DialogFooter>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// }

// export default AddPrescriptionDialog;

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/utils/supabaseClient";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { useRouter } from "next/navigation"; // Added useRouter

export function AddPrescriptionDialog({ open, onOpenChange }) {
  const { user } = useUser();
  const router = useRouter(); // Initialized router
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!user) {
      setError("User not authenticated. Please log in.");
      setIsLoading(false);
      toast.error("User not authenticated. Please log in.");
      return;
    }

    const elements = event.target.elements;
    const appointmentId = elements.appointmentId.value || null;
    const doctorId = elements.doctorId.value || null;
    const startDate = elements.startDate.value || null;
    const endDate = elements.endDate.value || null;
    const processedText = elements.processedText.value;

    if (!processedText) {
      setError("Notes field cannot be empty.");
      setIsLoading(false);
      toast.error("Notes field cannot be empty.");
      return;
    }

    let fetchedUserId;
    try {
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("user_id")
        .eq("clerk_id", user.id)
        .single();

      if (userError || !userData) {
        console.error("Error fetching user ID:", userError);
        const errorMessage =
          userError?.message ||
          "Failed to fetch user details. Cannot save prescription.";
        setError(errorMessage);
        toast.error(errorMessage);
        setIsLoading(false);
        return;
      }
      fetchedUserId = userData.user_id;

      const prescriptionData = {
        appointment_id: appointmentId, // Ensure snake_case for DB columns
        doctor_id: doctorId, // Ensure snake_case for DB columns
        user_id: fetchedUserId,
        clerk_id: user.id,
        start_date: startDate, // Ensure snake_case for DB columns
        end_date: endDate, // Ensure snake_case for DB columns
        processed_text: processedText, // Ensure snake_case for DB columns
        created_at: new Date().toISOString().split("T")[0],
      };

      const { data: insertData, error: insertError } = await supabase
        .from("prescriptions")
        .insert([prescriptionData])
        .select(); // Optionally .select() to get the inserted data back

      if (insertError) {
        console.error("Error inserting prescription:", insertError);
        setError(insertError.message);
        toast.error(`Error: ${insertError.message}`);
      } else {
        console.log("Prescription added:", insertData);
        toast.success("Prescription added successfully!");
        onOpenChange(false); // Close dialog
        event.target.reset(); // Reset form
        router.push("/dashboard/prescriptions"); // Added redirection
      }
    } catch (err) {
      console.error("Unexpected error during submission:", err);
      setError("An unexpected error occurred. Please try again.");
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Prescription</DialogTitle>
          <DialogDescription>
            Fill in the details below to add a new prescription. Click submit
            when done.
          </DialogDescription>
        </DialogHeader>
        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="appointmentId" className="text-right">
                Appointment ID
              </Label>
              <Input
                id="appointmentId"
                name="appointmentId"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="doctorId" className="text-right">
                Doctor ID
              </Label>
              <Input id="doctorId" name="doctorId" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="startDate" className="text-right">
                Start Date
              </Label>
              <Input
                id="startDate"
                name="startDate"
                type="date"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="endDate" className="text-right">
                End Date
              </Label>
              <Input
                id="endDate"
                name="endDate"
                type="date"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="processedText" className="text-right">
                Notes
              </Label>
              <Textarea
                id="processedText"
                name="processedText"
                className="col-span-3"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isLoading}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Submitting..." : "Submit Prescription"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AddPrescriptionDialog;

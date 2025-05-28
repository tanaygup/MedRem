// "use client";

// import React, { useEffect, useState } from "react";
// import DashboardLayout from "@/components/dashboard/dash-layout"; // Assuming this is your main layout
// import { supabase } from "@/utils/supabaseClient"; // Adjusted path
// import { useUser } from "@clerk/nextjs";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription,
// } from "@/components/ui/card"; // Assuming you have these
// import { Badge } from "@/components/ui/badge"; // For status or tags
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // For messages
// import { PlusCircle } from "lucide-react"; // For a potential "add new" button on this page itself

// export default function PrescriptionsPage() {
//   const { user } = useUser();
//   const [prescriptions, setPrescriptions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchPrescriptions = async () => {
//       if (!user) {
//         setLoading(false);
//         return;
//       }

//       try {
//         setLoading(true);
//         setError(null);

//         // First, get the internal userId from the 'users' table based on clerkId
//         const { data: userData, error: userError } = await supabase
//           .from("users")
//           .select("user_id")
//           .eq("clerk_id", user.id)
//           .single();

//         if (userError || !userData) {
//           throw new Error(
//             userError?.message ||
//               "User details not found. Cannot fetch prescriptions."
//           );
//         }
//         const internalUserId = userData.user_id;

//         // Now fetch prescriptions using the internal userId
//         const { data, error: prescriptionsError } = await supabase
//           .from("prescriptions")
//           .select(
//             `
//             prescription_id,
//             created_at,
//             start_date,
//             end_date,
//             processed_text,
//             doctors ( doctor_name ),
//             appointments ( appointment_date )
//           `
//           )
//           .eq("user_id", internalUserId)
//           .order("created_at", { ascending: false });

//         if (prescriptionsError) {
//           throw new Error(prescriptionsError.message);
//         }

//         setPrescriptions(data || []);
//       } catch (err) {
//         console.error("Error fetching prescriptions:", err);
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPrescriptions();
//   }, [user]);

//   if (loading) {
//     return (
//       <DashboardLayout>
//         <div className="p-4">
//           <p>Loading prescriptions...</p>
//         </div>
//       </DashboardLayout>
//     );
//   }

//   if (error) {
//     return (
//       <DashboardLayout>
//         <Alert variant="destructive" className="m-4">
//           <AlertTitle>Error</AlertTitle>
//           <AlertDescription>{error}</AlertDescription>
//         </Alert>
//       </DashboardLayout>
//     );
//   }

//   return (
//     <DashboardLayout>
//       <div className="p-4 md:p-8">
//         <div className="flex justify-between items-center mb-6">
//           <h1 className="text-2xl font-semibold">My Prescriptions</h1>
//           {/* Optional: Button to navigate to the add prescription dialog directly from here */}
//           {/* <Button onClick={() => router.push('/dashboard')}><PlusCircle className="mr-2 h-4 w-4" /> Add New</Button> */}
//         </div>

//         {prescriptions.length === 0 ? (
//           <Alert>
//             <AlertTitle>No Prescriptions Found</AlertTitle>
//             <AlertDescription>
//               You do not have any prescriptions yet. You can add one from the
//               main dashboard.
//             </AlertDescription>
//           </Alert>
//         ) : (
//           <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//             {prescriptions.map((prescription) => (
//               <Card
//                 key={prescription.prescription_id}
//                 className="flex flex-col"
//               >
//                 <CardHeader>
//                   <CardTitle>
//                     Prescription #{prescription.prescription_id}
//                   </CardTitle>
//                   <CardDescription>
//                     Created on:{" "}
//                     {new Date(prescription.created_at).toLocaleDateString()}
//                     {prescription.doctors && (
//                       <span className="block text-sm text-muted-foreground">
//                         Doctor: {prescription.doctors.doctor_name || "N/A"}
//                       </span>
//                     )}
//                   </CardDescription>
//                 </CardHeader>
//                 <CardContent className="flex-grow">
//                   <p className="mb-2">
//                     <strong>Start Date:</strong>{" "}
//                     {prescription.start_date
//                       ? new Date(prescription.start_date).toLocaleDateString()
//                       : "N/A"}
//                   </p>
//                   <p className="mb-2">
//                     <strong>End Date:</strong>{" "}
//                     {prescription.end_date
//                       ? new Date(prescription.end_date).toLocaleDateString()
//                       : "N/A"}
//                   </p>
//                   {prescription.processed_text && (
//                     <div className="mt-2">
//                       <h4 className="font-semibold text-sm">Notes:</h4>
//                       <p className="text-sm bg-gray-50 p-2 rounded">
//                         {prescription.processed_text}
//                       </p>
//                     </div>
//                   )}
//                   {/* Placeholder for "Add Medicines" button - to be implemented in a later step */}
//                   <div className="mt-4">
//                     {/* <Button size="sm">Add Medicines</Button> */}
//                   </div>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         )}
//       </div>
//     </DashboardLayout>
//   );
// }
"use client";

import React, { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard/dash-layout"; // Assuming this is your main layout
// import { supabase } from "@/utils/supabase/client"; // Removed Supabase client import
import { useUser } from "@clerk/nextjs"; // Kept for potential UI use, not for this fetch
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"; // Assuming you have these
import { Button } from "@/components/ui/button"; // Added Button
import { Badge } from "@/components/ui/badge"; // For status or tags
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // For messages
import { PlusCircle } from "lucide-react"; // For a potential "add new" button on this page itself
import AddMedicineToPrescriptionDialog from "@/components/dashboard/add-medicine-to-prescription-dialog"; // Added import

export default function PrescriptionsPage() {
  const { user } = useUser();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddMedicineDialogOpen, setIsAddMedicineDialogOpen] = useState(false);
  const [selectedPrescriptionId, setSelectedPrescriptionId] = useState(null);

  const handleOpenAddMedicineDialog = (prescriptionId) => {
    setSelectedPrescriptionId(prescriptionId);
    setIsAddMedicineDialogOpen(true);
  };

  useEffect(() => {
    const fetchPrescriptionsFromApi = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/prescription");
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error ||
              `API request failed with status ${response.status}`
          );
        }
        const data = await response.json();
        setPrescriptions(data);
      } catch (err) {
        console.error("Error fetching prescriptions from API:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPrescriptionsFromApi();
  }, []); // Dependency array is now empty

  if (loading) {
    return (
      <DashboardLayout>
        <div className="p-4">
          <p>Loading prescriptions...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <Alert variant="destructive" className="m-4">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-4 md:p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">My Prescriptions</h1>
          {/* Optional: Button to navigate to the add prescription dialog directly from here */}
          {/* <Button onClick={() => router.push('/dashboard')}><PlusCircle className="mr-2 h-4 w-4" /> Add New</Button> */}
        </div>

        {prescriptions.length === 0 ? (
          <Alert>
            <AlertTitle>No Prescriptions Found</AlertTitle>
            <AlertDescription>
              You do not have any prescriptions yet. You can add one from the
              main dashboard.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {prescriptions.map((prescription) => (
              <Card key={prescription.prescriptionId} className="flex flex-col">
                <CardHeader>
                  <CardTitle>
                    Prescription #{prescription.prescriptionId}
                  </CardTitle>{" "}
                  {/* Adjusted to prescriptionId */}
                  <CardDescription>
                    Created on:{" "}
                    {new Date(prescription.createdAt).toLocaleDateString()}{" "}
                    {/* Adjusted to createdAt */}
                    {prescription.doctorName /* Adjusted to doctorName */ && (
                      <span className="block text-sm text-muted-foreground">
                        Doctor: {prescription.doctorName || "N/A"}
                      </span>
                    )}
                    {/* Assuming appointmentDate might be useful here or elsewhere in the card */}
                    {/* prescription.appointmentDate ? new Date(prescription.appointmentDate).toLocaleDateString() : 'N/A' */}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="mb-2">
                    <strong>Start Date:</strong>{" "}
                    {prescription.startDate
                      ? new Date(prescription.startDate).toLocaleDateString()
                      : "N/A"}{" "}
                    {/* Adjusted to startDate */}
                  </p>
                  <p className="mb-2">
                    <strong>End Date:</strong>{" "}
                    {prescription.endDate
                      ? new Date(prescription.endDate).toLocaleDateString()
                      : "N/A"}{" "}
                    {/* Adjusted to endDate */}
                  </p>
                  {prescription.processedText /* Adjusted to processedText */ && (
                    <div className="mt-2">
                      <h4 className="font-semibold text-sm">Notes:</h4>
                      <p className="text-sm bg-gray-50 p-2 rounded">
                        {prescription.processedText}{" "}
                        {/* Adjusted to processedText */}
                      </p>
                    </div>
                  )}
                  {/* Display Medicines */}
                  {prescription.medicines &&
                    prescription.medicines.length > 0 && (
                      <div className="mt-4 pt-2 border-t">
                        <h4 className="font-semibold text-sm mb-2">
                          Medicines:
                        </h4>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                          {prescription.medicines.map((medicine) => (
                            <li key={medicine.medicineId}>
                              {" "}
                              {/* Adjusted to medicineId */}
                              <strong>{medicine.medicineName}</strong> (
                              {medicine.dosage}){" "}
                              {/* Adjusted to medicineName */}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  {/* Add Medicines Button */}
                  <div className="mt-4 pt-4 border-t">
                    <Button
                      size="sm"
                      onClick={() =>
                        handleOpenAddMedicineDialog(prescription.prescriptionId)
                      }
                      className="w-full" // Make button full width for better card integration
                    >
                      <PlusCircle className="mr-2 h-4 w-4" />{" "}
                      {/* Optional: Add an icon */}
                      Add Medicines
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <AddMedicineToPrescriptionDialog
        open={isAddMedicineDialogOpen}
        onOpenChange={setIsAddMedicineDialogOpen}
        prescriptionId={selectedPrescriptionId}
      />
    </DashboardLayout>
  );
}

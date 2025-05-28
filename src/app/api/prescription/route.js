// import { NextResponse } from "next/server";
// import { db } from "@/lib/db";
// import { prescriptions } from "@/db/schema";

// // List all prescriptions for a given user
// export async function GET(request) {
//   const url = new URL(request.url);
//   const userId = url.searchParams.get("user_id");
//   if (!userId) return NextResponse.error();

//   const all = await db
//     .select()
//     .from(prescriptions)
//     .where(prescriptions.userId.eq(Number(userId)))
//     .orderBy(prescriptions.createdAt.desc());
//   return NextResponse.json(all);
// }

// // Create a new prescription
// export async function POST(request) {
//   const payload = await request.json();
//   const [inserted] = await db
//     .insert(prescriptions)
//     .values({
//       userId: payload.user_id,
//       doctorId: payload.doctor_id,
//       appointmentId: payload.appointment_id,
//       createdAt: payload.created_at,
//       startDate: payload.start_date,
//       endDate: payload.end_date,
//       processedText: payload.processed_text,
//     })
//     .returning();
//   return NextResponse.json(inserted);
// }

// // Update an existing prescription by ID
// export async function PUT(request) {
//   const payload = await request.json();
//   const { prescription_id } = payload;
//   if (!prescription_id) return NextResponse.error();

//   const updated = await db
//     .update(prescriptions)
//     .set({
//       doctorId: payload.doctor_id,
//       appointmentId: payload.appointment_id,
//       startDate: payload.start_date,
//       endDate: payload.end_date,
//       processedText: payload.processed_text,
//     })
//     .where(prescriptions.prescriptionId.eq(prescription_id))
//     .returning();
//   return NextResponse.json(updated[0] || null);
// }

// // Delete a prescription by ID
// export async function DELETE(request) {
//   const url = new URL(request.url);
//   const id = url.searchParams.get("prescription_id");
//   if (!id) return NextResponse.error();

//   await db
//     .delete(prescriptions)
//     .where(prescriptions.prescriptionId.eq(Number(id)));
//   return NextResponse.json({ success: true });
// }
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server"; // For authentication
import { db } from "@/db"; // Assuming your Drizzle instance is exported from @/db
import {
  users,
  prescriptions,
  doctors,
  appointments,
  medicines,
} from "@/db/schema"; // Import all necessary schemas
import { eq, and } from "drizzle-orm";

export async function GET(request) {
  try {
    const { userId: clerkId } = await auth(); // This is the clerk_id

    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1. Get the internal user_id from your users table based on clerk_id
    const userResult = await db
      .select({ internalUserId: users.userId })
      .from(users)
      .where(eq(users.clerkId, clerkId))
      .limit(1);

    if (userResult.length === 0) {
      return NextResponse.json(
        { error: "User not found in database" },
        { status: 404 }
      );
    }
    const internalUserId = userResult[0].internalUserId;

    // 2. Fetch prescriptions and join with doctors and appointments
    const prescriptionsData = await db
      .select({
        prescriptionId: prescriptions.prescriptionId,
        appointmentId: prescriptions.appointmentId,
        doctorId: prescriptions.doctorId,
        userId: prescriptions.userId,
        clerkId: prescriptions.clerkId,
        createdAt: prescriptions.createdAt,
        startDate: prescriptions.startDate,
        endDate: prescriptions.endDate,
        processedText: prescriptions.processedText,
        doctorName: doctors.doctorName,
        appointmentDate: appointments.appointmentDate,
        // Add any other fields you need from doctors or appointments
      })
      .from(prescriptions)
      .leftJoin(doctors, eq(prescriptions.doctorId, doctors.doctorId))
      .leftJoin(
        appointments,
        eq(prescriptions.appointmentId, appointments.appointmentId)
      )
      .where(eq(prescriptions.userId, internalUserId)) // Filter by the internal user ID
      .orderBy(prescriptions.createdAt); // Or any other order you prefer

    // 3. For each prescription, fetch its medicines
    const prescriptionsWithMedicines = [];
    for (const p of prescriptionsData) {
      const meds = await db
        .select({
          medicineId: medicines.medicineId,
          medicineName: medicines.medicineName,
          dosage: medicines.dosage,
          medsLeft: medicines.medsLeft,
          totalDosesTaken: medicines.totalDosesTaken,
          totalDoses: medicines.totalDoses,
        })
        .from(medicines)
        .where(eq(medicines.prescriptionId, p.prescriptionId));

      prescriptionsWithMedicines.push({
        ...p,
        medicines: meds,
      });
    }

    return NextResponse.json(prescriptionsWithMedicines, { status: 200 });
  } catch (error) {
    console.error("Error fetching prescriptions:", error);
    return NextResponse.json(
      { error: "Failed to fetch prescriptions", details: error.message },
      { status: 500 }
    );
  }
}

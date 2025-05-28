// import { NextResponse } from "next/server";
// import { db } from "@/lib/db";
// import { medicines, medicineSchedules } from "@/db/schema";

// // List medicines for a given prescription
// export async function GET(request) {
//   const url = new URL(request.url);
//   const presId = url.searchParams.get("prescription_id");
//   if (!presId) return NextResponse.error();

//   const list = await db
//     .select()
//     .from(medicines)
//     .where(medicines.prescriptionId.eq(Number(presId)));
//   return NextResponse.json(list);
// }

// // Create medicine + optional schedule
// export async function POST(request) {
//   const payload = await request.json();

//   // Insert medicine
//   const [newMed] = await db
//     .insert(medicines)
//     .values({
//       prescriptionId: payload.prescription_id,
//       medicineName: payload.medicine_name,
//       dosage: payload.dosage,
//       medsLeft: payload.meds_left,
//       totalDoses: payload.total_doses,
//       totalDosesTaken: payload.total_doses_taken || 0,
//     })
//     .returning();

//   // Insert schedule if provided
//   let schedule = null;
//   if (payload.schedule) {
//     [schedule] = await db
//       .insert(medicineSchedules)
//       .values({
//         medicineId: newMed.medicineId,
//         date: payload.schedule.date,
//         morning: payload.schedule.morning,
//         afternoon: payload.schedule.afternoon,
//         evening: payload.schedule.evening,
//         night: payload.schedule.night,
//       })
//       .returning();
//   }

//   return NextResponse.json({ medicine: newMed, schedule });
// }

// // Update a medicine (and schedule if needed)
// export async function PUT(request) {
//   const payload = await request.json();
//   const { medicine_id } = payload;
//   if (!medicine_id) return NextResponse.error();

//   // Update medicine fields
//   const [updatedMed] = await db
//     .update(medicines)
//     .set({
//       medicineName: payload.medicine_name,
//       dosage: payload.dosage,
//       medsLeft: payload.meds_left,
//       totalDoses: payload.total_doses,
//       totalDosesTaken: payload.total_doses_taken,
//     })
//     .where(medicines.medicineId.eq(medicine_id))
//     .returning();

//   // Optionally update schedule
//   let updatedSchedule = null;
//   if (payload.schedule && payload.schedule.schedule_id) {
//     [updatedSchedule] = await db
//       .update(medicineSchedules)
//       .set(payload.schedule)
//       .where(medicineSchedules.scheduleId.eq(payload.schedule.schedule_id))
//       .returning();
//   }

//   return NextResponse.json({ medicine: updatedMed, schedule: updatedSchedule });
// }

// // Delete a medicine (and its schedules)
// export async function DELETE(request) {
//   const url = new URL(request.url);
//   const id = url.searchParams.get("medicine_id");
//   if (!id) return NextResponse.error();

//   // Delete child schedules first
//   await db
//     .delete(medicineSchedules)
//     .where(medicineSchedules.medicineId.eq(Number(id)));

//   // Delete the medicine
//   await db.delete(medicines).where(medicines.medicineId.eq(Number(id)));

//   return NextResponse.json({ success: true });
// }
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/db";
import { medicines, prescriptions, users } from "@/db/schema"; // Import prescriptions and users as well for validation
import { eq, and } from "drizzle-orm";

export async function POST(request) {
  try {
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      prescriptionId,
      medicineName,
      dosage,
      medsLeft,
      totalDosesTaken,
      totalDoses,
    } = body;

    // Basic validation
    if (!prescriptionId || !medicineName || !dosage) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: prescriptionId, medicineName, and dosage are required.",
        },
        { status: 400 }
      );
    }

    // **Optional but recommended: Validate that the prescriptionId belongs to the authenticated user**
    // 1. Get internal user_id
    const userResult = await db
      .select({ internalUserId: users.userId })
      .from(users)
      .where(eq(users.clerkId, clerkId))
      .limit(1);

    if (userResult.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const internalUserId = userResult[0].internalUserId;

    // 2. Check if the prescription exists and belongs to this user
    const prescriptionCheck = await db
      .select({ id: prescriptions.prescriptionId })
      .from(prescriptions)
      .where(
        and(
          eq(prescriptions.prescriptionId, prescriptionId),
          eq(prescriptions.userId, internalUserId) // Ensure the prescription belongs to the authenticated user
        )
      )
      .limit(1);

    if (prescriptionCheck.length === 0) {
      return NextResponse.json(
        {
          error:
            "Prescription not found or you do not have permission to add medicines to it.",
        },
        { status: 404 }
      );
    }
    // End of validation

    const newMedicine = {
      prescriptionId, // This is prescription_id in the table
      medicineName, // This is medicine_name
      dosage,
      medsLeft: medsLeft ? parseInt(medsLeft) : null,
      totalDosesTaken: totalDosesTaken ? parseInt(totalDosesTaken) : null,
      totalDoses: totalDoses ? parseInt(totalDoses) : null,
    };

    // Map to database column names (snake_case)
    const dbMedicineData = {
      prescription_id: newMedicine.prescriptionId,
      medicine_name: newMedicine.medicineName,
      dosage: newMedicine.dosage,
      meds_left: newMedicine.medsLeft,
      total_doses_taken: newMedicine.totalDosesTaken,
      total_doses: newMedicine.totalDoses,
    };

    const insertedMedicines = await db
      .insert(medicines)
      .values(dbMedicineData)
      .returning({ insertedId: medicines.medicineId }); // Return the ID of the inserted medicine

    if (insertedMedicines.length === 0) {
      return NextResponse.json(
        { error: "Failed to add medicine, no data returned from insert." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "Medicine added successfully",
        medicineId: insertedMedicines[0].insertedId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding medicine:", error);
    // Check for specific Drizzle/database errors if needed, e.g., foreign key violation
    if (error.message.includes("foreign key constraint")) {
      // Basic check
      return NextResponse.json(
        { error: "Invalid prescription ID or data relationship error." },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to add medicine", details: error.message },
      { status: 500 }
    );
  }
}

// app/api/add-doctor/route.js
import { NextResponse } from "next/server";
import { db } from "@/db";
import { doctors } from "@/db/schema";

export async function POST(request) {
  try {
    const { doctorName,doctorAddress } = await request.json();
    if (!doctorName || typeof doctorName !== 'string' || !doctorName.trim()) {
      return NextResponse.json({ message: 'Doctor name is required' }, { status: 400 });
    }

    // Insert new doctor
    const [insertedDoctor] = await db
      .insert(doctors)
      .values({
  doctorName: doctorName.trim(),
  address: doctorAddress?.trim()
})
      .onConflictDoNothing() 
      .returning();

    return NextResponse.json({ doctor: {
      doctorId: insertedDoctor.doctorId,
      doctorName: insertedDoctor.doctorName,
      address: insertedDoctor.address
    } }, { status: 200 });
  } catch (error) {
    console.error('Error adding doctor:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

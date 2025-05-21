// src/app/api/appointments/route.ts

import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { appointments, doctors } from "@/db/schema";

export async function GET(req) {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const appointmentData = await db
      .select({
        id:            appointments.appointmentId,
        date:          appointments.appointmentDate,
        time:          appointments.appointmentTime,
        location:      appointments.location,
        status:        appointments.status,
        details:       appointments.details,
        doctorId:      appointments.doctorId,
        doctorName:    doctors.doctorName,           
      })
      .from(appointments)
      .leftJoin(doctors, eq(doctors.doctorId, appointments.doctorId))
      .where(eq(appointments.clerkId, user.id))
      .orderBy(appointments.appointmentDate, "asc");

    return NextResponse.json({ appointmentData }, { status: 200 });
  } catch (error) {
    console.error("get-appointments route error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

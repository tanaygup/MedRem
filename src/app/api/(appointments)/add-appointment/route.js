
import { db } from "@/db";
import { appointments } from "@/db/schema";
import { NextResponse } from "next/server";

export  async function POST(req) {
  const body = await req.json();
  const { clerkId,doctorId,appointmentDate,appointmentTime,location,status,details} = body;

try{
    await db.insert(appointments).values({
      clerkId:clerkId,
      doctorId:doctorId,
      appointmentDate:appointmentDate,
      appointmentTime:appointmentTime,
      location:location,
      status:status,
      details:details,
    })

    return NextResponse.json({ success: true },{status:200});
  } catch (error) {
    console.error("Error adding appointment to DB:", error);
    // console.log("body",body);
    return NextResponse.json({ error: "Failed to add appointment to the database" },{status:500});
  }
}

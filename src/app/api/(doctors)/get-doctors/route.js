import { db } from "@/db";
import { doctors } from "@/db/schema";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    
    const doctorData = await db
      .select()
      .from(doctors)
      .orderBy(doctors.doctorName, "asc");

      // console.log("Doctor data:", doctorData);

    return NextResponse.json({doctorData:doctorData});
  } catch (error) {
    console.error("get-doctors route error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

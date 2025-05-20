
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";

export  async function POST(req) {
  const body = await req.json();
  const { clerkId, name, phone, age ,address,gender,detailsUpdated} = body;
  const createdAt = new Date().toISOString();
  const user= await currentUser();

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  const email = user?.emailAddresses[0].emailAddress;
try{
    await db.insert(users).values({
      clerkId:clerkId,
      name:name,
      email:email,
      phone:phone,
      address:address,
      age:age,
      gender:gender,
      detailsUpdated:detailsUpdated,
      createdAt: createdAt,
    }).onConflictDoUpdate({
      target: [users.clerkId],
      set: {
        name:name,
        email:email,
        phone:phone,
        address:address,
        age:age,
      }});

    return NextResponse.json({ success: true },{status:200},{isDetailsUpdated:detailsUpdated});
  } catch (error) {
    console.error("Error adding user to DB:", error);
    // console.log("body",body);
    return NextResponse.json({ error: "Failed to add user to the database" },{status:500});
  }
}

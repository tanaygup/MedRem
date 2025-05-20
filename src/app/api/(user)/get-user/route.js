import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const clerkId = searchParams.get("clerkId");

    if (!clerkId) {
      return NextResponse.json({ error: "Missing clerkId" }, { status: 400 });
    }

    const userData = await db
      .select({
        isDetailsUpdated: users.detailsUpdated,
      })
      .from(users)
      .where(eq(users.clerkId, clerkId))
      .limit(1);

    if (userData.length === 0) {
      return NextResponse.json({isDetailsUpdated:false});
    }

    return NextResponse.json({
      isDetailsUpdated: userData[0].isDetailsUpdated ?? false,
    });
  } catch (error) {
    console.error("get-user route error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

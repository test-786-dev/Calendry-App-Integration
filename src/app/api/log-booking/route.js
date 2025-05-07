import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    console.log("Booking logged:", body);
    return NextResponse.json({ message: "Booking logged successfully" });
  } catch (error) {
    console.error("Error logging booking:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
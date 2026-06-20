import { dbConnect } from "@/middleware/mongoConnect";
import { checkAndPublishScheduled } from "@/middleware/publisher";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    await dbConnect();
    
    // Run the scheduler update and email delivery
    await checkAndPublishScheduled();

    return NextResponse.json({ success: true, message: "Scheduled publications checked and processed successfully." });
  } catch (error) {
    console.error("Error in sendEmail API:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

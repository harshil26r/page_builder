import { dbConnect } from "@/middleware/mongoConnect";
import OTP from "@/models/otp";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { email, otp } = body;

    if (!email || !otp) {
      return NextResponse.json({ success: false, error: "Email and OTP are required" }, { status: 400 });
    }

    const otpRecord = await OTP.findOne({ email });

    if (!otpRecord) {
      return NextResponse.json({ success: false, error: "OTP expired or not found. Please request a new one." }, { status: 404 });
    }

    if (otpRecord.otp !== otp) {
      return NextResponse.json({ success: false, error: "Invalid OTP code" }, { status: 400 });
    }

    // Delete OTP record after verification
    await OTP.deleteOne({ email });

    return NextResponse.json({ success: true, message: "OTP verified successfully" });
  } catch (error) {
    console.error("Verify OTP Error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

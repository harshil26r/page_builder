import { dbConnect } from "@/middleware/mongoConnect";
import User from "@/models/user";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { username, email, password, isSubscribe } = body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ success: false, error: "Email alredy in use!" }, { status: 400 });
    }

    const u = new User({
      username,
      email,
      isSubscribe,
      password,
    });
    await u.save();

    return NextResponse.json({ success: true, message: "success" });
  } catch (error) {
    console.error("Signup API error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

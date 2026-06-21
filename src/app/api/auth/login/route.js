import { dbConnect } from "@/middleware/mongoConnect";
import User from "@/models/user";
import Session from "@/models/session";
import { signCookie } from "@/middleware/cookieSigner";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { email, password } = body;

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ success: false, error: "Invalide credentials" }, { status: 400 });
    }

    const validPass = await user.comparePassword(password);
    if (!validPass) {
      return NextResponse.json({ success: false, error: "Invalide credentials" }, { status: 400 });
    }

    // Create session in MongoDB
    const dbSession = await Session.create({ userId: user._id });

    // Create response
    const response = NextResponse.json({
      success: true,
      user: {
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });

    // Set HTTP-only session cookie
    response.cookies.set({
      name: "sid",
      value: signCookie(dbSession._id.toString()),
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 5, // 5 hours
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

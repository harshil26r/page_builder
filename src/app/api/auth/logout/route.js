import { dbConnect } from "@/middleware/mongoConnect";
import Session from "@/models/session";
import { unsignCookie } from "@/middleware/cookieSigner";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    await dbConnect();
    const cookieStore = cookies();
    const rawSid = cookieStore.get("sid")?.value;
    const sid = rawSid ? unsignCookie(rawSid) : null;

    if (sid) {
      await Session.findByIdAndDelete(sid);
    }

    const response = NextResponse.json({ success: true, message: "Logged out successfully" });
    
    // Clear cookie
    response.cookies.set({
      name: "sid",
      value: "",
      httpOnly: true,
      expires: new Date(0),
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Logout API error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

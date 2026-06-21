import { dbConnect } from "@/middleware/mongoConnect";
import Session from "@/models/session";
import User from "@/models/user";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await dbConnect();
    const cookieStore = cookies();
    const sid = cookieStore.get("sid")?.value;

    if (!sid) {
      return NextResponse.json({ success: false, error: "Not authenticated" }, { status: 401 });
    }

    const sessionObj = await Session.findById(sid);
    if (!sessionObj) {
      return NextResponse.json({ success: false, error: "Session expired" }, { status: 401 });
    }

    const user = await User.findById(sessionObj.userId).select("-password");
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("Auth me error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

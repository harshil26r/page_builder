import { dbConnect } from "@/middleware/mongoConnect";
import Blog from "@/models/blog";
import { checkAndPublishScheduled } from "@/middleware/publisher";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await dbConnect();
    // Dynamically publish scheduled pages whose publish time has arrived
    await checkAndPublishScheduled();
    const blog = await Blog.find();
    return NextResponse.json({ blog });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json({ success: false, error: error.message || error }, { status: 400 });
  }
}

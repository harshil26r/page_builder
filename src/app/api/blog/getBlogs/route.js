import { dbConnect } from "@/middleware/mongoConnect";
import Blog from "@/models/blog";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();
    const blog = await Blog.find();
    return NextResponse.json({ blog });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json({ success: false, error: error.message || error }, { status: 400 });
  }
}

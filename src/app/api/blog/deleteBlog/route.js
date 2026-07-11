import { dbConnect } from "@/middleware/mongoConnect";
import Blog from "@/models/blog";
import { isValidObjectId } from "@/lib/validateObjectId";
import { NextResponse } from "next/server";

export async function DELETE(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { id } = body;

    if (!isValidObjectId(id)) {
      return NextResponse.json({ success: false, error: "Invalid blog ID format" }, { status: 400 });
    }

    const deletedBlog = await Blog.findByIdAndDelete(id);

    if (!deletedBlog) {
      return NextResponse.json({ success: false, error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Blog deleted successfully",
      deletedBlog,
    });
  } catch (error) {
    console.error("Error deleting blog:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

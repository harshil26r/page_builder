import { dbConnect } from "@/middleware/mongoConnect";
import Blog from "@/models/blog";
import { isValidObjectId } from "@/lib/validateObjectId";
import { NextResponse } from "next/server";

export async function PATCH(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { id, status, publishTime, publishDate } = body;

    if (!isValidObjectId(id)) {
      return NextResponse.json({ success: false, error: "Invalid blog ID format" }, { status: 400 });
    }

    const updatedBlog = await Blog.findOneAndUpdate(
      { _id: id },
      { status, publishTime, publishDate },
      { new: true }
    );

    if (!updatedBlog) {
      return NextResponse.json({ success: false, error: "Blog not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Blog updated successfully",
      updatedBlog,
    });
  } catch (error) {
    console.error("Error updating blog:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

import { dbConnect } from "@/middleware/mongoConnect";
import Blog from "@/models/blog";
import User from "@/models/user";
import jwt from "jsonwebtoken";
import moment from "moment";
import { NextResponse } from "next/server";

export async function PUT(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const {
      token,
      id,
      title,
      subText,
      body: blogBody,
      attachments,
      url,
      showAuthor,
      status,
      publishTime,
      publishDate,
    } = body;

    const formattedDate = moment().format("D/M/YYYY,h:mm A");

    const decoded = jwt.verify(token, process.env.SecretKey);
    const user = await User.findOne({ email: decoded.email });
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 400 });
    }

    const updatedBlog = await Blog.findOneAndUpdate(
      { _id: id },
      {
        title,
        subText,
        body: blogBody,
        attachments,
        url,
        showAuthor,
        status,
        modifiedBy: user.username,
        modifiedAt: formattedDate,
        publishTime,
        publishDate,
      },
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

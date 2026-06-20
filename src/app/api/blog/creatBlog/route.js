import { dbConnect } from "@/middleware/mongoConnect";
import User from "@/models/user";
import Blog from "@/models/blog";
import jwt from "jsonwebtoken";
import moment from "moment";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    await dbConnect();
    const bodyData = await request.json();
    const { token, title, subText, body, attachments, url, showAuthor } = bodyData;

    const formattedDate = moment().format("D/M/YYYY,h:mm A");

    const decoded = jwt.verify(token, process.env.SecretKey);
    const user = await User.findOne({ email: decoded.email });
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 400 });
    }

    const existingBlog = await Blog.findOne({ title });
    if (existingBlog) {
      return NextResponse.json({ success: false, error: "Blog already exist" }, { status: 400 });
    }

    const normalizedUrl = url.startsWith('/') ? url : '/' + url;

    const newBlog = new Blog({
      title,
      subText,
      body,
      attachments,
      url: normalizedUrl,
      showAuthor,
      authorEmail: user.email,
      createdBy: user.username,
      modifiedBy: user.username,
      createdAt: formattedDate,
      modifiedAt: formattedDate,
      status: bodyData.status || "draft",
      publishTime: bodyData.publishTime || "",
    });

    await newBlog.save();
    return NextResponse.json({ id: newBlog._id, success: true, message: "success" });
  } catch (error) {
    console.error("Create Blog API error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

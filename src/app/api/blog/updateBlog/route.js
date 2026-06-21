import { dbConnect } from "@/middleware/mongoConnect";
import Blog from "@/models/blog";
import User from "@/models/user";
import Session from "@/models/session";
import moment from "moment";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function PUT(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const {
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

    const cookieStore = cookies();
    const sid = cookieStore.get("sid")?.value;
    if (!sid) {
      return NextResponse.json({ success: false, error: "Unauthorized: Please login first" }, { status: 401 });
    }

    const sessionObj = await Session.findById(sid);
    if (!sessionObj) {
      return NextResponse.json({ success: false, error: "Unauthorized: Session expired or invalid" }, { status: 401 });
    }

    const user = await User.findById(sessionObj.userId);
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 400 });
    }

    const normalizedUrl = url.startsWith('/') ? url : '/' + url;

    const updatedBlog = await Blog.findOneAndUpdate(
      { _id: id },
      {
        title,
        subText,
        body: blogBody,
        attachments,
        url: normalizedUrl,
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

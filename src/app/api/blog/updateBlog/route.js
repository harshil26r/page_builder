import { dbConnect } from "@/middleware/mongoConnect";
import Blog from "@/models/blog";
import User from "@/models/user";
import Session from "@/models/session";
import moment from "moment";
import { unsignCookie } from "@/middleware/cookieSigner";
import { isValidObjectId } from "@/lib/validateObjectId";
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
      blocks,
      metaTitle,
      metaDescription,
      ogImage,
    } = body;

    if (!isValidObjectId(id)) {
      return NextResponse.json({ success: false, error: "Invalid blog ID format" }, { status: 400 });
    }

    const formattedDate = moment().format("D/M/YYYY,h:mm A");

    const cookieStore = await cookies();
    const rawSid = cookieStore.get("sid")?.value;
    const sid = rawSid ? unsignCookie(rawSid) : null;
    if (!isValidObjectId(sid)) {
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
        publishTime,
        publishDate,
        blocks,
        metaTitle,
        metaDescription,
        ogImage,
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

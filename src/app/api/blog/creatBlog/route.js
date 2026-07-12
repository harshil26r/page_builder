import { dbConnect } from "@/middleware/mongoConnect";
import User from "@/models/user";
import Blog from "@/models/blog";
import Session from "@/models/session";
import moment from "moment";
import { unsignCookie } from "@/middleware/cookieSigner";
import { isValidObjectId } from "@/lib/validateObjectId";
import { errorResponse, successResponse } from "@/lib/apiResponse";
import { cookies } from "next/headers";

export async function POST(request) {
  try {
    await dbConnect();
    const bodyData = await request.json();
    const { title, subText, attachments, url, showAuthor, blocks, metaTitle, metaDescription, ogImage } = bodyData;

    if (!title || !title.trim()) {
      return errorResponse("Title is required", "Title is required", 400);
    }
    if (!url || !url.trim()) {
      return errorResponse("URL slug is required", "URL slug is required", 400);
    }

    const formattedDate = moment().format("D/M/YYYY,h:mm A");

    const cookieStore = await cookies();
    const rawSid = cookieStore.get("sid")?.value;
    const sid = rawSid ? unsignCookie(rawSid) : null;
    
    if (!sid || !isValidObjectId(sid)) {
      return errorResponse("Unauthorized: Please login first", "Unauthorized", 401);
    }

    const sessionObj = await Session.findById(sid);
    if (!sessionObj) {
      return errorResponse("Unauthorized: Session expired or invalid", "Unauthorized", 401);
    }

    const user = await User.findById(sessionObj.userId);
    if (!user) {
      return errorResponse("User not found", "User not found", 400);
    }

    const existingBlog = await Blog.findOne({ title });
    if (existingBlog) {
      return errorResponse(`A page with title "${title}" already exists.`, "Duplicate title", 400);
    }

    const rawUrl = url.trim();
    const normalizedUrl = rawUrl.startsWith("/") ? rawUrl : "/" + rawUrl;

    const existingUrl = await Blog.findOne({ url: normalizedUrl });
    if (existingUrl) {
      return errorResponse(`A page with URL path "${normalizedUrl}" already exists.`, "Duplicate URL", 400);
    }

    const newBlog = new Blog({
      title: title.trim(),
      subText: subText || "",
      attachments,
      url: normalizedUrl,
      showAuthor: !!showAuthor,
      authorEmail: user.email,
      createdBy: user.username,
      modifiedBy: user.username,
      createdAt: formattedDate,
      modifiedAt: formattedDate,
      status: bodyData.status || "draft",
      blocks: blocks || [],
      metaTitle: metaTitle || title.trim(),
      metaDescription: metaDescription || subText || "",
      ogImage: ogImage || "",
      theme: bodyData.theme || "slate",
      fontFamily: bodyData.fontFamily || "Inter",
      bgColor: bodyData.bgColor || "#0f172a",
      textColor: bodyData.textColor || "#f8fafc",
      fontStyle: bodyData.fontStyle || "sans",
      fontSize: bodyData.fontSize || "base",
      spacing: bodyData.spacing || "normal",
      customCss: bodyData.customCss || "",
    });

    await newBlog.save();
    return successResponse({ id: newBlog._id, blog: newBlog }, "Page created successfully", 201);
  } catch (error) {
    return errorResponse(error, "Failed to create page");
  }
}

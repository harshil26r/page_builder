import { dbConnect } from "@/middleware/mongoConnect";
import Blog from "@/models/blog";
import User from "@/models/user";
import Session from "@/models/session";
import moment from "moment";
import { unsignCookie } from "@/middleware/cookieSigner";
import { isValidObjectId } from "@/lib/validateObjectId";
import { errorResponse, successResponse } from "@/lib/apiResponse";
import { cookies } from "next/headers";

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { id } = body;

    if (!isValidObjectId(id)) {
      return errorResponse("Invalid blog ID format", "Invalid ID", 400);
    }

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

    const originalBlog = await Blog.findById(id).lean();
    if (!originalBlog) {
      return errorResponse("Original page not found", "Page not found", 404);
    }

    // Generate unique title and URL slug for duplicate page
    const formattedDate = moment().format("D/M/YYYY,h:mm A");
    const baseTitle = originalBlog.title.replace(/\s*\(Copy\s*\d*\)$/i, "");
    let copyCount = 1;
    let newTitle = `${baseTitle} (Copy)`;

    while (await Blog.findOne({ title: newTitle })) {
      copyCount++;
      newTitle = `${baseTitle} (Copy ${copyCount})`;
    }

    const cleanUrlBase = originalBlog.url.replace(/-copy(-\d+)?$/i, "");
    let newUrl = `${cleanUrlBase}-copy`;
    let urlCount = 1;
    while (await Blog.findOne({ url: newUrl })) {
      urlCount++;
      newUrl = `${cleanUrlBase}-copy-${urlCount}`;
    }

    const duplicatedBlog = new Blog({
      title: newTitle,
      subText: originalBlog.subText || "",
      attachments: originalBlog.attachments || "",
      url: newUrl,
      showAuthor: !!originalBlog.showAuthor,
      authorEmail: user.email,
      createdBy: user.username,
      modifiedBy: user.username,
      createdAt: formattedDate,
      modifiedAt: formattedDate,
      status: "draft",
      blocks: originalBlog.blocks ? JSON.parse(JSON.stringify(originalBlog.blocks)) : [],
      metaTitle: originalBlog.metaTitle || newTitle,
      metaDescription: originalBlog.metaDescription || originalBlog.subText || "",
      ogImage: originalBlog.ogImage || "",
      twitterCard: originalBlog.twitterCard || "summary_large_image",
      theme: originalBlog.theme || "slate",
      fontFamily: originalBlog.fontFamily || "Inter",
      bgColor: originalBlog.bgColor || "#0f172a",
      textColor: originalBlog.textColor || "#f8fafc",
      fontStyle: originalBlog.fontStyle || "sans",
      fontSize: originalBlog.fontSize || "base",
      spacing: originalBlog.spacing || "normal",
      customCss: originalBlog.customCss || "",
    });

    await duplicatedBlog.save();

    return successResponse(
      { blog: duplicatedBlog, id: duplicatedBlog._id },
      `Page "${originalBlog.title}" duplicated as draft successfully!`,
      201
    );
  } catch (error) {
    return errorResponse(error, "Failed to duplicate page");
  }
}

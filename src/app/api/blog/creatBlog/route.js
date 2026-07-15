import { dbConnect } from "@/middleware/mongoConnect";
import Blog from "@/models/blog";
import moment from "moment";
import { errorResponse, successResponse } from "@/lib/apiResponse";
import { getAuthUserWithRole, canEdit } from "@/lib/permissions";

export async function POST(request) {
  try {
    await dbConnect();
    const { user, role } = await getAuthUserWithRole();
    if (!user) return errorResponse("Unauthorized", "Unauthorized", 401);
    if (!canEdit(role)) return errorResponse("Your role (" + role + ") cannot create pages.", "Forbidden", 403);

    const bodyData = await request.json();
    const { title, subText, attachments, url, showAuthor, blocks, metaTitle, metaDescription, ogImage } = bodyData;

    if (!title || !title.trim()) return errorResponse("Title is required", "Title is required", 400);
    if (!url || !url.trim()) return errorResponse("URL slug is required", "URL slug is required", 400);

    const formattedDate = moment().format("D/M/YYYY,h:mm A");

    // Scope duplicate checks to this user's pages only
    const existingTitle = await Blog.findOne({ title: title.trim(), authorEmail: user.email });
    if (existingTitle) return errorResponse(`A page with title "${title}" already exists in your pages.`, "Duplicate title", 400);

    const rawUrl = url.trim();
    const normalizedUrl = rawUrl.startsWith("/") ? rawUrl : "/" + rawUrl;
    const existingUrl = await Blog.findOne({ url: normalizedUrl, authorEmail: user.email });
    if (existingUrl) return errorResponse(`A page with URL "${normalizedUrl}" already exists in your pages.`, "Duplicate URL", 400);

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

    try {
      await newBlog.save();
    } catch (saveErr) {
      // ponytail: auto-drop stale unique index from old schema if it blocks
      if (saveErr?.code === 11000) {
        try {
          await Blog.collection.dropIndex("title_1");
          await newBlog.save();
        } catch (retryErr) {
          return errorResponse(retryErr, "Failed to create page");
        }
      } else {
        throw saveErr;
      }
    }
    return successResponse({ id: newBlog._id, blog: newBlog }, "Page created successfully", 201);
  } catch (error) {
    return errorResponse(error, "Failed to create page");
  }
}

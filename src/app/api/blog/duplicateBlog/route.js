import { dbConnect } from "@/middleware/mongoConnect";
import Blog from "@/models/blog";
import moment from "moment";
import { isValidObjectId } from "@/lib/validateObjectId";
import { errorResponse, successResponse } from "@/lib/apiResponse";
import { getAuthUserWithRole, canEdit } from "@/lib/permissions";

export async function POST(request) {
  try {
    await dbConnect();
    const { user, role } = await getAuthUserWithRole();
    if (!user) return errorResponse("Unauthorized", "Unauthorized", 401);
    if (!canEdit(role)) return errorResponse("Your role (" + role + ") cannot duplicate pages.", "Forbidden", 403);

    const body = await request.json();
    const { id } = body;
    if (!isValidObjectId(id)) return errorResponse("Invalid blog ID format", "Invalid ID", 400);

    const originalBlog = await Blog.findById(id).lean();
    if (!originalBlog) return errorResponse("Original page not found", "Page not found", 404);

    const formattedDate = moment().format("D/M/YYYY,h:mm A");
    const baseTitle = originalBlog.title.replace(/\s*\(Copy\s*\d*\)$/i, "");
    let copyCount = 1;
    let newTitle = `${baseTitle} (Copy)`;

    // Scope duplicate title check to this user's pages
    while (await Blog.findOne({ title: newTitle, authorEmail: user.email })) {
      copyCount++;
      newTitle = `${baseTitle} (Copy ${copyCount})`;
    }

    const cleanUrlBase = originalBlog.url.replace(/-copy(-\d+)?$/i, "");
    let newUrl = `${cleanUrlBase}-copy`;
    let urlCount = 1;
    // Scope duplicate URL check to this user's pages
    while (await Blog.findOne({ url: newUrl, authorEmail: user.email })) {
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

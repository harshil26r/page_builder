import { dbConnect } from "@/middleware/mongoConnect";
import Blog from "@/models/blog";
import User from "@/models/user";
import Session from "@/models/session";
import moment from "moment";
import { unsignCookie } from "@/middleware/cookieSigner";
import { isValidObjectId } from "@/lib/validateObjectId";
import { errorResponse, successResponse } from "@/lib/apiResponse";
import { cookies } from "next/headers";

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
      blocks,
      metaTitle,
      metaDescription,
      ogImage,
      theme,
      fontFamily,
      bgColor,
      textColor,
      fontStyle,
      fontSize,
      spacing,
      customCss,
    } = body;

    if (!isValidObjectId(id)) {
      return errorResponse("Invalid blog ID format", "Invalid ID", 400);
    }

    if (title !== undefined && (!title || !title.trim())) {
      return errorResponse("Title cannot be empty", "Title required", 400);
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

    const updateFields = {
      modifiedBy: user.username,
      modifiedAt: formattedDate,
    };

    if (title !== undefined) updateFields.title = title.trim();
    if (subText !== undefined) updateFields.subText = subText;
    if (attachments !== undefined) updateFields.attachments = attachments;
    if (showAuthor !== undefined) updateFields.showAuthor = !!showAuthor;
    if (status !== undefined) updateFields.status = status;
    if (blocks !== undefined) updateFields.blocks = blocks;
    if (metaTitle !== undefined) updateFields.metaTitle = metaTitle;
    if (metaDescription !== undefined) updateFields.metaDescription = metaDescription;
    if (ogImage !== undefined) updateFields.ogImage = ogImage;
    if (theme !== undefined) updateFields.theme = theme;
    if (fontFamily !== undefined) updateFields.fontFamily = fontFamily;
    if (bgColor !== undefined) updateFields.bgColor = bgColor;
    if (textColor !== undefined) updateFields.textColor = textColor;
    if (fontStyle !== undefined) updateFields.fontStyle = fontStyle;
    if (fontSize !== undefined) updateFields.fontSize = fontSize;
    if (spacing !== undefined) updateFields.spacing = spacing;
    if (customCss !== undefined) updateFields.customCss = customCss;

    if (url) {
      const rawUrl = url.trim();
      updateFields.url = rawUrl.startsWith("/") ? rawUrl : "/" + rawUrl;
    }

    const updatedBlog = await Blog.findOneAndUpdate(
      { _id: id },
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!updatedBlog) {
      return errorResponse("Blog not found", "Blog not found", 404);
    }

    return successResponse({ updatedBlog }, "Blog updated successfully");
  } catch (error) {
    return errorResponse(error, "Failed to update page");
  }
}

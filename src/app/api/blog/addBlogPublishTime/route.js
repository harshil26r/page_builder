import { dbConnect } from "@/middleware/mongoConnect";
import Blog from "@/models/blog";
import { isValidObjectId } from "@/lib/validateObjectId";
import { errorResponse, successResponse } from "@/lib/apiResponse";
import { getAuthUserWithRole, canPublish } from "@/lib/permissions";

export async function PATCH(request) {
  try {
    await dbConnect();
    const { user, role } = await getAuthUserWithRole();
    if (!user) return errorResponse("Unauthorized", "Unauthorized", 401);
    if (!canPublish(role)) return errorResponse("Your role (" + role + ") cannot publish pages.", "Forbidden", 403);

    const body = await request.json();
    const { id, action, scheduledAt } = body;

    if (!isValidObjectId(id)) return errorResponse("Invalid blog ID format", "Invalid ID", 400);

    let updateFields = {};

    switch (action) {
      case "publish_now":
        updateFields = { status: "published", scheduledAt: null };
        break;
      case "schedule": {
        if (!scheduledAt) return errorResponse("scheduledAt is required", "Scheduled time required", 400);
        const scheduleDate = new Date(scheduledAt);
        if (isNaN(scheduleDate.getTime())) return errorResponse("Invalid scheduledAt date", "Invalid date", 400);
        updateFields = scheduleDate <= new Date()
          ? { status: "published", scheduledAt: scheduleDate }
          : { status: "scheduled", scheduledAt: scheduleDate };
        break;
      }
      case "unpublish":
        updateFields = { status: "draft", scheduledAt: null };
        break;
      default:
        return errorResponse(`Unknown action: ${action}`, "Invalid action", 400);
    }

    const updatedBlog = await Blog.findOneAndUpdate(
      { _id: id },
      { $set: updateFields },
      { new: true }
    );
    if (!updatedBlog) return errorResponse("Blog not found", "Blog not found", 404);

    const message = updateFields.status === "published"
      ? "Page published live successfully"
      : updateFields.status === "scheduled"
      ? `Page scheduled for ${new Date(scheduledAt).toLocaleString()}`
      : "Page reverted to draft";

    return successResponse({ blog: updatedBlog }, message);
  } catch (error) {
    return errorResponse(error, "Error updating publish status");
  }
}

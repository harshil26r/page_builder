import { dbConnect } from "@/middleware/mongoConnect";
import Blog from "@/models/blog";
import { isValidObjectId } from "@/lib/validateObjectId";
import { errorResponse, successResponse } from "@/lib/apiResponse";

export async function PATCH(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { id, action, scheduledAt } = body;

    if (!isValidObjectId(id)) {
      return errorResponse("Invalid blog ID format", "Invalid ID", 400);
    }

    let updateFields = {};

    switch (action) {
      case "publish_now":
        updateFields = { status: "published", scheduledAt: null };
        break;

      case "schedule": {
        if (!scheduledAt) {
          return errorResponse("scheduledAt is required for scheduling", "Scheduled time required", 400);
        }
        const scheduleDate = new Date(scheduledAt);
        if (isNaN(scheduleDate.getTime())) {
          return errorResponse("Invalid scheduledAt date format", "Invalid date", 400);
        }
        if (scheduleDate <= new Date()) {
          updateFields = { status: "published", scheduledAt: scheduleDate };
        } else {
          updateFields = { status: "scheduled", scheduledAt: scheduleDate };
        }
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

    if (!updatedBlog) {
      return errorResponse("Blog not found", "Blog not found", 404);
    }

    const message =
      updateFields.status === "published"
        ? "Page published live successfully"
        : updateFields.status === "scheduled"
        ? `Page scheduled for ${new Date(scheduledAt).toLocaleString()}`
        : "Page reverted to draft";

    return successResponse({ blog: updatedBlog }, message);
  } catch (error) {
    return errorResponse(error, "Error updating publish status");
  }
}

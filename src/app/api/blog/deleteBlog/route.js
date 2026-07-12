import { dbConnect } from "@/middleware/mongoConnect";
import Blog from "@/models/blog";
import { isValidObjectId } from "@/lib/validateObjectId";
import { errorResponse, successResponse } from "@/lib/apiResponse";

export async function DELETE(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { id } = body;

    if (!isValidObjectId(id)) {
      return errorResponse("Invalid blog ID format", "Invalid ID", 400);
    }

    const deletedBlog = await Blog.findByIdAndDelete(id);

    if (!deletedBlog) {
      return errorResponse("Blog not found", "Blog not found", 404);
    }

    return successResponse({ deletedBlog }, "Page deleted successfully");
  } catch (error) {
    return errorResponse(error, "Failed to delete page");
  }
}

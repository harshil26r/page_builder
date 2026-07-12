import { dbConnect } from "@/middleware/mongoConnect";
import Blog from "@/models/blog";
import { isValidObjectId } from "@/lib/validateObjectId";
import { errorResponse, successResponse } from "@/lib/apiResponse";

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const resolvedParams = await params;
    const id = resolvedParams.id;

    if (!isValidObjectId(id)) {
      return errorResponse("Invalid blog ID format", "Invalid ID", 400);
    }

    const blog = await Blog.findById(id);

    if (!blog) {
      return errorResponse("Blog not found", "Blog not found", 404);
    }

    return successResponse({ blog });
  } catch (error) {
    return errorResponse(error, "Failed to fetch blog");
  }
}

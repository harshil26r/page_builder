import { dbConnect } from "@/middleware/mongoConnect";
import Blog from "@/models/blog";
import { checkAndPublishScheduled } from "@/middleware/publisher";
import { errorResponse, successResponse } from "@/lib/apiResponse";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await dbConnect();
    await checkAndPublishScheduled();
    const blog = await Blog.find().sort({ createdAt: -1 });
    return successResponse({ blog });
  } catch (error) {
    return errorResponse(error, "Failed to fetch pages");
  }
}

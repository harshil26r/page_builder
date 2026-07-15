import { dbConnect } from "@/middleware/mongoConnect";
import Blog from "@/models/blog";
import Workspace from "@/models/workspace";
import { checkAndPublishScheduled } from "@/middleware/publisher";
import { errorResponse, successResponse } from "@/lib/apiResponse";
import { getAuthUserWithRole } from "@/lib/permissions";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await dbConnect();
    await checkAndPublishScheduled();

    const { user } = await getAuthUserWithRole();
    if (!user) return errorResponse("Unauthorized", "Unauthorized", 401);

    // Build list of emails visible to this user (self + workspace teammates)
    const workspace = await Workspace.findOne({
      $or: [{ ownerEmail: user.email }, { "members.email": user.email }],
    });

    const allowedEmails = [user.email];
    if (workspace) {
      allowedEmails.push(workspace.ownerEmail);
      (workspace.members || []).forEach((m) => {
        if (!allowedEmails.includes(m.email)) allowedEmails.push(m.email);
      });
    }

    const blog = await Blog.find({
      $or: [
        { authorEmail: { $in: allowedEmails } },
        { createdBy: user.username },
        { authorEmail: { $exists: false } }, // ponytail: legacy docs without authorEmail
      ],
    }).sort({ createdAt: -1 });

    return successResponse({ blog });
  } catch (error) {
    return errorResponse(error, "Failed to fetch pages");
  }
}

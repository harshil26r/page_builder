import { dbConnect } from "@/middleware/mongoConnect";
import Session from "@/models/session";
import User from "@/models/user";
import Workspace from "@/models/workspace";
import { unsignCookie } from "@/middleware/cookieSigner";
import { isValidObjectId } from "@/lib/validateObjectId";
import { cookies } from "next/headers";

// ponytail: single auth+role helper, every API route calls this instead of duplicating cookie/session logic
export async function getAuthUserWithRole() {
  await dbConnect();
  const cookieStore = await cookies();
  const rawSid = cookieStore.get("sid")?.value;
  const sid = rawSid ? unsignCookie(rawSid) : null;
  if (!sid || !isValidObjectId(sid)) return { user: null, role: "Viewer" };

  const sessionObj = await Session.findById(sid);
  if (!sessionObj) return { user: null, role: "Viewer" };

  const user = await User.findById(sessionObj.userId).select("-password");
  if (!user) return { user: null, role: "Viewer" };

  const workspace = await Workspace.findOne({
    $or: [{ ownerEmail: user.email }, { "members.email": user.email }],
  });

  if (!workspace) return { user, role: "Owner" }; // No workspace = personal account = full access

  if (workspace.ownerEmail === user.email) return { user, role: "Owner" };
  const member = (workspace.members || []).find((m) => m.email === user.email);
  return { user, role: member ? member.role : "Viewer" };
}

export const canEdit = (r) => ["Owner", "Admin", "Editor", "Publisher"].includes(r);
export const canPublish = (r) => ["Owner", "Admin", "Publisher"].includes(r);
export const canDelete = (r) => ["Owner", "Admin"].includes(r);
export const canManageTeam = (r) => ["Owner", "Admin"].includes(r);

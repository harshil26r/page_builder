import { dbConnect } from "@/middleware/mongoConnect";
import Workspace from "@/models/workspace";
import { NextResponse } from "next/server";
import { getAuthUserWithRole, canManageTeam } from "@/lib/permissions";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await dbConnect();
    const { user, role } = await getAuthUserWithRole();
    if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    let workspace = await Workspace.findOne({
      $or: [{ ownerEmail: user.email }, { "members.email": user.email }],
    });

    if (!workspace) {
      workspace = await Workspace.create({
        name: `${user.username || "My"}'s Workspace`,
        ownerEmail: user.email,
        members: [{ email: user.email, role: "Owner", joinedAt: new Date() }],
      });
    }

    return NextResponse.json({ success: true, workspace, userRole: role });
  } catch (error) {
    console.error("Workspace GET error:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await dbConnect();
    const { user, role } = await getAuthUserWithRole();
    if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    if (!canManageTeam(role)) {
      return NextResponse.json({ success: false, error: "Only Owners and Admins can manage the team." }, { status: 403 });
    }

    const body = await request.json();
    const { email, role: targetRole, workspaceName } = body;

    let workspace = await Workspace.findOne({
      $or: [{ ownerEmail: user.email }, { "members.email": user.email }],
    });

    if (!workspace) {
      workspace = await Workspace.create({
        name: workspaceName || `${user.username}'s Workspace`,
        ownerEmail: user.email,
        members: [{ email: user.email, role: "Owner", joinedAt: new Date() }],
      });
    }

    if (email) {
      const validRoles = ["Admin", "Editor", "Publisher", "Viewer"];
      const safeRole = validRoles.includes(targetRole) ? targetRole : "Editor";
      const idx = workspace.members.findIndex((m) => m.email === email);
      if (idx >= 0) {
        workspace.members[idx].role = safeRole;
      } else {
        workspace.members.push({ email, role: safeRole, joinedAt: new Date() });
      }
      await workspace.save();
    }

    if (workspaceName) {
      workspace.name = workspaceName;
      await workspace.save();
    }

    return NextResponse.json({ success: true, workspace });
  } catch (error) {
    console.error("Workspace POST error:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    await dbConnect();
    const { user, role } = await getAuthUserWithRole();
    if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    if (!canManageTeam(role)) {
      return NextResponse.json({ success: false, error: "Only Owners and Admins can remove members." }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const removeEmail = searchParams.get("email");
    if (!removeEmail) return NextResponse.json({ success: false, error: "Email required" }, { status: 400 });

    const workspace = await Workspace.findOne({
      $or: [{ ownerEmail: user.email }, { "members.email": user.email }],
    });
    if (!workspace) return NextResponse.json({ success: false, error: "Workspace not found" }, { status: 404 });

    workspace.members = workspace.members.filter((m) => m.email !== removeEmail);
    await workspace.save();

    return NextResponse.json({ success: true, workspace });
  } catch (error) {
    console.error("Workspace DELETE error:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

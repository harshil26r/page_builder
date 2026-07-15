import { Schema, model, models } from "mongoose";

const WorkspaceSchema = new Schema(
  {
    name: { type: String, required: true, default: "My Team Workspace" },
    ownerEmail: { type: String, required: true },
    members: [
      {
        email: { type: String, required: true },
        role: {
          type: String,
          enum: ["Owner", "Admin", "Editor", "Publisher", "Viewer"],
          default: "Editor",
        },
        joinedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export const Workspace = models.Workspace || model("Workspace", WorkspaceSchema);
export default Workspace;

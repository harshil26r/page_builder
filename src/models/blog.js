import { Schema, model, models } from "mongoose";

const BlogSchema = new Schema(
  {
    title: { type: String, required: true, unique: true },
    subText: { type: String, required: false, default: "" },
    attachments: { type: String, required: false },
    url: { type: String, required: true },
    showAuthor: { type: Boolean, required: false, default: false },
    createdBy: { type: String, required: true },
    authorEmail: { type: String, required: false },
    modifiedBy: { type: String, required: true },
    status: {
      type: String,
      required: false,
      default: "draft",
      enum: ["draft", "scheduled", "published"],
    },
    scheduledAt: { type: Date, required: false, default: null },
    // Legacy fields kept for backward compat with existing docs
    publishTime: { type: String, required: false },
    publishDate: { type: String, required: false },
    blocks: { type: Array, required: false, default: [] },
    metaTitle: { type: String, required: false },
    metaDescription: { type: String, required: false },
    ogImage: { type: String, required: false },
    twitterCard: { type: String, required: false, default: "summary_large_image" },
    // Styling & Theme Configuration
    theme: { type: String, required: false, default: "slate" },
    fontFamily: { type: String, required: false, default: "Inter" },
    bgColor: { type: String, required: false, default: "#0f172a" },
    textColor: { type: String, required: false, default: "#f8fafc" },
    fontStyle: { type: String, required: false, default: "sans" },
    fontSize: { type: String, required: false, default: "base" },
    spacing: { type: String, required: false, default: "normal font-sans" },
    customCss: { type: String, required: false, default: "" },
  },
  { timestamps: true }
);

export const Blog = models.Blog || model("Blog", BlogSchema);
export default Blog;

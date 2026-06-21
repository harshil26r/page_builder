import { Schema, model, models } from "mongoose";

const BlogSchema = new Schema(
  {
    title: { type: String, required: true, unique: true },
    subText: { type: String, required: true },
    body: { type: String, required: true },
    attachments: { type: String, required: false },
    url: { type: String, required: true },
    showAuthor: { type: Boolean, required: false },
    createdBy: { type: String, required: true },
    authorEmail: { type: String, required: false },
    modifiedBy: { type: String, required: true },
    status: { type: String, required: false, default: "draft" },
    publishTime: { type: String, required: false },
    publishDate: { type: String, required: false },
  },
  { timestamps: true }
);

export const Blog = models.Blog || model("Blog", BlogSchema);
export default Blog;

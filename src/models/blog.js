const mongoose = require("mongoose");

const BlogSchema = new mongoose.Schema(
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

const modelName = "Blog";
let Blog;

try {
  // Check if the model is already defined
  Blog = mongoose.model(modelName);
} catch (error) {
  // Define the model if it doesn't exist
  Blog = mongoose.model(modelName, BlogSchema);
}

module.exports = Blog;

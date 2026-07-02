import Blog from "@/models/blog";
import connectDb from "@/middleware/mongoConnect";

const handler = async (req, res) => {
  if (req.method === "PATCH") {
    try {
      const { id, status, publishTime, publishDate } = req.body;

      // Update the document in the database
      const updatedBlog = await Blog.findOneAndUpdate(
        { _id: id },
        { status, publishTime, publishDate },
        { new: true }
      );

      if (!updatedBlog) {
        return res
          .status(404)
          .json({ success: false, error: "Blog not found" });
      }

      res.status(200).json({
        success: true,
        message: "Blog updated successfully",
        updatedBlog,
      });
    } catch (error) {
      console.error("Error updating blog:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  } else {
    res.status(405).json({ success: false, error: "Method Not Allowed" });
  }
};

export default connectDb(handler);

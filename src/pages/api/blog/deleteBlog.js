import Blog from "@/models/blog";
import connectDb from "@/middleware/mongoConnect";

const handler = async (req, res) => {
  if (req.method === "DELETE") {
    try {
      const { id } = req.body;

      // Delete the document from the database
      const deletedBlog = await Blog.findByIdAndDelete(id);

      if (!deletedBlog) {
        return res
          .status(404)
          .json({ success: false, error: "Blog not found" });
      }

      res.status(200).json({
        success: true,
        message: "Blog deleted successfully",
        deletedBlog,
      });
    } catch (error) {
      console.error("Error deleting blog:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  } else {
    res.status(405).json({ success: false, error: "Method Not Allowed" });
  }
};

export default connectDb(handler);

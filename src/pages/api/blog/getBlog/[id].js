import Blog from "@/models/blog";
import connectDb from "@/middleware/mongoConnect";

const handler = async (req, res) => {
  if (req.method === "GET") {
    const id = req.query.id;

    try {
      // Find the blog by its ID
      const blog = await Blog.findById(id);

      if (!blog) {
        return res
          .status(404)
          .json({ success: false, error: "Blog not found" });
      }

      res.status(200).json({ success: true, blog });
    } catch (error) {
      console.error("Error fetching blog:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  } else {
    res.status(405).json({ success: false, error: "Method Not Allowed" });
  }
};

export default connectDb(handler);

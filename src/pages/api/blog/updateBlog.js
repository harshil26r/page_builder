import "@/middleware/polyfill";
import Blog from "@/models/blog";
import User from "@/models/user";
import jwt from "jsonwebtoken";
import moment from "moment";
import connectDb from "@/middleware/mongoConnect";

const handler = async (req, res) => {
  const formattedDate = moment().format("D/M/YYYY,h:mm A");

  if (req.method === "PUT") {
    const token = req.body.token;

    const data = jwt.verify(token, process.env.SecretKey);

    let user = await User.findOne({ email: data.email });

    try {
      const {
        id,
        title,
        subText,
        body,
        attachments,
        url,
        showAuthor,
        modifiedBy = user.username,
        modifiedAt = formattedDate,
        status,
        publishTime,
        publishDate,
      } = req.body;

      const updatedBlog = await Blog.findOneAndUpdate(
        { _id: id },
        {
          title,
          subText,
          body,
          attachments,
          url,
          showAuthor,
          status,
          modifiedBy,
          modifiedAt,
          publishTime,
          publishDate,
        },
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

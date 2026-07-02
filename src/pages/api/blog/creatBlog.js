import "@/middleware/polyfill";
import User from "@/models/user";
import Blog from "@/models/blog";
import connectDb from "@/middleware/mongoConnect";
import jwt from "jsonwebtoken";
import moment from "moment";

const handler = async (req, res) => {
  const formattedDate = moment().format("D/M/YYYY,h:mm A");
  if (req.method === "POST") {
    const token = req.body.token;

    const data = jwt.verify(token, process.env.SecretKey);

    let user = await User.findOne({ email: data.email });

    let blog = await Blog.findOne({ title: req.body.title });
    if (blog) {
      res.status(400).json({ success: false, error: "Blog already exist" });
      return;
    }

    const {
      title,
      subText,
      body,
      attachments,
      url,
      showAuthor,
      authorEmail = user.email,
      createdBy = user.username,
      modifiedBy = user.username,
      createdAt = formattedDate,
      modifiedAt = formattedDate,
      status,
      publishTime,
    } = req.body;
    let b = new Blog({
      title,
      subText,
      body,
      attachments,
      url,
      showAuthor,
      authorEmail,
      createdBy,
      modifiedBy,
      createdAt,
      modifiedAt,
      status,
      publishTime,
    });
    await b.save();
    res.status(200).json({ id: b._id, success: true, message: "success" });
  } else {
    res
      .status(400)
      .json({ success: false, error: "This method is not allowed" });
  }
};
export default connectDb(handler);

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import Blog from "@/models/blog";
import connectDb from "@/middleware/mongoConnect";

const handler = async (req, res) => {
  if (req.method === "GET") {
    try {
      let blog = await Blog.find();
      res.status(200).json({ blog });
    } catch (error) {
      res.status(400).json({ success: false, error: error });
    }
  }
};
export default connectDb(handler);

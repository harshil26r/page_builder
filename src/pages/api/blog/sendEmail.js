// pages/api/sendEmail.js
import Blog from "@/models/blog";
import User from "@/models/user";
import connectDb from "@/middleware/mongoConnect";
import nodemailer from "nodemailer";
import moment from "moment";
import cron from "node-cron";

const handler = async (req, res) => {
  if (req.method === "POST") {
    cron.schedule("* * * * *", async () => {
      try {
        const today = new Date();
        const localTime = moment.utc(today).local();
        const blogs = await Blog.find({
          status: "scheduled",
          publishTime: { $lte: localTime },
        });

        blogs.forEach(async (blog) => {
          blog.status = "published";

          await blog.save();

          const transporter = nodemailer.createTransport({
            service: "Gmail",
            auth: {
              user: process.env.MY_EMAIL,
              pass: process.env.MY_EMAIL_PASS,
            },
          });

          const mailOptions = {
            from: process.env.MY_EMAIL,
            to: blog.authorEmail,
            subject: "Daily mail",
            text: `Today your blog will publish live!  Title${blog.title}`,
          };

          await transporter.sendMail(mailOptions);
          console.log("Email sent successfully");
        });
      } catch (error) {
        console.error("Error sending emails:", error);
      }
    });
    res.status(200).json({ success: true, message: "Emails will be sent" });
  } else {
    res.status(405).json({ success: false, error: "Method Not Allowed" });
  }
};

export default connectDb(handler);

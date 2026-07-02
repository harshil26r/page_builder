import { dbConnect } from "@/middleware/mongoConnect";
import Blog from "@/models/blog";
import nodemailer from "nodemailer";
import moment from "moment";
import cron from "node-cron";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    await dbConnect();
    
    cron.schedule("* * * * *", async () => {
      try {
        const today = new Date();
        const localTime = moment.utc(today).local();
        const blogs = await Blog.find({
          status: "scheduled",
          publishTime: { $lte: localTime },
        });

        for (const blog of blogs) {
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
            text: `Today your blog will publish live! Title: ${blog.title}`,
          };

          await transporter.sendMail(mailOptions);
          console.log("Email sent successfully");
        }
      } catch (error) {
        console.error("Error sending emails in cron job:", error);
      }
    });

    return NextResponse.json({ success: true, message: "Emails will be sent" });
  } catch (error) {
    console.error("Error in sendEmail API:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

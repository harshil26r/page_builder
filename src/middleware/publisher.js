import { dbConnect } from "@/middleware/mongoConnect";
import Blog from "@/models/blog";
import nodemailer from "nodemailer";

async function sendPublishEmail(blog) {
  if (!blog.authorEmail) return;
  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.MY_EMAIL,
        pass: process.env.MY_EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Rapid Page Builder" <${process.env.MY_EMAIL}>`,
      to: blog.authorEmail,
      subject: `Page Published: ${blog.title}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px; background-color: #ffffff; color: #333333;">
          <h2 style="color: #10B981; text-align: center;">Your Page is Now Live!</h2>
          <p>Hello,</p>
          <p>Great news! Your scheduled page <strong>"${blog.title}"</strong> has been automatically published and is now live on the site.</p>
          <div style="background-color: #f9fafb; padding: 15px; border-radius: 5px; border-left: 4px solid #10B981; margin: 20px 0;">
            <p style="margin: 0 0 10px 0; font-weight: bold;">Page Details:</p>
            <p style="margin: 0 0 5px 0;"><strong>Title:</strong> ${blog.title}</p>
            <p style="margin: 0 0 5px 0;"><strong>URL Path:</strong> <a href="${blog.url}" style="color: #4F46E5; text-decoration: underline;">${blog.url}</a></p>
            <p style="margin: 0;"><strong>Published At:</strong> ${new Date().toLocaleString()}</p>
          </div>
          <p>You can view your published page directly by clicking the link above.</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #9ca3af; text-align: center;">&copy; 2026 Rapid Page Builder. All rights reserved.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`[Publisher] Email sent to ${blog.authorEmail} for "${blog.title}"`);
  } catch (error) {
    console.error("[Publisher] Error sending email:", error);
  }
}

export async function checkAndPublishScheduled() {
  try {
    await dbConnect();
    const now = new Date();

    // Single query: find all scheduled blogs whose scheduledAt has passed
    const blogsToPublish = await Blog.find({
      status: "scheduled",
      scheduledAt: { $lte: now },
    });

    if (blogsToPublish.length === 0) return;

    console.log(`[Publisher] Publishing ${blogsToPublish.length} scheduled page(s)...`);

    for (const blog of blogsToPublish) {
      blog.status = "published";
      await blog.save();
      console.log(`[Publisher] Published "${blog.title}"`);
      sendPublishEmail(blog);
    }
  } catch (error) {
    console.error("[Publisher] Error:", error);
  }
}

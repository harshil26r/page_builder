import { dbConnect } from "@/middleware/mongoConnect";
import User from "@/models/user";
import OTP from "@/models/otp";
import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ success: false, error: "Email is required" }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ success: false, error: "Email already registered" }, { status: 400 });
    }

    // Generate a 6-digit random number for OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store in DB with upsert
    await OTP.findOneAndUpdate(
      { email },
      { otp, createdAt: new Date() },
      { upsert: true, new: true }
    );

    // Setup nodemailer
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.MY_EMAIL,
        pass: process.env.MY_EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Rapid Page Builder" <${process.env.MY_EMAIL}>`,
      to: email,
      subject: "Your OTP Verification Code",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h2 style="color: #4F46E5; text-align: center;">Verify Your Email Address</h2>
          <p>Hello,</p>
          <p>Thank you for registering with Rapid Page Builder. To complete your registration, please use the following One-Time Password (OTP) verification code:</p>
          <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #1f2937; margin: 20px 0;">
            ${otp}
          </div>
          <p>This code is valid for 10 minutes. If you did not request this code, please ignore this email.</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #9ca3af; text-align: center;">© 2026 Rapid Page Builder. All rights reserved.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true, message: "OTP sent successfully" });
  } catch (error) {
    console.error("Send OTP Error:", error);
    return NextResponse.json({ success: false, error: error.message || "Failed to send OTP" }, { status: 500 });
  }
}

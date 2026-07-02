import { dbConnect } from "@/middleware/mongoConnect";
import User from "@/models/user";
import CryptoJS from "crypto-js";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { email, password } = body;

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ success: false, error: "Invalide credentials" }, { status: 400 });
    }

    const bytes = CryptoJS.AES.decrypt(user.password, process.env.SecretKey);
    const decryptedPass = bytes.toString(CryptoJS.enc.Utf8);

    if (email === user.email && password === decryptedPass) {
      const token = jwt.sign(
        { email: user.email, role: user.role, username: user.username },
        process.env.SecretKey
      );
      return NextResponse.json({ success: true, token });
    } else {
      return NextResponse.json({ success: false, error: "Invalide credentials" }, { status: 400 });
    }
  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

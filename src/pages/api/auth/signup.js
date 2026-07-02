import "@/middleware/polyfill";
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import User from "@/models/user";
import connectDb from "@/middleware/mongoConnect";
var CryptoJS = require("crypto-js");
var jwt = require("jsonwebtoken");

const handler = async (req, res) => {
  if (req.method === "POST") {
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      res.status(400).json({ success: false, error: "Email alredy in use!" });
      return;
    }
    const { username, email, isSubscribe } = req.body;
    let u = new User({
      username,
      email,
      isSubscribe,
      password: CryptoJS.AES.encrypt(
        req.body.password,
        process.env.SecretKey
      ).toString(),
    });
    await u.save();
    res.status(200).json({ success: true, message: "success" });
  } else {
    res
      .status(400)
      .json({ success: false, error: "This method is not allowed" });
  }
};
export default connectDb(handler);

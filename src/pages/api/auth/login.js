import "@/middleware/polyfill";
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import User from "@/models/user";
import connectDb from "@/middleware/mongoConnect";
var CryptoJS = require("crypto-js");
var jwt = require("jsonwebtoken");

const handler = async (req, res) => {
  if (req.method === "POST") {
    let user = await User.findOne({ email: req.body.email });

    var bytes = CryptoJS.AES.decrypt(user.password, process.env.SecretKey);

    var descryptpass = bytes.toString(CryptoJS.enc.Utf8);

    if (req.body.email == user.email && req.body.password == descryptpass) {
      var token = jwt.sign(
        { email: user.email, role: user.role, username: user.username },
        process.env.SecretKey
      );
      res.status(200).json({ success: true, token });
    } else {
      res.status(400).json({ success: false, error: "Invalide credentials" });
    }
  } else {
    res.status(400).json({ error: "This method is not allowed" });
  }
};
export default connectDb(handler);

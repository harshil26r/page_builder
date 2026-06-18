import mongoose from "mongoose";

const OtpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 600, // 10 minutes
  },
});

const modelName = "OTP";
let OTP;

try {
  OTP = mongoose.model(modelName);
} catch (error) {
  OTP = mongoose.model(modelName, OtpSchema);
}

export default OTP;

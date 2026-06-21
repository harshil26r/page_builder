import { Schema, model, models } from "mongoose";

const OtpSchema = new Schema({
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

export const OTP = models.OTP || model("OTP", OtpSchema);
export default OTP;

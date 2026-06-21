import { Schema, model, models } from "mongoose";

const SessionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 60 * 60 * 5, // 5 hours expiration
    },
  },
  { timestamps: true }
);

export const Session = models.Session || model("Session", SessionSchema);
export default Session;

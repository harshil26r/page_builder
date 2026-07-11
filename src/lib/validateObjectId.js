import mongoose from "mongoose";

// ponytail: single shared helper for ObjectId validation
export const isValidObjectId = (id) => Boolean(id) && mongoose.Types.ObjectId.isValid(id);
export default isValidObjectId;

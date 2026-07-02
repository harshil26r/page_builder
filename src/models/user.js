const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    address: { type: String, required: false },
    image: { type: String, required: false },
    isSubscribe: { type: Boolean, required: false },
    role: { type: String, required: false, default: "admin" },
  },
  { timestamps: true }
);

const modelName = "User";
let User;

try {
  // Check if the model is already defined
  User = mongoose.model(modelName);
} catch (error) {
  // Define the model if it doesn't exist
  User = mongoose.model(modelName, UserSchema);
}

module.exports = User;

import mongoose from "mongoose";

const connectDb = (handler) => async (req, res) => {
  try {
    if (mongoose.connections[0].readyState) {
      return handler(req, res);
    }

    const connection = await mongoose.connect(process.env.MONGO_URI);
    console.log(connection);

    return handler(req, res);
  } catch (error) {
    console.error("Error connecting to database:", error);
    res
      .status(500)
      .json({ success: false, error: "Internal server error MONGO" });
  }
};

export default connectDb;

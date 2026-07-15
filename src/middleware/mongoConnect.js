import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error("Please define the MONGO_URI environment variable inside .env.local");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGO_URI, opts).then((mongooseInstance) => {
      return mongooseInstance;
    });
  }
  cached.conn = await cached.promise;
  try {
    await cached.conn.connection.collection("blogs").dropIndex("title_1");
  } catch {
    /* ignore if index is already dropped */
  }
  return cached.conn;
}

// For backward compatibility
const connectDb = (handler) => async (req, res) => {
  await dbConnect();
  return handler(req, res);
};

export default connectDb;

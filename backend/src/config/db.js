import mongoose from "mongoose";

// connect to db
const connectDB = async () => {
  const MONGODB_URI = process.env.MONGODB_URI;

  try {
    if (!MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined in environment variables.");
    }

    const conn = await mongoose.connect(MONGODB_URI);
    console.log("MongoDB connected Successfully");
    return conn;
  } catch (err) {
    console.error("MongoDB connection error", err.message);
    process.exit(1);
  }
};

export default connectDB;


import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI not found in .env");
  process.exit(1);
}

export const connectDB = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URI!);
    console.log(`MongoDB Connected: ${connect.connection.host}`);
  } catch (error) {
    console.error("refused connection MongoDB:", error);
    process.exit(1);
  }
};

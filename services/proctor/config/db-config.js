import mongoose from "mongoose";

export async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Proctor service connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection error (Proctor Service):", err.message);
    process.exit(1);
  }
}

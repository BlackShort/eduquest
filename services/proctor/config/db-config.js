const mongoose = require("mongoose");

async function connectDB(uri) {
  try {
    await mongoose.connect(uri);
    console.log("Proctor service connected to MongoDB");
  } catch (err) {
    console.error("MongoDB connection error (Proctor Service):", err.message);
    process.exit(1);
  }
}

module.exports = connectDB;

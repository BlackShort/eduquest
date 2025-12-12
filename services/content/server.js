require("dotenv").config();
const http = require("http");
const app = require("./app");
const connectDB = require("./config/db");

// Connect to MongoDB Atlas
connectDB();

const PORT = process.env.PORT || 5000;

// Create HTTP server
const server = http.createServer(app);

// Start server
server.listen(PORT, () => {
  console.log(`🚀 Content Microservice running on port ${PORT}`);
});

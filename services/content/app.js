

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Route Imports
const mcqRoutes = require("./routes/mcqRoute");
const codingRoutes = require("./routes/codingRoute");
const assignmentRoutes = require("./routes/assignmentRoute");

// Mount Routes
app.use("/mcq", mcqRoutes);
app.use("/coding", codingRoutes);
app.use("/assignment", assignmentRoutes);

// Health Check Route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Content Microservice is running",
  });
});

module.exports = app;

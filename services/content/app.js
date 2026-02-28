

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const app = express();

// Middlewares
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE']
})); 
app.use(express.json());
app.use(morgan("dev"));

// Route Imports
const mcqRoutes = require("./routes/mcqRoute");
const codingRoutes = require("./routes/codingRoute");
const assignmentRoutes = require("./routes/assignmentRoute");

// Faculty Routes
const testRoutes = require("./routes/testRoute");
const questionsRoutes = require("./routes/questionsRoute");
const submissionsRoutes = require("./routes/submissionsRoute");
const problemRoutes = require("./routes/problemRoute");

// Mount Routes
app.use("/mcq", mcqRoutes);
app.use("/coding", codingRoutes);
app.use("/assignment", assignmentRoutes);

// Mount Faculty Routes
app.use("/api/faculty/tests", testRoutes);
app.use("/api/faculty/questions", questionsRoutes);
app.use("/api/faculty/submissions", submissionsRoutes);
app.use("/api/faculty/problems", problemRoutes);

// Health Check Route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Content Microservice is running",
  });
});

module.exports = app;

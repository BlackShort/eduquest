import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import path from 'path';
import mcqRoutes from "./routes/mcqRoute.js";
import codingRoutes from "./routes/codingRoute.js";
import assignmentRoutes from "./routes/assignmentRoute.js";
import testRoutes from "./routes/testRoute.js";
import questionsRoutes from "./routes/questionsRoute.js";
import submissionsRoutes from "./routes/submissionsRoute.js";
import problemRoutes from "./routes/problemRoute.js";

export const app = express();

// Middlewares
if (process.env.NODE_ENV !== 'production') {
  app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'cache-control',
      'pragma',
      'expires'
    ]
  }));

  app.options(/.*/, cors());
}

app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use("/uploads", express.static(path.resolve("uploads")));

// Mount Routes
app.use("/v1/mcq", mcqRoutes);
app.use("/v1/coding", codingRoutes);
app.use("/v1/assignment", assignmentRoutes);

// Mount Faculty Routes
app.use("/v1/faculty/tests", testRoutes);
app.use("/v1/faculty/questions", questionsRoutes);
app.use("/v1/faculty/submissions", submissionsRoutes);
app.use("/v1/faculty/problems", problemRoutes);

// Health Check Route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Content Microservice is running",
  });
});

import dotenv from 'dotenv';
dotenv.config();

import testRoutes from "./routes/testRoute.js";

import assignmentRoutes from "./routes/assignmentRoute.js";
import { app } from './app.js';
import { connectDB } from './config/db-config.js';

const PORT = process.env.PORT || 5002;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Content Service is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

app.use("/faculty/assignment", assignmentRoutes);
app.use("/v1/tests", testRoutes);

startServer();
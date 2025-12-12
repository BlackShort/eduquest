require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const connectDB = require("./config/db-config.js");
const errorHandler = require("./middleware/errorHandler.js");
const proctorRoutes = require("./routes/proctor.routes.js");

const app = express();

const corsOptions = {
  origin: "*", // only during DEV -> Not in Production
  methods: ["GET", "POST", "PATCH"],
  allowedHeaders: ["Content-Type", "student-id", "user-role"],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(morgan("dev"));

app.get("/health", (req, res) => {
  res.json({ service: "proctor-service", status: "ok" });
});

app.use("/api/v1/proctor", proctorRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 4004;
const MONGO_URI = process.env.MONGO_URI;

connectDB(MONGO_URI).then(() => {
  app.listen(PORT, () => {
    console.log(`Proctor Service : ${PORT}`);
  });
});

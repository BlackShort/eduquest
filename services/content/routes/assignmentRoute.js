import express from "express";
const router = express.Router();

import uploadCSV from "../middlewares/uploadCSV.js";
import * as assignmentController from "../controllers/assignmentController.js";

// Upload Assignment CSV
router.post(
  "/upload",
  uploadCSV.single("file"),
  assignmentController.uploadAssignment
);

// ✅ Get ALL assignments
router.get("/", assignmentController.getAllAssignments);

// Get Assignment by test_id
router.get("/:test_id", assignmentController.getAssignmentByTestId);

export default router;
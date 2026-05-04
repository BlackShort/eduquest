import express from "express";
const router = express.Router();
import { getAssignmentByIds } from "../controllers/assignmentController.js";

import uploadCSV from "../middlewares/uploadCSV.js";
import * as assignmentController from "../controllers/assignmentController.js";

// Get ALL assignments
router.get("/", assignmentController.getAllAssignments);

// Upload Assignment CSV
router.post(
  "/upload",
  uploadCSV.single("file"),
  assignmentController.uploadAssignment
);

router.post("/bulk", getAssignmentByIds);

// Get Assignment by test_id
router.get("/:test_id", assignmentController.getAssignmentByTestId);

export default router;
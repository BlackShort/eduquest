const express = require("express");
const router = express.Router();

const uploadCSV = require("../middlewares/uploadCSV");
const assignmentController = require("../controllers/assignmentController");

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

module.exports = router;
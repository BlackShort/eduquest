const express = require("express");
const router = express.Router();

const uploadCSV = require("../middlewares/uploadCSV");
const mcqController = require("../controllers/mcqController");

// Upload MCQ CSV
router.post("/upload", uploadCSV.single("file"), mcqController.uploadMCQ);

// Get MCQ Test by test_id
router.get("/:test_id", mcqController.getMCQsByTestId);

module.exports = router;

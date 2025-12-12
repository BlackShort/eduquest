const express = require("express");
const router = express.Router();

const uploadCSV = require("../middlewares/uploadCSV");
const codingController = require("../controllers/codingController");

// Upload Coding CSV
router.post(
  "/upload",
  uploadCSV.single("file"),
  codingController.uploadCoding
);

// Get Coding Questions by test_id
router.get("/:test_id", codingController.getCodingByTestId);

module.exports = router;

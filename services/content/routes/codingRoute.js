import express from "express";
const router = express.Router();

import uploadCSV from "../middlewares/uploadCSV.js";
import * as codingController from "../controllers/codingController.js";

// Upload Coding CSV
router.post(
  "/upload",
  uploadCSV.single("file"),
  codingController.uploadCoding
);

// Get Coding Questions by test_id
router.get("/:test_id", codingController.getCodingByTestId);

export default router;

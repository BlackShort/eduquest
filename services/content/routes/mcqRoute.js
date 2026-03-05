import express from "express";
const router = express.Router();

import uploadCSV from "../middlewares/uploadCSV.js";
import * as mcqController from "../controllers/mcqController.js";

// Upload MCQ CSV
router.post("/upload", uploadCSV.single("file"), mcqController.uploadMCQ);

// Get MCQ Test by test_id
router.get("/:test_id", mcqController.getMCQsByTestId);

export default router;

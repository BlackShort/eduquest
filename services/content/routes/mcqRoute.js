import express from "express";
const router = express.Router();
import { getMcqByIds } from "../controllers/mcqController.js";

import uploadCSV from "../middlewares/uploadCSV.js";
import * as mcqController from "../controllers/mcqController.js";

// Upload MCQ CSV
router.post("/upload", uploadCSV.single("file"), mcqController.uploadMCQ);

router.get("/", mcqController.getAllMCQs);

router.post("/bulk", getMcqByIds);
// Get MCQ Test by test_id
router.get("/:test_id", mcqController.getMCQsByTestId);

export default router;

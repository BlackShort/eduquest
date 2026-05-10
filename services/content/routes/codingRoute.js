import express from "express";
const router = express.Router();
import { getCodingByIds } from "../controllers/codingController.js";


import uploadCSV from "../middlewares/uploadCSV.js";
import * as codingController from "../controllers/codingController.js";
import { verifyToken, verifyFaculty } from "../middlewares/auth.js";

// Upload Coding CSV
router.post(
  "/upload",
  verifyToken,
  verifyFaculty,
  uploadCSV.single("file"),
  codingController.uploadCoding
);
router.post("/bulk", getCodingByIds);
router.get("/", codingController.getAllCoding);

// Get Coding Questions by test_id
router.get("/:test_id", codingController.getCodingByTestId);

export default router;

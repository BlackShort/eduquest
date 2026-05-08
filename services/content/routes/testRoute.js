import express from "express";
const router = express.Router();
import * as testController from "../controllers/testController.js";
import { verifyToken, verifyFaculty } from "../middlewares/auth.js";

// Apply auth middleware to all routes
router.use(verifyToken);
// router.use(verifyFaculty);

// Test CRUD operations
router.post("/", testController.createTest);

// Student route (no faculty restriction)
router.get("/public", verifyToken, testController.getPublicTests);
router.post(
  "/public/:id/session/start",
  verifyToken,
  testController.startPublicAssessmentSession,
);
router.patch(
  "/public/:id/session/complete",
  verifyToken,
  testController.completePublicAssessmentSession,
);
router.get("/public/:id", verifyToken, testController.getPublicTestById);

router.get("/", testController.getTests);
router.get("/stats", testController.getTestStats);
router.get("/:id", testController.getTestById);
router.put("/:id", testController.updateTest);
router.delete("/:id", testController.deleteTest);

// Test actions
router.patch("/:id/publish", testController.publishTest);
router.patch("/:id/archive", testController.archiveTest);
router.post("/:id/duplicate", testController.duplicateTest);

export default router;

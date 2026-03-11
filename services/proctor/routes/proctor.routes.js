import express from "express";
import requireRole from "../middleware/requireRole.js";
import authFromGateway from "../middleware/authFromGateway.js";
import * as controller from "../controllers/proctor.controller.js";
import * as identityController from "../controllers/identity.controller.js";

const router = express.Router();

// All routes expect identity from gateway
router.use(authFromGateway);
// student side
router.post("/events", controller.postEvent);
router.post("/sessions/:sessionId/complete", controller.completeSession);
router.post(
  "/sessions/:sessionId/identity/enroll",
  identityController.enrollIdentity,
);
router.post(
  "/sessions/:sessionId/identity/verify",
  identityController.verifyIdentity,
);
// Faculty side
router.get(
  "/sessions/:sessionId",
  requireRole(["admin", "faculty"]),
  controller.getSession,
);
router.get(
  "/students/:studentId/exams/:examId",
  requireRole(["admin", "faculty"]),
  controller.getStudentExamSessions,
);
router.get(
  "/exams/:examId/sessions",
  requireRole(["admin", "faculty"]),
  controller.getExamSessionsSummary,
);
router.patch(
  "/sessions/:sessionId/status",
  requireRole(["admin", "faculty"]),
  controller.patchSessionStatus,
);

export { router as proctorRoutes };

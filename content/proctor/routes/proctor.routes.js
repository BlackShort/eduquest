const express = require("express");
const requireRole = require("../middleware/requireRole.js");
const authFromGateway = require("../middleware/authFromGateway.js");
const controller = require("../controllers/proctor.controller.js");

const router = express.Router();

// All routes expect identity from gateway
router.use(authFromGateway);
// student side
router.post("/events", controller.postEvent);
router.post("/sessions/:sessionId/complete", controller.completeSession);
// Faculty side
router.get(
  "/sessions/:sessionId",
  requireRole(["admin", "faculty"]),
  controller.getSession
);
router.get(
  "/students/:studentId/exams/:examId",
  requireRole(["admin", "faculty"]),
  controller.getStudentExamSessions
);
router.get(
  "/exams/:examId/sessions",
  requireRole(["admin", "faculty"]),
  controller.getExamSessionsSummary
);
router.patch(
  "/sessions/:sessionId/status",
  requireRole(["admin", "faculty"]),
  controller.patchSessionStatus
);

module.exports = router;

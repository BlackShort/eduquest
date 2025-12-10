const proctorService = require("../services/proctor.service.js");

async function postEvent(req, res, next) {
  try {
    const studentId = req.studentId;
    if (!studentId) {
      return res.status(401).json({ error: "studentId missing from gateway" });
    }

    const { examId, sessionId, eventType, confidence, metadata, timestamp } =
      req.body;

    if (!examId || !sessionId || !eventType) {
      return res
        .status(400)
        .json({ error: "examId, sessionId, eventType are required" });
    }

    const { eventDoc, deltaScore } = await proctorService.recordEvent({
      studentId,
      examId,
      sessionId,
      eventType,
      confidence,
      metadata,
      timestamp,
    });

    res.status(201).json({
      message: "Event recorded",
      eventId: eventDoc._id,
      deltaScore,
    });
  } catch (err) {
    next(err);
  }
}

async function completeSession(req, res, next) {
  try {
    const { sessionId } = req.params;
    const updated = await proctorService.completeSession(sessionId);
    if (!updated) return res.status(404).json({ error: "Session not found" });
    res.json({ message: "Session completed", session: updated });
  } catch (err) {
    next(err);
  }
}

async function getSession(req, res, next) {
  try {
    const { sessionId } = req.params;
    const data = await proctorService.getSessionWithEvents(sessionId);
    if (!data) return res.status(404).json({ error: "Session not found" });
    res.json(data);
  } catch (err) {
    next(err);
  }
}

async function getStudentExamSessions(req, res, next) {
  try {
    const { studentId, examId } = req.params;
    const sessions = await proctorService.getStudentExamSessions(
      studentId,
      examId
    );
    res.json({ sessions });
  } catch (err) {
    next(err);
  }
}

async function getExamSessionsSummary(req, res, next) {
  try {
    const { examId } = req.params;
    const sessions = await proctorService.getExamSessionsSummary(examId);
    res.json({ sessions });
  } catch (err) {
    next(err);
  }
}

async function patchSessionStatus(req, res, next) {
  try {
    const { sessionId } = req.params;
    const { status } = req.body;

    if (!["ACTIVE", "COMPLETED", "FLAGGED", "CLEARED"].includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const updated = await proctorService.updateSessionStatus(sessionId, status);
    if (!updated) return res.status(404).json({ error: "Session not found" });

    res.json({ message: "Status updated", session: updated });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  postEvent,
  completeSession,
  getSession,
  getStudentExamSessions,
  getExamSessionsSummary,
  patchSessionStatus,
};

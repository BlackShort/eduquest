const ProctorEvent = require("../models/ProctorEvent.js");
const ProctorSession = require("../models/ProctorSession.js");
const { scoreForEvent, FLAG_THRESHOLD } = require("../utils/scoring.js");

// Create session on first event so clients only need to send sessionId.
async function ensureSession({ studentId, examId, sessionId }) {
  let session = await ProctorSession.findOne({ sessionId });

  if (!session) {
    session = await ProctorSession.create({
      studentId,
      examId,
      sessionId,
    });
  }
  return session;
}

// Persist event, increment suspicion score/counters, and auto-flag when threshold is reached.
async function recordEvent({
  studentId,
  examId,
  sessionId,
  eventType,
  confidence,
  metadata,
  timestamp,
}) {
  const session = await ensureSession({ studentId, examId, sessionId });

  const eventDoc = await ProctorEvent.create({
    studentId,
    examId,
    sessionId,
    eventType,
    confidence,
    metadata,
    timestamp,
  });

  const deltaScore = scoreForEvent(eventType, confidence ?? 1);

  const update = {
    $inc: { suspicionScore: deltaScore },
  };

  if (
    session.violationCounts &&
    session.violationCounts[eventType] !== undefined
  ) {
    update.$inc[`violationCounts.${eventType}`] = 1;
  }

  if ((session.suspicionScore || 0) + deltaScore >= FLAG_THRESHOLD) {
    update.$set = { ...(update.$set || {}), status: "FLAGGED" };
  }

  await ProctorSession.updateOne({ _id: session._id }, update);

  return { eventDoc, deltaScore };
}

// Session lifecycle update when an attempt is finished.
async function completeSession(sessionId) {
  return ProctorSession.findOneAndUpdate(
    { sessionId },
    { $set: { status: "COMPLETED", endedAt: new Date() } },
    { new: true },
  );
}

// Manual status change for faculty/admin review actions.
async function updateSessionStatus(sessionId, status) {
  return ProctorSession.findOneAndUpdate(
    { sessionId },
    { $set: { status } },
    { new: true },
  );
}

// Session details endpoint with chronological event history.
async function getSessionWithEvents(sessionId) {
  const session = await ProctorSession.findOne({ sessionId });
  if (!session) return null;

  const events = await ProctorEvent.find({ sessionId }).sort({ timestamp: 1 });
  return { session, events };
}

// Student-scoped history for one exam.
async function getStudentExamSessions(studentId, examId) {
  return ProctorSession.find({ studentId, examId }).sort({ createdAt: -1 });
}

// Lightweight exam-wide summary for dashboards.
async function getExamSessionsSummary(examId) {
  const sessions = await ProctorSession.find({ examId }).select(
    "studentId sessionId suspicionScore status violationCounts createdAt",
  );
  return sessions;
}

module.exports = {
  recordEvent,
  completeSession,
  updateSessionStatus,
  getSessionWithEvents,
  getStudentExamSessions,
  getExamSessionsSummary,
};

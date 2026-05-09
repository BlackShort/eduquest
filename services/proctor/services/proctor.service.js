import ProctorEvent from "../models/ProctorEvent.js";
import ProctorSession from "../models/ProctorSession.js";
import { scoreForEvent, FLAG_THRESHOLD } from "../utils/scoring.js";

// Create session on first event so clients only need to send sessionId.
async function ensureSession({ studentId, examId, sessionId }) {
  let session = await ProctorSession.findOne({ sessionId });

  if (!session) {
    session = await ProctorSession.create({
      studentId,
      examId,
      sessionId,
    });
  } else {
    if (session.studentId !== studentId || session.examId !== examId) {
      const err = new Error("Session ownership mismatch");
      err.status = 403;
      throw err;
    }
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

  // Reject events only for sessions that have ended or are completed/cleared.
  if (session.endedAt) {
    const err = new Error("Session has ended");
    err.status = 409;
    throw err;
  }

  if (session.status === "COMPLETED" || session.status === "CLEARED") {
    const err = new Error("Session is not active");
    err.status = 409;
    throw err;
  }

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
async function completeSession(sessionId, studentId, examId) {
  const filter = studentId ? { sessionId, studentId } : { sessionId };
  let session = await ProctorSession.findOne(filter);

  // Some attempts can finish without any recorded violation event, so no
  // session row exists yet. In that case, create a completed record directly.
  if (!session) {
    if (!studentId || !examId) {
      return null;
    }

    session = await ProctorSession.create({
      studentId,
      examId,
      sessionId,
      status: "COMPLETED",
      endedAt: new Date(),
    });

    return session;
  }

  // Keep completion idempotent for repeated client retries.
  if (session.status === "COMPLETED") {
    return session;
  }

  session.status = "COMPLETED";
  if (!session.endedAt) {
    session.endedAt = new Date();
  }

  await session.save();
  return session;
}

// Manual status change for faculty/admin review actions.
async function updateSessionStatus(sessionId, status) {
  const session = await ProctorSession.findOne({ sessionId });
  if (!session) return null;

  session.status = status;

  if (status === "COMPLETED" && !session.endedAt) {
    session.endedAt = new Date();
  }

  // Allow explicit reopen from admin flows.
  if (status === "ACTIVE") {
    session.endedAt = null;
  }

  await session.save();
  return session;
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

export {
  recordEvent,
  completeSession,
  updateSessionStatus,
  getSessionWithEvents,
  getStudentExamSessions,
  getExamSessionsSummary,
};

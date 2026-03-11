import * as identityService from "../services/identity.service.js";

// Persist baseline identity data for the current student/session.
async function enrollIdentity(req, res, next) {
  try {
    const studentId = req.studentId;
    if (!studentId) {
      return res.status(401).json({ error: "studentId missing from gateway" });
    }

    const { sessionId } = req.params;
    const {
      examId,
      baselineEmbedding,
      baselineImageS3Key,
      baselineImageBase64,
      thresholdUsed,
      qualityChecks,
    } = req.body;

    if (!examId || !sessionId || !baselineEmbedding) {
      return res.status(400).json({
        error: "examId, sessionId, baselineEmbedding are required",
      });
    }

    if (!baselineImageS3Key && !baselineImageBase64) {
      return res.status(400).json({
        error: "baselineImageS3Key or baselineImageBase64 is required",
      });
    }

    // Require client-side quality gate before baseline enrollment.
    if (!qualityChecks || qualityChecks.passed !== true) {
      return res.status(400).json({
        error:
          "Enrollment quality checks failed. Ensure single face, good lighting, and low blur.",
      });
    }

    const doc = await identityService.enrollIdentity({
      studentId,
      examId,
      sessionId,
      baselineEmbedding,
      baselineImageS3Key,
      baselineImageBase64,
      thresholdUsed,
    });

    res.status(201).json({
      message: "Identity baseline enrolled",
      identityId: doc._id,
      thresholdUsed: doc.thresholdUsed,
      createdAt: doc.createdAt,
    });
  } catch (err) {
    next(err);
  }
}

// Compare live embedding against enrolled baseline and emit mismatch event when needed.
async function verifyIdentity(req, res, next) {
  try {
    const studentId = req.studentId;
    if (!studentId) {
      return res.status(401).json({ error: "studentId missing from gateway" });
    }

    const { sessionId } = req.params;
    const {
      examId,
      liveEmbedding,
      confidence,
      liveImageS3Key,
      liveImageBase64,
    } = req.body;

    if (!examId || !sessionId || !liveEmbedding) {
      return res
        .status(400)
        .json({ error: "examId, sessionId, liveEmbedding are required" });
    }

    const result = await identityService.verifyIdentity({
      studentId,
      examId,
      sessionId,
      liveEmbedding,
      confidence,
      liveImageS3Key,
      liveImageBase64,
    });

    if (result.reason === "BASELINE_NOT_FOUND") {
      return res.status(404).json({
        error: "Identity baseline not found for session",
        matched: false,
        reason: result.reason,
      });
    }

    res.json({
      matched: result.matched,
      score: result.score,
      threshold: result.threshold,
      eventCreated: Boolean(result.mismatchEventId),
      mismatchEventId: result.mismatchEventId,
    });
  } catch (err) {
    next(err);
  }
}

export { enrollIdentity, verifyIdentity };

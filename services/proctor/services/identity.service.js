const ProctorIdentity = require("../models/ProctorIdentity.js");
const ProctorSession = require("../models/ProctorSession.js");
const proctorService = require("./proctor.service.js");
const { uploadImageToS3 } = require("../utils/s3.js");
const {
  cosineSimilarity,
  isValidEmbedding,
} = require("../utils/face-recognition.js");

// Upsert session-scoped baseline embedding and baseline evidence image.
async function enrollIdentity({
  studentId,
  examId,
  sessionId,
  baselineEmbedding,
  baselineImageBase64,
  baselineImageS3Key,
  thresholdUsed,
}) {
  if (!isValidEmbedding(baselineEmbedding)) {
    throw new Error("baselineEmbedding must be a non-empty numeric vector");
  }

  let resolvedBaselineImageS3Key = baselineImageS3Key;
  if (!resolvedBaselineImageS3Key && baselineImageBase64) {
    const uploaded = await uploadImageToS3({
      imageBase64: baselineImageBase64,
      keyPrefix: `${examId}_proctoring/${sessionId}/${studentId}/enroll`,
    });
    resolvedBaselineImageS3Key = uploaded.key;
  }

  if (!resolvedBaselineImageS3Key) {
    throw new Error("baselineImageS3Key or baselineImageBase64 is required");
  }

  const doc = await ProctorIdentity.findOneAndUpdate(
    { studentId, examId, sessionId },
    {
      $set: {
        baselineEmbedding,
        baselineImageS3Key: resolvedBaselineImageS3Key,
        ...(typeof thresholdUsed === "number" ? { thresholdUsed } : {}),
      },
    },
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    },
  );

  return doc;
}

// Compare live embedding to baseline and emit IDENTITY_MISMATCH when below threshold.
async function verifyIdentity({
  studentId,
  examId,
  sessionId,
  liveEmbedding,
  confidence,
  liveImageBase64,
  liveImageS3Key,
}) {
  if (!isValidEmbedding(liveEmbedding)) {
    throw new Error("liveEmbedding must be a non-empty numeric vector");
  }

  const baseline = await ProctorIdentity.findOne({
    studentId,
    examId,
    sessionId,
  });

  if (!baseline) {
    return { matched: false, score: 0, reason: "BASELINE_NOT_FOUND" };
  }

  const score = cosineSimilarity(baseline.baselineEmbedding, liveEmbedding);
  const threshold = baseline.thresholdUsed ?? 0.7;
  const matched = score >= threshold;

  let mismatchEventId = null;
  if (!matched) {
    // Server-side guard to avoid excessive mismatch events in one session.
    const session = await ProctorSession.findOne({ sessionId }).select(
      "violationCounts.IDENTITY_MISMATCH",
    );
    const mismatchCount = session?.violationCounts?.IDENTITY_MISMATCH || 0;

    if (mismatchCount >= 2) {
      return {
        matched,
        score,
        threshold,
        mismatchEventId,
        limited: true,
      };
    }

    let resolvedLiveImageS3Key = liveImageS3Key || null;
    if (!resolvedLiveImageS3Key && liveImageBase64) {
      const uploaded = await uploadImageToS3({
        imageBase64: liveImageBase64,
        keyPrefix: `${examId}_proctoring/${sessionId}/${studentId}/verify`,
      });
      resolvedLiveImageS3Key = uploaded.key;
    }

    const { eventDoc } = await proctorService.recordEvent({
      studentId,
      examId,
      sessionId,
      eventType: "IDENTITY_MISMATCH",
      confidence: confidence ?? 1,
      metadata: {
        score,
        threshold,
        baselineImageS3Key: baseline.baselineImageS3Key,
        ...(resolvedLiveImageS3Key
          ? { liveImageS3Key: resolvedLiveImageS3Key }
          : {}),
      },
      timestamp: new Date().toISOString(),
    });
    mismatchEventId = eventDoc?._id ?? null;
  }

  return { matched, score, threshold, mismatchEventId };
}

module.exports = {
  enrollIdentity,
  verifyIdentity,
};

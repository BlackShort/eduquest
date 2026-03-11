// Relative contribution of each violation type to suspicion score.
const WEIGHTS = {
  NO_FACE: 2,
  MULTIPLE_FACES: 4,
  PHONE_DETECTED: 3,
  TAB_SWITCH: 1,
  IDENTITY_MISMATCH: 6,
};

// Session is auto-flagged when cumulative score reaches this value.
const FLAG_THRESHOLD = 18;

// Confidence scales event weight before persisting score delta.
function scoreForEvent(eventType, confidence = 1) {
  const base = WEIGHTS[eventType] || 0;
  return base * confidence;
}

export { WEIGHTS, FLAG_THRESHOLD, scoreForEvent };

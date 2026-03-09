const WEIGHTS = {
  NO_FACE: 2,
  MULTIPLE_FACES: 4,
  PHONE_DETECTED: 3,
  TAB_SWITCH: 1,
  IDENTITY_MISMATCH: 6,
};

const FLAG_THRESHOLD = 18; // session flagged

function scoreForEvent(eventType, confidence = 1) {
  const base = WEIGHTS[eventType] || 0;
  return base * confidence;
}

module.exports = { WEIGHTS, FLAG_THRESHOLD, scoreForEvent };

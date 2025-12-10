const WEIGHTS = {
  NO_FACE: 1,
  MULTIPLE_FACES: 4,
  PHONE_DETECTED: 6,
  LAPTOP_DETECTED: 5,
  LIP_MOVEMENT_TALKING: 3,
  TAB_SWITCH: 2,
};

const FLAG_THRESHOLD = 20; // session flagged

function scoreForEvent(eventType, confidence = 1) {
  const base = WEIGHTS[eventType] || 0;
  return base * confidence;
}

module.exports = { WEIGHTS, FLAG_THRESHOLD, scoreForEvent };

const mongoose = require("mongoose");

const proctorSessionSchema = new mongoose.Schema(
  {
    studentId: { type: String, required: true, index: true },
    examId: { type: String, required: true, index: true },
    sessionId: { type: String, required: true, unique: true },
    suspicionScore: { type: Number, default: 0 },
    violationCounts: {
      NO_FACE: { type: Number, default: 0 },
      MULTIPLE_FACES: { type: Number, default: 0 },
      PHONE_DETECTED: { type: Number, default: 0 },
      LAPTOP_DETECTED: { type: Number, default: 0 },
      LIP_MOVEMENT_TALKING: { type: Number, default: 0 },
      TAB_SWITCH: { type: Number, default: 0 },
    },
    startedAt: { type: Date, default: Date.now },
    endedAt: { type: Date, default: null },
    status: {
      type: String,
      enum: ["ACTIVE", "COMPLETED", "FLAGGED", "CLEARED"],
      default: "ACTIVE",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Proctor_Session", proctorSessionSchema);

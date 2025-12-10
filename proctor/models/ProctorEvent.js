const mongoose = require("mongoose");

const proctorEventSchema = new mongoose.Schema(
  {
    studentId: { type: String, required: true, index: true },
    examId: { type: String, required: true, index: true },
    sessionId: { type: String, required: true, index: true },
    eventType: { type: String, required: true }, // multipleFaces,Phone,Laptop
    confidence: { type: Number, default: 1 },
    metadata: { type: mongoose.Schema.Types.Mixed }, // facecount = 3
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Proctor_Event", proctorEventSchema);

import mongoose from "mongoose";

const proctorIdentitySchema = new mongoose.Schema(
  {
    studentId: { type: String, required: true, index: true },
    examId: { type: String, required: true, index: true },
    sessionId: { type: String, required: true, index: true },
    baselineEmbedding: {
      type: [Number],
      required: true,
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length > 0,
        message: "baselineEmbedding must be a non-empty numeric vector",
      },
    },
    baselineImageS3Key: { type: String, required: true },
    thresholdUsed: { type: Number, default: 0.7 },
  },
  { timestamps: true },
);

proctorIdentitySchema.index(
  { studentId: 1, examId: 1, sessionId: 1 },
  { unique: true },
);

export default mongoose.model("Proctor_Identity", proctorIdentitySchema);

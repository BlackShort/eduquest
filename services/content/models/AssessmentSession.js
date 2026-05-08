import mongoose from "mongoose";

const assessmentSessionSchema = new mongoose.Schema(
  {
    testId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Test",
      required: [true, "Test ID is required"],
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Student ID is required"],
    },
    startedAt: {
      type: Date,
      default: null,
    },
    endsAt: {
      type: Date,
      default: null,
    },
    submittedAt: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: {
        values: ["in_progress", "submitted", "time_over"],
        message: "{VALUE} is not a valid assessment session status",
      },
      default: "in_progress",
    },
    lockReason: {
      type: String,
      enum: {
        values: ["submitted", "time_over", null],
        message: "{VALUE} is not a valid lock reason",
      },
      default: null,
    },
    timeLimitMinutes: {
      type: Number,
      required: true,
      min: 1,
    },
    timeSpentMinutes: {
      type: Number,
      default: 0,
      min: 0,
    },
    totalQuestions: {
      type: Number,
      default: 0,
      min: 0,
    },
    answeredQuestions: {
      type: Number,
      default: 0,
      min: 0,
    },
    ipAddress: {
      type: String,
      default: null,
    },
    userAgent: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
    collection: "assessment_sessions",
  },
);

assessmentSessionSchema.pre("save", function () {
  if (this.startedAt && this.submittedAt) {
    this.timeSpentMinutes = Math.max(
      0,
      Math.round(
        (this.submittedAt.getTime() - this.startedAt.getTime()) / 60000,
      ),
    );
  }
});

assessmentSessionSchema.index({ testId: 1, studentId: 1 }, { unique: true });
assessmentSessionSchema.index({ studentId: 1, status: 1 });
assessmentSessionSchema.index({ testId: 1, status: 1 });
assessmentSessionSchema.index({ endsAt: 1 });

const AssessmentSession = mongoose.model(
  "AssessmentSession",
  assessmentSessionSchema,
);

export default AssessmentSession;

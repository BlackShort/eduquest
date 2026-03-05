import mongoose from "mongoose";

// Sub-schema for individual assignment question
const AssignmentQuestionSchema = new mongoose.Schema(
  {
    question_id: { type: String, required: true },
    question_text: { type: String, required: true },
    marks: { type: Number, default: 5 },
    difficulty: { 
      type: String, 
      enum: ['easy', 'medium', 'hard'],
      default: 'medium'
    },
    tags: [{ type: String }],
    wordLimit: { type: Number, default: null },
    attachmentRequired: { type: Boolean, default: false }
  },
  { _id: false },
);

// MAIN GROUPED SCHEMA
const AssignmentSchema = new mongoose.Schema(
  {
    test_id: { type: String, required: true, unique: true },
    subject_id: { type: String, required: true },
    num_questions: { type: Number, default: 0 },
    createdBy: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User',
      default: null
    },
    isInProblemBank: { type: Boolean, default: false },
    questions: {
      type: [AssignmentQuestionSchema],
      default: [],
    },
  },
  { timestamps: true },
);

// Indexes for better query performance
// Note: test_id index is automatic due to unique: true
AssignmentSchema.index({ createdBy: 1 });
AssignmentSchema.index({ subject_id: 1 });
AssignmentSchema.index({ isInProblemBank: 1 });

// Store inside existing collection name "assignment"
export default mongoose.model("Assignment", AssignmentSchema, "assignment");

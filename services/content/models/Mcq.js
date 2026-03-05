import mongoose from "mongoose";

// Sub-schema for individual MCQ questions
const QuestionSchema = new mongoose.Schema({
  question_id: { type: String, required: true },
  question_text: { type: String, required: true },
  options: [{ type: String, required: true }],
  correct_answer: { type: String, required: true },
  marks: { type: Number, default: 1 },
  difficulty: { 
    type: String, 
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  tags: [{ type: String }],
  explanation: { type: String, default: '' }
});

// Main MCQ Test schema (ONE document per test)
const mcqSchema = new mongoose.Schema(
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
      type: [QuestionSchema],
      default: []
    }
  },
  { timestamps: true }
);

// Indexes for better query performance
// Note: test_id index is automatic due to unique: true
mcqSchema.index({ createdBy: 1 });
mcqSchema.index({ subject_id: 1 });
mcqSchema.index({ isInProblemBank: 1 });

// Store inside EXISTING collection "mcq_ques"
export default mongoose.model("mcq_ques", mcqSchema);

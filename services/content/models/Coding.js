const mongoose = require("mongoose");

// Sub-schema for testcases inside each coding question
const TestcaseSchema = new mongoose.Schema({
  input: { type: String, required: true },
  output: { type: String, required: true },
  isHidden: { type: Boolean, default: false }
});

// Sub-schema for individual coding questions
const CodingQuestionSchema = new mongoose.Schema({
  question_id: { type: String, required: true },
  question_text: { type: String, required: true },
  marks: { type: Number, default: 10 },
  difficulty: { 
    type: String, 
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  tags: [{ type: String }],
  timeLimit: { type: Number, default: 1 }, // seconds
  memoryLimit: { type: Number, default: 256 }, // MB
  constraints: { type: String, default: '' },
  inputFormat: { type: String, default: '' },
  outputFormat: { type: String, default: '' },
  sampleInput: { type: String, default: '' },
  sampleOutput: { type: String, default: '' },
  test_cases: {
    type: [TestcaseSchema],
    required: true
  }
});

// MAIN GROUPED SCHEMA — ONE DOCUMENT PER TEST
const CodingSchema = new mongoose.Schema(
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
      type: [CodingQuestionSchema],
      default: []
    }
  },
  { timestamps: true }
);

// Indexes for better query performance
CodingSchema.index({ test_id: 1 });
CodingSchema.index({ createdBy: 1 });
CodingSchema.index({ subject_id: 1 });
CodingSchema.index({ isInProblemBank: 1 });

// Use existing collection: coding_ques
module.exports = mongoose.model("coding_ques", CodingSchema);

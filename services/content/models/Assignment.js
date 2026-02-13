const mongoose = require("mongoose");

// Sub-schema for individual assignment question
const AssignmentQuestionSchema = new mongoose.Schema(
  {
    question_id: { type: String, required: true },
    question_text: { type: String, required: true },
  },
  { _id: false },
);

// MAIN GROUPED SCHEMA
const AssignmentSchema = new mongoose.Schema(
  {
    test_id: { type: String, required: true, unique: true },
    subject_id: { type: String, required: true },
    num_questions: { type: Number, default: 0 },

    questions: {
      type: [AssignmentQuestionSchema],
      default: [],
    },
  },
  { timestamps: true },
);

// Store inside existing collection name "assignment"
module.exports = mongoose.model("Assignment", AssignmentSchema, "assignment");

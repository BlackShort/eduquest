const mongoose = require("mongoose");

// Sub-schema for individual MCQ questions
const QuestionSchema = new mongoose.Schema({
  question_id: { type: String, required: true },
  question_text: { type: String, required: true },
  options: [{ type: String, required: true }],
  correct_answer: { type: String, required: true }
});

// Main MCQ Test schema (ONE document per test)
const mcqSchema = new mongoose.Schema(
  {
    test_id: { type: String, required: true, unique: true },
    subject_id: { type: String, required: true },
    num_questions: { type: Number, default: 0 },

    questions: {
      type: [QuestionSchema],
      default: []
    }
  },
  { timestamps: true }
);

// Store inside EXISTING collection "mcq_ques"
module.exports = mongoose.model("mcq_ques", mcqSchema);

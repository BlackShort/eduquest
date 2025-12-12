const mongoose = require("mongoose");

// Sub-schema for testcases inside each coding question
const TestcaseSchema = new mongoose.Schema({
  input: { type: String, required: true },
  output: { type: String, required: true }
});

// Sub-schema for individual coding questions
const CodingQuestionSchema = new mongoose.Schema({
  question_id: { type: String, required: true },
  question_text: { type: String, required: true },

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

    questions: {
      type: [CodingQuestionSchema],
      default: []
    }
  },
  { timestamps: true }
);

// Use existing collection: coding_ques
module.exports = mongoose.model("coding_ques", CodingSchema);

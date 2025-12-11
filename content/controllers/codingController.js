const { v4: uuidv4 } = require("uuid");
const Coding = require("../models/Coding");
const parseCSV = require("../utils/fileParser");


exports.uploadCoding = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "CSV file is required"
      });
    }

    const rows = await parseCSV(req.file.path);
    if (!rows.length) {
      return res.status(400).json({
        success: false,
        message: "CSV file is empty"
      });
    }

    const test_id = rows[0].test_id;
    const subject_id = rows[0].subject_id;

    const questions = rows.map((row) => {
      let parsedCases = [];

      try {
        parsedCases = row.test_cases
          .split("|")
          .map((str) => JSON.parse(str.trim()));
      } catch (err) {
        throw new Error("Invalid test_cases JSON format in CSV");
      }

      return {
        question_id: uuidv4(),
        question_text: row.question_text,
        test_cases: parsedCases
      };
    });

    let test = await Coding.findOne({ test_id });

    if (test) {
      test.questions.push(...questions);
      test.num_questions = test.questions.length;
      await test.save();
    } else {
      test = await Coding.create({
        test_id,
        subject_id,
        num_questions: questions.length,
        questions
      });
    }

    res.status(201).json({
      success: true,
      message: "Coding questions uploaded successfully (grouped)",
      total_questions: test.num_questions
    });

  } catch (error) {
    console.error("Coding Upload Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while uploading coding CSV",
      error: error.message
    });
  }
};


exports.getCodingByTestId = async (req, res) => {
  try {
    const { test_id } = req.params;

    const test = await Coding.findOne({ test_id });

    if (!test) {
      return res.status(404).json({
        success: false,
        message: "No coding test found for this test_id"
      });
    }

    res.json({
      success: true,
      total_questions: test.num_questions,
      data: test
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while fetching coding questions"
    });
  }
};

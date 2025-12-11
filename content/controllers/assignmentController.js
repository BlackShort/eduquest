const { v4: uuidv4 } = require("uuid");
const Assignment = require("../models/Assignment");
const parseCSV = require("../utils/fileParser");


exports.uploadAssignment = async (req, res) => {
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

    const questions = rows.map((row) => ({
      question_id: uuidv4(),
      question_text: row.question_text
    }));

    let test = await Assignment.findOne({ test_id });

    if (test) {
      // Append questions
      test.questions.push(...questions);
      test.num_questions = test.questions.length;
      await test.save();
    } else {
      // Create new grouped assignment document
      test = await Assignment.create({
        test_id,
        subject_id,
        num_questions: questions.length,
        questions
      });
    }

    res.status(201).json({
      success: true,
      message: "Assignment questions uploaded successfully (grouped)",
      total_questions: test.num_questions
    });

  } catch (error) {
    console.error("Assignment Upload Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while uploading Assignment CSV",
      error: error.message
    });
  }
};



exports.getAssignmentByTestId = async (req, res) => {
  try {
    const { test_id } = req.params;

    const test = await Assignment.findOne({ test_id });

    if (!test) {
      return res.status(404).json({
        success: false,
        message: "No assignment found for this test_id"
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
      message: "Server error while fetching assignment questions"
    });
  }
};

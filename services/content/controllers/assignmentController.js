import { v4 as uuidv4 } from "uuid";
import { upsertQuestionGroup } from "../utils/upsertQuestionGroup.js";
import Assignment from "../models/Assignment.js";
import parseCSV from "../utils/fileParser.js";


export const uploadAssignment = async (req, res) => {
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

    for (const row of rows) {
     await upsertQuestionGroup(Assignment, {
      test_id: row.test_id,
      subject_id: row.subject_id,
      question_text: row.question_text,
      difficulty: row.difficulty || "easy",
      createdBy: req.user?.userId || null
     });
}

    return res.status(201).json({
      success: true,
      message: "Assignment CSV uploaded successfully",
      total_questions: rows.length
    });
  } catch (error) {
    console.error("Assignment Upload Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error while uploading Assignment CSV",
      error: error.message
    });
  }
};

export const getAssignmentByTestId = async (req, res) => {
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

export const getAllAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find().sort({ updatedAt: -1 });

    const formattedAssignments = assignments.map((doc) => ({
      _id: doc._id,
      test_id: doc.test_id,
      subject_id: doc.subject_id,
      num_questions: doc.num_questions,
      questions: doc.questions,
      createdAt: doc.createdAt,
      isInProblemBank: doc.isInProblemBank,
    }));

    res.status(200).json({
      success: true,
      questions: formattedAssignments,
      total: formattedAssignments.length,
      data: formattedAssignments, // backward compatibility
    });
  } catch (error) {
    console.error("Fetch Assignments Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while fetching assignments",
      error: error.message,
    });
  }
};
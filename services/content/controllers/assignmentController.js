import { v4 as uuidv4 } from "uuid";
import { upsertQuestionGroup } from "../utils/upsertQuestionGroup.js";
import Assignment from "../models/Assignment.js";
import parseCSV from "../utils/fileParser.js";

const valueFrom = (row, keys, fallback = "") => {
  for (const key of keys) {
    const value = row[key];
    if (value !== undefined && value !== null && String(value).trim() !== "") {
      return String(value).trim();
    }
  }
  return fallback;
};

const splitList = (value) =>
  String(value || "")
    .split("|")
    .map((item) => item.trim())
    .filter(Boolean);

const parseNumber = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const parseBoolean = (value) => {
  const normalized = String(value || "").trim().toLowerCase();
  return ["true", "yes", "1", "required"].includes(normalized);
};



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

    const fallbackTestId = `ASSIGNMENT-${Date.now()}`;

    for (const row of rows) {
     const questionText = valueFrom(row, ["question_text", "question", "description", "title"]);
     if (!questionText) {
      throw new Error("Every assignment row must include question text");
     }

     await upsertQuestionGroup(Assignment, {
      test_id: valueFrom(row, ["test_id", "testId"], fallbackTestId),
      subject_id: valueFrom(row, ["subject_id", "subjectId", "subject"], "general"),
      question_text: questionText,
      difficulty: valueFrom(row, ["difficulty"], "easy").toLowerCase(),
      createdBy: req.user?.userId || null,
      extraFields: {
        marks: parseNumber(valueFrom(row, ["marks"]), 5),
        tags: splitList(valueFrom(row, ["tags"])),
        wordLimit: valueFrom(row, ["wordLimit", "word_limit"])
          ? parseNumber(valueFrom(row, ["wordLimit", "word_limit"]), null)
          : null,
        attachmentRequired: parseBoolean(valueFrom(row, ["attachmentRequired", "attachments"]))
      }
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
    const { search, problemBank, subjectId } = req.query;

    const filter = {};

    console.log("QUERY:", req.query);

    // ✅ Problem Bank
    if (problemBank === "true" || problemBank === true) {
      filter.isInProblemBank = true;
    }

    // ✅ Subject filter (ADD)
    // if (subjectId && subjectId.trim() !== "") {
    //   filter.subject_id = { $regex: subjectId.trim(), $options: "i" };
    // }

    // ✅ Subject filter
if (subjectId && subjectId.trim() !== "") {
  filter.subject_id = {
    $regex: subjectId.trim(),
    $options: "i"
  };
}

    // ✅ Search
    if (search && search.trim() !== "") {
      filter.$or = [
        { test_id: { $regex: search.trim(), $options: "i" } },
        { subject_id: { $regex: search.trim(), $options: "i" } },
        { "questions.question_text": { $regex: search.trim(), $options: "i" } }
      ];
    }

    console.log("FILTER:", filter);

    const assignments = await Assignment.find(filter).sort({ updatedAt: -1 });

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
      data: formattedAssignments,
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

export const getAssignmentByIds = async (req, res) => {
  try {
    const { ids } = req.body;

    const questions = await Assignment.find({
      _id: { $in: ids },
    });

    res.json({ data: questions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

import { v4 as uuidv4 } from "uuid";
import Mcq from "../models/Mcq.js";
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

const scopedTestId = (testId, userId) => `${testId}-${String(userId).slice(-6)}`;

export const uploadMCQ = async (req, res) => {
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

    let test_id = valueFrom(rows[0], ["test_id", "testId"], `MCQ-${Date.now()}`);
    const subject_id = valueFrom(rows[0], ["subject_id", "subjectId", "subject"], "general");

    const questions = rows.map((row, index) => {
      const questionText = valueFrom(row, ["question_text", "question", "description", "title"]);
      const options = row.options
        ? splitList(row.options)
        : ["optionA", "optionB", "optionC", "optionD"]
            .map((key) => valueFrom(row, [key, key.toLowerCase()]))
            .filter(Boolean);
      const correctAnswer = valueFrom(row, ["correct_answer", "correctAnswer", "answer"]);

      if (!questionText) {
        throw new Error(`Row ${index + 2}: question text is required`);
      }
      if (options.length < 2) {
        throw new Error(`Row ${index + 2}: at least two options are required`);
      }
      if (!correctAnswer) {
        throw new Error(`Row ${index + 2}: correct answer is required`);
      }

      return {
        question_id: valueFrom(row, ["question_id", "questionId"], uuidv4()),
        question_text: questionText,
        options,
        correct_answer: correctAnswer,
        difficulty: valueFrom(row, ["difficulty"], "medium").toLowerCase(),
        marks: parseNumber(valueFrom(row, ["marks"]), 1),
        tags: splitList(valueFrom(row, ["tags"])),
        explanation: valueFrom(row, ["explanation"])
      };
    });

    let test = await Mcq.findOne({
      test_id,
      createdBy: req.user.userId
    });

    if (!test) {
      const existingOwnerTest = await Mcq.findOne({ test_id }).select("createdBy");
      if (existingOwnerTest && String(existingOwnerTest.createdBy) !== String(req.user.userId)) {
        test_id = scopedTestId(test_id, req.user.userId);
        test = await Mcq.findOne({
          test_id,
          createdBy: req.user.userId
        });
      }
    }

    if (test) {
      // Append questions
      test.questions.push(...questions);
      test.num_questions = test.questions.length;
      test.isInProblemBank = true;
      await test.save();
    } else {
      test = await Mcq.create({
        test_id,
        subject_id,
        num_questions: questions.length,
        questions,
        createdBy: req.user.userId,
        isInProblemBank: true
      });
    }

    res.status(201).json({
      success: true,
      message: "MCQ uploaded and grouped successfully",
      total_questions: test.num_questions
    });

  } catch (error) {
    console.error("MCQ Upload Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while uploading MCQ",
      error: error.message
    });
  }
};


// ----------------------------------------------------
export const getMCQsByTestId = async (req, res) => {
  try {
    const { test_id } = req.params;

    const test = await Mcq.findOne({ test_id });

    if (!test) {
      return res.status(404).json({
        success: false,
        message: "No MCQ test found for this test_id"
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
      message: "Server error while fetching MCQs"
    });
  }
};

export const getAllMCQs = async (req, res) => {
  try {
    const { search, problemBank, subjectId } = req.query;

    const filter = {};

    console.log("QUERY:", req.query);

    // ✅ Problem Bank
    if (problemBank === "true" || problemBank === true) {
      filter.isInProblemBank = true;
    }

    // ✅ Subject filter (🔥 ADD THIS)
    // if (subjectId && subjectId.trim() !== "") {
    //   filter.subject_id = { $regex: subjectId, $options: "i" };
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
        { test_id: { $regex: search, $options: "i" } },
        { subject_id: { $regex: search, $options: "i" } },
        { "questions.question_text": { $regex: search, $options: "i" } }
      ];
    }

    console.log("FILTER:", filter);

    const mcqs = await Mcq.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: mcqs
    });

  } catch (error) {
    console.error("Fetch MCQs Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while fetching MCQs",
      error: error.message
    });
  }
};

export const getMcqByIds = async (req, res) => {
  try {
    const { ids } = req.body;

    const questions = await Mcq.find({
      _id: { $in: ids },
    });

    res.json({ data: questions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

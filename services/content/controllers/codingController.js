import { v4 as uuidv4 } from "uuid";
import Coding from "../models/Coding.js";
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

const parseTestCases = (row, rowNumber) => {
  const raw = valueFrom(row, ["test_cases", "testCases"]);
  if (raw) {
    try {
      const parsed = raw.trim().startsWith("[")
        ? JSON.parse(raw)
        : raw.split("|").map((str) => JSON.parse(str.trim()));
      return parsed.map((testCase) => ({
        input: String(testCase.input ?? ""),
        output: String(testCase.output ?? testCase.expectedOutput ?? ""),
        isHidden: Boolean(testCase.isHidden)
      }));
    } catch (err) {
      throw new Error(`Row ${rowNumber}: invalid test cases JSON format`);
    }
  }

  const input = valueFrom(row, ["sampleInput", "input"]);
  const output = valueFrom(row, ["sampleOutput", "output", "expectedOutput"]);
  if (input || output) {
    return [{ input, output, isHidden: false }];
  }

  throw new Error(`Row ${rowNumber}: at least one test case is required`);
};

export const uploadCoding = async (req, res) => {
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

    const test_id = valueFrom(rows[0], ["test_id", "testId"], `CODING-${Date.now()}`);
    const subject_id = valueFrom(rows[0], ["subject_id", "subjectId", "subject"], "general");

    const questions = rows.map((row, index) => {
      const questionText = valueFrom(row, ["question_text", "description", "question", "title"]);
      if (!questionText) {
        throw new Error(`Row ${index + 2}: question description is required`);
      }

      return {
        question_id: valueFrom(row, ["question_id", "questionId"], uuidv4()),
        question_text: questionText,
        difficulty: valueFrom(row, ["difficulty"], "medium").toLowerCase(),
        marks: parseNumber(valueFrom(row, ["marks"]), 10),
        tags: splitList(valueFrom(row, ["tags"])),
        timeLimit: parseNumber(valueFrom(row, ["timeLimit", "time_limit"]), 1),
        memoryLimit: parseNumber(valueFrom(row, ["memoryLimit", "memory_limit"]), 256),
        constraints: valueFrom(row, ["constraints"]),
        inputFormat: valueFrom(row, ["inputFormat", "input_format"]),
        outputFormat: valueFrom(row, ["outputFormat", "output_format"]),
        sampleInput: valueFrom(row, ["sampleInput", "sample_input"]),
        sampleOutput: valueFrom(row, ["sampleOutput", "sample_output"]),
        test_cases: parseTestCases(row, index + 2)
      };
    });

    let test = await Coding.findOne({ test_id });

    if (test) {
      test.questions.push(...questions);
      test.num_questions = test.questions.length;
      test.isInProblemBank = true;
      await test.save();
    } else {
      test = await Coding.create({
  test_id,
  subject_id,
  num_questions: questions.length,
  questions,
  createdBy: req.user?.userId || null,
  isInProblemBank: true
  
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


export const getCodingByTestId = async (req, res) => {
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


export const getAllCoding = async (req, res) => {
  try {
    const { search, problemBank, subjectId } = req.query;

    const filter = {};

    console.log("QUERY:", req.query);

    // ✅ Problem Bank
    if (problemBank === "true" || problemBank === true) {
      filter.isInProblemBank = true;
    }

    // ✅ Subject filter (ADD THIS)
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

    const coding = await Coding.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: coding
    });

  } catch (error) {
    console.error("Fetch Coding Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while fetching coding questions",
      error: error.message
    });
  }
};

export const getCodingByIds = async (req, res) => {
  try {
    const { ids } = req.body;

    const questions = await Coding.find({
      _id: { $in: ids },
    });

    res.json({ data: questions });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

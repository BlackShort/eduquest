import StudentAttempt from "../models/StudentAttempt.js";
import Test from "../models/Test.js";
import Mcq from "../models/Mcq.js";
import Submission from "../models/Submission.js";
import Coding from "../models/Coding.js";
import {
  createSignedAssignmentDownloadUrl,
  uploadAssignmentPdfToS3,
} from "../utils/s3.js";

const createEmptyResponses = () => ({
  mcqResponses: [],
  codingSubmissionIds: [],
  codingResponses: [],
  assignmentFileUrl: null,
  assignmentFile: null,
});

const buildAssignmentFileSnapshot = (doc) => {
  if (!doc?.responses?.assignmentFile) return null;

  const assignmentFile = doc.responses.assignmentFile;

  return {
    bucket: assignmentFile.bucket || null,
    key: assignmentFile.key || null,
    originalName: assignmentFile.originalName || null,
    mimeType: assignmentFile.mimeType || null,
    size: assignmentFile.size || null,
    uploadedAt: assignmentFile.uploadedAt || null,
  };
};

const resolveAssignmentFileUrl = async (doc) => {
  const assignmentFile = doc?.responses?.assignmentFile;

  if (assignmentFile?.key) {
    try {
      const { signedUrl } = await createSignedAssignmentDownloadUrl({
        key: assignmentFile.key,
      });

      return signedUrl;
    } catch (error) {
      console.error("Error creating assignment download URL:", error);
    }
  }

  return doc?.responses?.assignmentFileUrl || null;
};

const withStudentSnapshot = async (attempt) => {
  const doc = attempt.toObject ? attempt.toObject() : attempt;
  const assignmentFileUrl = await resolveAssignmentFileUrl(doc);

  return {
    ...doc,
    studentId: {
      _id: doc.studentId,
      username: doc.studentName || "Unknown",
      email: doc.studentEmail || "",
    },
    responses: {
      mcqResponses: doc.responses?.mcqResponses || [],
      codingSubmissionIds: doc.responses?.codingSubmissionIds || [],
      codingResponses: doc.responses?.codingResponses || [],
      assignmentFileUrl,
      assignmentFile: buildAssignmentFileSnapshot(doc),
    },
    score: {
      obtained: doc.score?.obtained || 0,
      total: doc.score?.total || 0,
      percentage: doc.score?.percentage || 0,
    },
    scoreBreakdown: {
      mcq: {
        obtained: doc.scoreBreakdown?.mcq?.obtained || 0,
        total: doc.scoreBreakdown?.mcq?.total || 0,
      },
      coding: {
        obtained: doc.scoreBreakdown?.coding?.obtained || 0,
        total: doc.scoreBreakdown?.coding?.total || 0,
      },
      assignment: {
        obtained: doc.scoreBreakdown?.assignment?.obtained || 0,
        total: doc.scoreBreakdown?.assignment?.total || 0,
      },
    },
  };
};

const normalizeAnswer = (value) =>
  String(value ?? "")
    .trim()
    .toLowerCase();

const getQuestionId = (question) =>
  question.question_id || question.questionId || String(question._id || "");

const answerMatches = (selectedAnswer, question) => {
  if (!selectedAnswer) return false;

  const selected = normalizeAnswer(selectedAnswer);
  const correct = normalizeAnswer(question.correct_answer);
  if (selected && correct && selected === correct) return true;

  const options = question.options || [];
  const selectedIndex =
    selected.length === 1 ? selected.charCodeAt(0) - 97 : -1;
  const correctIndex = correct.length === 1 ? correct.charCodeAt(0) - 97 : -1;
  const selectedText =
    selectedIndex >= 0 ? normalizeAnswer(options[selectedIndex]) : selected;
  const correctText =
    correctIndex >= 0 ? normalizeAnswer(options[correctIndex]) : correct;

  return Boolean(selectedText && correctText && selectedText === correctText);
};

const getCustomOrReferencedMcqs = async (test) => {
  let mcqQuestions = test.customQuestions?.mcq || [];
  if (mcqQuestions.length > 0 || !test.questionRefs?.mcqIds?.length) {
    return mcqQuestions;
  }

  const mcqIds = test.questionRefs.mcqIds;
  const mcqDocs = await Mcq.find({
    $or: [
      { "questions.question_id": { $in: mcqIds } },
      { test_id: { $in: mcqIds } },
      {
        _id: {
          $in: mcqIds.filter((value) => value.match(/^[0-9a-fA-F]{24}$/)),
        },
      },
    ],
  });

  const selected = new Set(mcqIds);
  const selectedQuestions = [];
  mcqDocs.forEach((doc) => {
    doc.questions?.forEach((question) => {
      if (selected.has(question.question_id)) {
        selectedQuestions.push(
          question.toObject ? question.toObject() : question,
        );
      }
    });
  });

  return selectedQuestions.length > 0
    ? selectedQuestions
    : mcqDocs.flatMap(
        (doc) =>
          doc.questions?.map((question) =>
            question.toObject ? question.toObject() : question,
          ) || [],
      );
};

const getCustomOrReferencedCodingQuestions = async (test) => {
  let codingQuestions = test.customQuestions?.coding || [];
  if (codingQuestions.length > 0 || !test.questionRefs?.codingIds?.length) {
    return codingQuestions;
  }

  const codingIds = test.questionRefs.codingIds;
  const codingDocs = await Coding.find({
    $or: [
      { "questions.question_id": { $in: codingIds } },
      { test_id: { $in: codingIds } },
      {
        _id: {
          $in: codingIds.filter((value) => value.match(/^[0-9a-fA-F]{24}$/)),
        },
      },
    ],
  });

  const selected = new Set(codingIds);
  const selectedQuestions = [];
  codingDocs.forEach((doc) => {
    doc.questions?.forEach((question) => {
      if (selected.has(question.question_id)) {
        selectedQuestions.push(
          question.toObject ? question.toObject() : question,
        );
      }
    });
  });

  return selectedQuestions.length > 0
    ? selectedQuestions
    : codingDocs.flatMap(
        (doc) =>
          doc.questions?.map((question) =>
            question.toObject ? question.toObject() : question,
          ) || [],
      );
};

const buildMcqScore = (test, answers) => {
  const marksPerMcq = test.marksAllocation?.mcq || 0;

  return (question) => {
    const questionId = getQuestionId(question);
    const maxMarks =
      marksPerMcq > 0 ? marksPerMcq : Number(question.marks || 0);
    const selectedAnswer = answers[questionId] || null;
    const isCorrect = answerMatches(selectedAnswer, question);

    return {
      questionId,
      selectedAnswer,
      isCorrect,
      marksObtained: isCorrect ? maxMarks : 0,
      maxMarks,
    };
  };
};

const buildCodingScore = async (
  test,
  studentId,
  submittedCodingResults = [],
) => {
  const codingQuestions = await getCustomOrReferencedCodingQuestions(test);
  const marksPerCoding = test.marksAllocation?.coding || 0;

  if (codingQuestions.length === 0) {
    return { responses: [], submissionIds: [], obtained: 0, total: 0 };
  }

  const questionIds = codingQuestions.map(getQuestionId).filter(Boolean);
  const submissions = await Submission.find({
    studentId: String(studentId),
    questionId: { $in: questionIds },
    env_type: "assessment",
    mode: "submit",
    $or: [{ testId: test._id }, { testId: String(test._id) }],
  }).sort({ createdAt: -1 });

  const latestByQuestion = new Map();
  submissions.forEach((submission) => {
    if (!latestByQuestion.has(submission.questionId)) {
      latestByQuestion.set(submission.questionId, submission);
    }
  });

  const submittedResultsByQuestion = new Map();
  submittedCodingResults.forEach((result) => {
    const questionId = result?.questionId;
    if (questionId) {
      submittedResultsByQuestion.set(questionId, result);
    }
  });

  const responses = codingQuestions.map((question) => {
    const questionId = getQuestionId(question);
    const maxMarks =
      marksPerCoding > 0 ? marksPerCoding : Number(question.marks || 0);
    const submittedResult = submittedResultsByQuestion.get(questionId);
    const submission = latestByQuestion.get(questionId);
    const passed = Number(
      submittedResult?.passedTestcases ?? submission?.passedTestcases ?? 0,
    );
    const total = Number(
      submittedResult?.totalTestcases ??
        submission?.totalTestcases ??
        question.test_cases?.length ??
        0,
    );
    const marksObtained = total > 0 ? (passed / total) * maxMarks : 0;

    return {
      questionId,
      submissionId: submittedResult?.submissionId || submission?._id || null,
      passedTestcases: passed,
      totalTestcases: total,
      marksObtained,
      maxMarks,
      verdict:
        submittedResult?.verdict || submission?.verdict || "NOT_SUBMITTED",
    };
  });

  return {
    responses,
    submissionIds: responses
      .map((response) => response.submissionId)
      .filter(Boolean),
    obtained: responses.reduce(
      (sum, response) => sum + response.marksObtained,
      0,
    ),
    total: responses.reduce((sum, response) => sum + response.maxMarks, 0),
  };
};

/**
 * Submit an assignment PDF (Student view)
 */
export const submitAssignment = async (req, res) => {
  try {
    const { testId } = req.params;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Assignment PDF is required",
      });
    }

    const test = await Test.findOne({
      _id: testId,
      status: "published",
      type: "assignment",
    });

    if (!test) {
      return res.status(404).json({
        success: false,
        message: "Published assignment not found",
      });
    }

    let attempt = await StudentAttempt.findOne({
      testId,
      studentId: req.user.userId,
    });

    if (
      attempt?.responses?.assignmentFileUrl ||
      attempt?.responses?.assignmentFile?.key
    ) {
      return res.status(409).json({
        success: false,
        message:
          "Assignment already submitted. Only one PDF submission is allowed.",
        data: await withStudentSnapshot(attempt),
      });
    }

    const submittedAt = new Date();
    const uploadedFile = await uploadAssignmentPdfToS3({
      buffer: req.file.buffer,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      testId,
      studentId: req.user.userId,
      uploadedAt: submittedAt,
    });

    if (!attempt) {
      attempt = new StudentAttempt({
        testId,
        studentId: req.user.userId,
        score: {
          obtained: 0,
          total: test.totalMarks || 0,
        },
      });
    }

    const startedAt = attempt.startedAt || submittedAt;

    attempt.submittedAt = submittedAt;
    attempt.status = "submitted";
    attempt.studentName = req.user.username || "";
    attempt.studentEmail = req.user.email || "";
    attempt.responses = attempt.responses || {
      ...createEmptyResponses(),
    };
    attempt.responses.assignmentFileUrl = uploadedFile.key;
    attempt.responses.assignmentFile = uploadedFile;
    attempt.score.total = test.totalMarks || 0;
    attempt.timeSpentMinutes = Math.max(
      0,
      Math.round((submittedAt.getTime() - startedAt.getTime()) / 60000),
    );
    attempt.ipAddress = req.ip;
    attempt.userAgent = req.get("user-agent") || null;

    await attempt.save();

    res.status(201).json({
      success: true,
      message: "Assignment submitted successfully",
      data: await withStudentSnapshot(attempt),
    });
  } catch (error) {
    console.error("Error submitting assignment:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit assignment",
      error: error.message,
    });
  }
};

/**
 * Get the logged-in student's attempt for a test/assignment
 */
export const getMyAttemptForTest = async (req, res) => {
  try {
    const { testId } = req.params;

    const attempt = await StudentAttempt.findOne({
      testId,
      studentId: req.user.userId,
    });

    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: "No submission found for this assignment",
      });
    }

    res.status(200).json({
      success: true,
      data: await withStudentSnapshot(attempt),
    });
  } catch (error) {
    console.error("Error fetching student attempt:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch submission",
      error: error.message,
    });
  }
};

/**
 * Submit assessment responses (Student view)
 */
export const submitAssessment = async (req, res) => {
  try {
    const { testId } = req.params;
    const { answers = {}, timeSpentMinutes = 0, codingResults = [] } = req.body;

    const test = await Test.findOne({
      _id: testId,
      status: "published",
      type: { $in: ["assessment", "contest"] },
    });

    if (!test) {
      return res.status(404).json({
        success: false,
        message: "Published assessment not found",
      });
    }

    const submittedAt = new Date();
    const mcqQuestions = await getCustomOrReferencedMcqs(test);
    const mcqResponses = mcqQuestions.map(buildMcqScore(test, answers));
    const mcqObtained = mcqResponses.reduce(
      (sum, response) => sum + response.marksObtained,
      0,
    );
    const mcqTotal = mcqResponses.reduce(
      (sum, response) => sum + response.maxMarks,
      0,
    );

    const codingScore = await buildCodingScore(
      test,
      req.user.userId,
      codingResults,
    );
    const obtained = mcqObtained + codingScore.obtained;
    const computedTotal = mcqTotal + codingScore.total;
    const total = test.totalMarks || computedTotal;

    let attempt = await StudentAttempt.findOne({
      testId,
      studentId: req.user.userId,
    });

    if (!attempt) {
      attempt = new StudentAttempt({
        testId,
        studentId: req.user.userId,
      });
    }

    attempt.submittedAt = submittedAt;
    attempt.status = "graded";
    attempt.studentName = req.user.username || "";
    attempt.studentEmail = req.user.email || "";
    attempt.responses = {
      mcqResponses,
      codingSubmissionIds: codingScore.submissionIds,
      codingResponses: codingScore.responses,
      assignmentFileUrl: null,
      assignmentFile: null,
    };
    attempt.score = {
      obtained,
      total,
    };
    attempt.scoreBreakdown = {
      mcq: {
        obtained: mcqObtained,
        total: mcqTotal,
      },
      coding: {
        obtained: codingScore.obtained,
        total: codingScore.total,
      },
      assignment: {
        obtained: 0,
        total: 0,
      },
    };
    attempt.timeSpentMinutes = Math.max(0, Number(timeSpentMinutes) || 0);
    attempt.gradedAt = submittedAt;
    attempt.ipAddress = req.ip;
    attempt.userAgent = req.get("user-agent") || null;

    await attempt.save();

    res.status(201).json({
      success: true,
      message: "Assessment submitted successfully",
      data: await withStudentSnapshot(attempt),
    });
  } catch (error) {
    console.error("Error submitting assessment:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit assessment",
      error: error.message,
    });
  }
};

/**
 * Get all attempts for a specific test (Faculty view)
 */
export const getTestAttempts = async (req, res) => {
  try {
    const { testId } = req.params;
    const { status, page = 1, limit = 10, search } = req.query;

    // Verify test belongs to faculty
    const test = await Test.findOne({
      _id: testId,
      creatorId: req.user.userId,
    });

    if (!test) {
      return res.status(404).json({
        success: false,
        message: "Test not found or access denied",
      });
    }

    // Build filter
    const filter = { testId };
    if (status) filter.status = status;

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Fetch attempts with student details
    const attempts = await StudentAttempt.find(filter)
      .sort({ "score.percentage": -1, timeSpentMinutes: 1, submittedAt: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await StudentAttempt.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: await Promise.all(
        attempts.map((attempt) => withStudentSnapshot(attempt)),
      ),
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching test attempts:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch test attempts",
      error: error.message,
    });
  }
};

/**
 * Get single attempt details
 */
export const getAttemptById = async (req, res) => {
  try {
    const { attemptId } = req.params;

    const attempt = await StudentAttempt.findById(attemptId).populate("testId");

    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: "Attempt not found",
      });
    }

    const testId =
      attempt.testId && typeof attempt.testId === "object"
        ? attempt.testId._id || attempt.testId
        : attempt.testId;

    // Verify faculty owns the test
    const test = await Test.findOne({
      _id: testId,
      creatorId: req.user.userId,
    });

    if (!test) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    res.status(200).json({
      success: true,
      data: await withStudentSnapshot(attempt),
    });
  } catch (error) {
    console.error("Error fetching attempt:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch attempt",
      error: error.message,
    });
  }
};

/**
 * Grade a student attempt
 */
export const gradeAttempt = async (req, res) => {
  try {
    const { attemptId } = req.params;
    const { score, feedback, mcqGrading } = req.body;

    const attempt = await StudentAttempt.findById(attemptId).populate("testId");

    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: "Attempt not found",
      });
    }

    const testId =
      attempt.testId && typeof attempt.testId === "object"
        ? attempt.testId._id || attempt.testId
        : attempt.testId;

    // Verify faculty owns the test
    const test = await Test.findOne({
      _id: testId,
      creatorId: req.user.userId,
    });

    if (!test) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    // Update MCQ responses if provided
    attempt.responses = attempt.responses || {
      ...createEmptyResponses(),
    };

    if (mcqGrading && Array.isArray(mcqGrading)) {
      mcqGrading.forEach((graded) => {
        const response = attempt.responses.mcqResponses.find(
          (r) => r.questionId === graded.questionId,
        );
        if (response) {
          response.isCorrect = graded.isCorrect;
          response.marksObtained = graded.marksObtained || 0;
        }
      });
    }

    // Update score
    if (score) {
      attempt.score.obtained = score.obtained;
      attempt.score.total = score.total;
      const mcqObtained = attempt.responses.mcqResponses.reduce(
        (sum, response) => sum + (response.marksObtained || 0),
        0,
      );
      const mcqTotal = attempt.responses.mcqResponses.reduce(
        (sum, response) => sum + (response.maxMarks || 0),
        0,
      );
      const codingObtained = attempt.responses.codingResponses.reduce(
        (sum, response) => sum + (response.marksObtained || 0),
        0,
      );
      const codingTotal = attempt.responses.codingResponses.reduce(
        (sum, response) => sum + (response.maxMarks || 0),
        0,
      );
      attempt.scoreBreakdown = {
        mcq: { obtained: mcqObtained, total: mcqTotal },
        coding: { obtained: codingObtained, total: codingTotal },
        assignment: {
          obtained: Math.max(
            (score.obtained || 0) - mcqObtained - codingObtained,
            0,
          ),
          total: Math.max((score.total || 0) - mcqTotal - codingTotal, 0),
        },
      };
    }

    // Update feedback and status
    attempt.feedback = feedback || attempt.feedback;
    attempt.status = "graded";
    attempt.gradedBy = req.user.userId;
    attempt.gradedAt = new Date();

    await attempt.save();

    res.status(200).json({
      success: true,
      message: "Attempt graded successfully",
      data: attempt,
    });
  } catch (error) {
    console.error("Error grading attempt:", error);
    res.status(500).json({
      success: false,
      message: "Failed to grade attempt",
      error: error.message,
    });
  }
};

export const getMyAssignmentDownloadUrl = async (req, res) => {
  try {
    const { testId } = req.params;

    const attempt = await StudentAttempt.findOne({
      testId,
      studentId: req.user.userId,
    });

    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: "No submission found for this assignment",
      });
    }

    const assignmentFile = attempt.responses?.assignmentFile;
    if (!assignmentFile?.key && !attempt.responses?.assignmentFileUrl) {
      return res.status(404).json({
        success: false,
        message: "Assignment file not found",
      });
    }

    if (!assignmentFile?.key) {
      return res.status(200).json({
        success: true,
        data: {
          signedUrl: attempt.responses.assignmentFileUrl,
          expiresIn: null,
          bucket: null,
          key: null,
        },
      });
    }

    const download = await createSignedAssignmentDownloadUrl({
      key: assignmentFile.key,
    });

    res.status(200).json({
      success: true,
      data: download,
    });
  } catch (error) {
    console.error("Error creating student assignment download URL:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create download URL",
      error: error.message,
    });
  }
};

export const getAttemptAssignmentDownloadUrl = async (req, res) => {
  try {
    const { attemptId } = req.params;

    const attempt = await StudentAttempt.findById(attemptId).populate("testId");

    if (!attempt) {
      return res.status(404).json({
        success: false,
        message: "Attempt not found",
      });
    }

    const testId =
      attempt.testId && typeof attempt.testId === "object"
        ? attempt.testId._id || attempt.testId
        : attempt.testId;

    const test = await Test.findOne({
      _id: testId,
      creatorId: req.user.userId,
    });

    if (!test) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const assignmentFile = attempt.responses?.assignmentFile;
    if (!assignmentFile?.key && !attempt.responses?.assignmentFileUrl) {
      return res.status(404).json({
        success: false,
        message: "Assignment file not found",
      });
    }

    if (!assignmentFile?.key) {
      return res.status(200).json({
        success: true,
        data: {
          signedUrl: attempt.responses.assignmentFileUrl,
          expiresIn: null,
          bucket: null,
          key: null,
        },
      });
    }

    const download = await createSignedAssignmentDownloadUrl({
      key: assignmentFile.key,
    });

    res.status(200).json({
      success: true,
      data: download,
    });
  } catch (error) {
    console.error("Error creating faculty assignment download URL:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create download URL",
      error: error.message,
    });
  }
};

/**
 * Get test analytics
 */
export const getTestAnalytics = async (req, res) => {
  try {
    const { testId } = req.params;

    // Verify test belongs to faculty
    const test = await Test.findOne({
      _id: testId,
      creatorId: req.user.userId,
    });

    if (!test) {
      return res.status(404).json({
        success: false,
        message: "Test not found or access denied",
      });
    }

    // Get all attempts for this test
    const attempts = await StudentAttempt.find({ testId });

    // Calculate statistics
    const stats = {
      totalAttempts: attempts.length,
      submitted: attempts.filter((a) => a.status !== "in_progress").length,
      graded: attempts.filter((a) => a.status === "graded").length,
      averageScore: 0,
      highestScore: 0,
      lowestScore: 0,
      scoreDistribution: {
        "0-20": 0,
        "21-40": 0,
        "41-60": 0,
        "61-80": 0,
        "81-100": 0,
      },
      averageTimeSpent: 0,
    };

    // Calculate scores and distribution
    if (stats.graded > 0) {
      const gradedAttempts = attempts.filter((a) => a.status === "graded");

      const scores = gradedAttempts.map((a) => a.score.percentage);
      stats.averageScore = scores.reduce((a, b) => a + b, 0) / scores.length;
      stats.highestScore = Math.max(...scores);
      stats.lowestScore = Math.min(...scores);

      // Score distribution
      gradedAttempts.forEach((attempt) => {
        const percentage = attempt.score.percentage;
        if (percentage <= 20) stats.scoreDistribution["0-20"]++;
        else if (percentage <= 40) stats.scoreDistribution["21-40"]++;
        else if (percentage <= 60) stats.scoreDistribution["41-60"]++;
        else if (percentage <= 80) stats.scoreDistribution["61-80"]++;
        else stats.scoreDistribution["81-100"]++;
      });

      // Average time spent
      const times = gradedAttempts.map((a) => a.timeSpentMinutes || 0);
      stats.averageTimeSpent = times.reduce((a, b) => a + b, 0) / times.length;
    }

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("Error fetching test analytics:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch test analytics",
      error: error.message,
    });
  }
};

/**
 * Get faculty overview analytics
 */
export const getFacultyAnalytics = async (req, res) => {
  try {
    const facultyId = req.user.userId;

    // Get all tests by faculty
    const tests = await Test.find({ creatorId: facultyId });
    const testIds = tests.map((t) => t._id);

    // Get all attempts for faculty's tests
    const attempts = await StudentAttempt.find({
      testId: { $in: testIds },
    });

    const stats = {
      totalTests: tests.length,
      publishedTests: tests.filter((t) => t.status === "published").length,
      totalStudentAttempts: attempts.length,
      gradedAttempts: attempts.filter((a) => a.status === "graded").length,
      pendingGrading: attempts.filter(
        (a) => a.status === "submitted" && a.status !== "graded",
      ).length,
      averageTestScore: 0,
      recentActivity: [],
    };

    // Calculate average score across all graded attempts
    const gradedAttempts = attempts.filter((a) => a.status === "graded");
    if (gradedAttempts.length > 0) {
      const totalPercentage = gradedAttempts.reduce(
        (sum, a) => sum + a.score.percentage,
        0,
      );
      stats.averageTestScore = totalPercentage / gradedAttempts.length;
    }

    // Recent activity (last 10 submissions)
    const recentAttempts = await StudentAttempt.find({
      testId: { $in: testIds },
    })
      .populate("testId", "title")
      .sort({ submittedAt: -1 })
      .limit(10);

    stats.recentActivity = recentAttempts.map((a) => ({
      studentName: a.studentName || "Unknown",
      testTitle: a.testId?.title,
      score: a.score.percentage,
      submittedAt: a.submittedAt,
      status: a.status,
    }));

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("Error fetching faculty analytics:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch faculty analytics",
      error: error.message,
    });
  }
};

/**
 * Export test results (for CSV/PDF generation)
 */
export const exportTestResults = async (req, res) => {
  try {
    const { testId } = req.params;

    // Verify test belongs to faculty
    const test = await Test.findOne({
      _id: testId,
      creatorId: req.user.userId,
    });

    if (!test) {
      return res.status(404).json({
        success: false,
        message: "Test not found or access denied",
      });
    }

    // Get all attempts
    const attempts = await StudentAttempt.find({ testId }).sort({
      "score.percentage": -1,
      timeSpentMinutes: 1,
      submittedAt: 1,
    });

    // Format for export
    const exportData = attempts.map((attempt, index) => ({
      rank: index + 1,
      studentName: attempt.studentName || "N/A",
      studentEmail: attempt.studentEmail || "N/A",
      scoreObtained: attempt.score.obtained,
      totalMarks: attempt.score.total,
      mcqScore: attempt.scoreBreakdown?.mcq?.obtained || 0,
      mcqTotal: attempt.scoreBreakdown?.mcq?.total || 0,
      codingScore: attempt.scoreBreakdown?.coding?.obtained || 0,
      codingTotal: attempt.scoreBreakdown?.coding?.total || 0,
      percentage: attempt.score.percentage.toFixed(2),
      status: attempt.status,
      submittedAt: attempt.submittedAt,
      timeSpent: attempt.timeSpentMinutes,
    }));

    res.status(200).json({
      success: true,
      testDetails: {
        title: test.title,
        type: test.type,
        totalMarks: test.totalMarks,
      },
      data: exportData,
    });
  } catch (error) {
    console.error("Error exporting test results:", error);
    res.status(500).json({
      success: false,
      message: "Failed to export test results",
      error: error.message,
    });
  }
};

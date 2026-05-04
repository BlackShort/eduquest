import {
  useState,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import { AssessmentContext } from "@/contexts/AssessmentContext";
import { useProctor } from "@/hooks/useProctor";
import type { Question, Stage } from "@/types/assessment.types";
import { getTestById } from "@/apis/test-api"; // or correct path
import { getMcqByIds } from "@/apis/mcq-api";
import { getAssignmentByIds } from "@/apis/assignment-api";
import { getCodingByIds } from "@/apis/code-api";


export interface CodingQuestionAPI {
  _id: string;
  title: string;
  description: string;
  difficulty?: string;
  testCases?: unknown[];
}

export interface McqQuestionAPI {
  _id: string;
  question: string;
  options: string[];
  difficulty?: string;
}



// ── Static question data ───────────────────────────────────────────────────────
// Replace with an API fetch / prop when questions come from the backend.




// const questions: Question[] = [
//   {
//     id: "q_code_001",
//     type: "coding",
//     title: "Factorial using Recursion",
//     section: "Coding",
//   },
//   {
//     id: "q_code_002",
//     type: "coding",
//     title: "Palindrome Checker",
//     section: "Coding",
//   },
//   {
//     id: "q_mcq_001",
//     type: "mcq",
//     title: "Binary Search Complexity",
//     section: "MCQ",
//   },
//   {
//     id: "q_mcq_002",
//     type: "mcq",
//     title: "Stack Data Structure",
//     section: "MCQ",
//   },
//   {
//     id: "q_code_003",
//     type: "coding",
//     title: "Reverse Linked List",
//     section: "Coding",
//   },
//   { id: "q_mcq_003", type: "mcq", title: "OOP Fundamentals", section: "MCQ" },
// ];

// ── Provider ───────────────────────────────────────────────────────────────────

interface AssessmentProviderProps {
  children: ReactNode;
  examId?: string;
  initialTime?: number; // seconds — default 1 hour
}

export const AssessmentProvider = ({
  children,
  examId = "assessment_2024",
  initialTime = 3600,
}: AssessmentProviderProps) => {
  // ── Core state ────────────────────────────────────────────────────────────
  const [questions, setQuestions] = useState<Question[]>([]);
  const [stage, setStage] = useState<Stage>("fullscreen");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentQuestionId, setCurrentQuestionId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(initialTime);

  useEffect(() => {
  const fetchTest = async () => {
    try {
      const res = await getTestById(examId);

      console.log("TEST DATA:", res);

      const test = res.data?.data || res.data;

      const codingIds = test.questionRefs?.codingIds || [];
const mcqIds = test.questionRefs?.mcqIds || [];
const assignmentIds = test.questionRefs?.assignmentIds || [];

const [codingRes, mcqRes, assignmentRes] = await Promise.all([
  codingIds.length ? getCodingByIds(codingIds) : Promise.resolve({ data: [] }),
  mcqIds.length ? getMcqByIds(mcqIds) : Promise.resolve({ data: [] }),
  assignmentIds.length ? getAssignmentByIds(assignmentIds) : Promise.resolve({ data: [] }),
]);

const allQuestions = [
  ...(codingRes.data || []),
  ...(mcqRes.data || []),
  ...(assignmentRes.data || []),
];


console.log("CODING RES:", codingRes);
console.log("MCQ RES:", mcqRes);
// console.log("ASSIGNMENT RES:", assignmentRes);
console.log("ALL QUESTIONS:", allQuestions);

console.log("ALL QUESTIONS:", allQuestions);

const mappedQuestions: Question[] = allQuestions.map((q, index) => {
  let type: "mcq" | "coding" = "mcq";
  let section = "MCQ";

  if (q.testCases) {
    type = "coding";
    section = "Coding";
  } else if (q.options) {
    type = "mcq";
    section = "MCQ";
  } else if (q.submissionType) {
    // assignment fallback
    type = "mcq";
    section = "Assignment";
  }

  return {
    id: q._id,
    title: q.title || q.question || `Question ${index + 1}`,
    description: q.description || "",
    type, // ✅ NOW CORRECT TYPE
    section,
    difficulty: q.difficulty || "easy",
    options: q.options || [],
  };
});

console.log("FINAL QUESTIONS:", mappedQuestions);
setQuestions(mappedQuestions);

setQuestions(mappedQuestions);

if (mappedQuestions.length > 0) {
  setCurrentQuestionId(mappedQuestions[0].id);
}

    } catch (err) {
      console.error("FETCH TEST ERROR:", err);
    }
  };

  

  if (examId) fetchTest();

  
}, [examId]);

useEffect(() => {
  if (!examId) return;

  const fetchQuestions = async () => {
    try {
      const testRes = await getTestById(examId);
      const test = testRes.data?.data?.[0];

      console.log("TEST DATA:", test);

      const codingIds = test.questionRefs?.codingIds || [];
      const mcqIds = test.questionRefs?.mcqIds || [];

      console.log("CODING IDS:", codingIds);
      console.log("MCQ IDS:", mcqIds);

      console.log("EXTRACTED TEST:", test);
    console.log("QUESTION REFS:", test?.questionRefs);

      const codingRes: CodingQuestionAPI[] = await getCodingByIds(codingIds);
      const mcqRes: McqQuestionAPI[] = await getMcqByIds(mcqIds);

      console.log("CODING RES:", codingRes);
      console.log("MCQ RES:", mcqRes);

      const coding = codingRes || [];
const mcqs = mcqRes || [];

const mappedQuestions = [
  ...coding.map((q) => ({
    id: q._id,
    title: q.title,
    description: q.description,
    type: "coding" as const,
    section: "Coding Problems",
    difficulty: q.difficulty,
  })),

  ...mcqs.map((q) => ({
    id: q._id,
    title: q.question,
    description: q.question,
    type: "mcq" as const,
    section: "Multiple Choice",
    difficulty: q.difficulty,
    options: q.options,
  })),
];

      console.log("FINAL QUESTIONS:", mappedQuestions);

      setQuestions(mappedQuestions);
      setCurrentQuestionId(mappedQuestions[0]?.id || null);
    } catch (err) {
      console.error("FETCH ERROR:", err);
    }
  };

  fetchQuestions();
}, [examId]);

  // ── Proctor — single instance for the entire assessment lifecycle ─────────
  // All callbacks (reportEvent, enrollIdentityFromVideo, verifyIdentityFromVideo,
  // shouldRunIdentityVerification) come directly from useProctor and are passed
  // through context to ProctorOverlay without any wrapping.
  const proctor = useProctor({ examId });

  // ── Sidebar ───────────────────────────────────────────────────────────────
  const toggleSidebar = useCallback(() => setSidebarOpen((p) => !p), []);

  // ── Answers ───────────────────────────────────────────────────────────────
  const handleAnswerChange = useCallback(
    (questionId: string, answer: string) => {
      setAnswers((prev) => ({ ...prev, [questionId]: answer }));
    },
    [],
  );

  // ── Submission ────────────────────────────────────────────────────────────
  const handleSubmitAssessment = useCallback(() => {
  if (isSubmitted) return;

  void proctor.endSession();

  console.log("Submitting assessment:", {
    answers,
    timestamp: new Date().toISOString(),
    totalQuestions: questions.length,
    answeredQuestions: Object.keys(answers).length,
  });

  setIsSubmitted(true);

  alert(
    `Assessment submitted!\n\nTotal: ${questions.length}\n` +
    `Answered: ${Object.keys(answers).length}\n\nResults will be announced soon.`
  );
}, [isSubmitted, answers, proctor, questions]);

  // ── Refs — latest values readable inside the timer tick without deps ──────
  // Keeping these as refs means decrementTimeRemaining stays stable (empty
  // dep array) and AssessmentHeader's setInterval never restarts mid-exam.
  const stageRef = useRef(stage);
  const isSubmittedRef = useRef(isSubmitted);
  const handleSubmitRef = useRef(handleSubmitAssessment);

  useEffect(() => {
    stageRef.current = stage;
  }, [stage]);
  useEffect(() => {
    isSubmittedRef.current = isSubmitted;
  }, [isSubmitted]);
  useEffect(() => {
    handleSubmitRef.current = handleSubmitAssessment;
  }, [handleSubmitAssessment]);

  // ── Timer ─────────────────────────────────────────────────────────────────
  // Auto-submit is triggered from inside the state updater so it runs as part
  // of the interval callback — not as a reactive effect — avoiding the
  // "setState synchronously within an effect" cascade error.
  const decrementTimeRemaining = useCallback(() => {
    setTimeRemaining((prev) => {
      const next = prev <= 0 ? 0 : prev - 1;
      if (
        next === 0 &&
        stageRef.current === "exam" &&
        !isSubmittedRef.current
      ) {
        // setTimeout defers the call out of the state updater so React
        // doesn't see two setState calls in the same synchronous frame.
        setTimeout(() => {
          handleSubmitRef.current();
        }, 0);
      }
      return next;
    });
  }, []); // stable — reads live values via refs, no reactive deps needed

  // ── Proctor session pass-throughs ─────────────────────────────────────────
  // Thin wrappers so consumers only need useAssessment(), not useProctor().
  const startProctorSession = useCallback(() => {
    proctor.startSession();
  }, [proctor]);

  const suspendProctorSession = useCallback(() => {
    proctor.suspendSession();
  }, [proctor]);

  const endProctorSession = useCallback(() => {
    void proctor.endSession();
  }, [proctor]);

  // ── Navigation helpers ────────────────────────────────────────────────────
  const getCurrentQuestion = useCallback(
  () => questions.find((q) => q.id === currentQuestionId),
  [currentQuestionId, questions],
);

  const getMcqQuestions = useCallback(
  () => questions.filter((q) => q.type === "mcq"),
  [questions]
);

  const showNext = useCallback(() => {
    const mcq = getMcqQuestions();
    const idx = mcq.findIndex((q) => q.id === currentQuestionId);
    return getCurrentQuestion()?.type === "mcq" && idx < mcq.length - 1;
  }, [currentQuestionId, getCurrentQuestion, getMcqQuestions]);

  const showPrevious = useCallback(() => {
    const mcq = getMcqQuestions();
    const idx = mcq.findIndex((q) => q.id === currentQuestionId);
    return getCurrentQuestion()?.type === "mcq" && idx > 0;
  }, [currentQuestionId, getCurrentQuestion, getMcqQuestions]);

  const handleNext = useCallback(() => {
    const mcq = getMcqQuestions();
    const idx = mcq.findIndex((q) => q.id === currentQuestionId);
    if (getCurrentQuestion()?.type === "mcq" && idx < mcq.length - 1) {
      setCurrentQuestionId(mcq[idx + 1].id);
    }
  }, [currentQuestionId, getCurrentQuestion, getMcqQuestions]);

  const handlePrevious = useCallback(() => {
    const mcq = getMcqQuestions();
    const idx = mcq.findIndex((q) => q.id === currentQuestionId);
    if (getCurrentQuestion()?.type === "mcq" && idx > 0) {
      setCurrentQuestionId(mcq[idx - 1].id);
    }
  }, [currentQuestionId, getCurrentQuestion, getMcqQuestions]);


  
  // ── Context value ─────────────────────────────────────────────────────────
  return (
    <AssessmentContext.Provider
      value={{
        examId,
        // Stage
        stage,
        setStage,

        // Sidebar
        sidebarOpen,
        setSidebarOpen,
        toggleSidebar,

        // Questions
        questions: questions,
        currentQuestionId: currentQuestionId || "",
        setCurrentQuestionId,

        // Answers
        answers,
        handleAnswerChange,

        // Submission
        isSubmitted,
        handleSubmitAssessment,

        // Timer
        timeRemaining,
        decrementTimeRemaining,

        // Proctor — session lifecycle
        startProctorSession,
        suspendProctorSession,
        endProctorSession,
        proctorActive: proctor.active,
        proctorSessionId: proctor.sessionId,

        // Proctor — detection callbacks forwarded verbatim from useProctor.
        // ProctorOverlay consumes these directly; no logic added here.
        reportEvent: proctor.reportEvent,
        enrollIdentityFromVideo: proctor.enrollIdentityFromVideo,
        verifyIdentityFromVideo: proctor.verifyIdentityFromVideo,
        shouldRunIdentityVerification: proctor.shouldRunIdentityVerification,

        // Navigation
        getCurrentQuestion,
        getMcqQuestions,
        showNext,
        showPrevious,
        handleNext,
        handlePrevious,
      }}
    >
      {children}
    </AssessmentContext.Provider>
  );
};
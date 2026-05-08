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
import {
  completeAssessmentSession,
  getTestById,
  startAssessmentSession,
} from "@/apis/test-api";
import type { AssessmentAccessState, Test } from "@/types/types";

export interface CodingQuestionAPI {
  _id?: string;
  question_id: string;
  question_text: string;
  difficulty?: string;
  test_cases?: {
    input: string;
    output: string;
    isHidden?: boolean;
  }[];
}

export interface McqQuestionAPI {
  _id?: string;
  question_id: string;
  question_text: string;
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
  const [currentQuestionId, setCurrentQuestionId] = useState<string | null>(
    null,
  );
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(initialTime);
  const [isAssessmentLoading, setIsAssessmentLoading] = useState(true);
  const [isAssessmentLocked, setIsAssessmentLocked] = useState(false);
  const [assessmentLockReason, setAssessmentLockReason] = useState<
    string | null
  >(null);
  const sessionStartedRef = useRef(false);

  useEffect(() => {
    if (!examId) return;

    const fetchQuestions = async () => {
      try {
        setIsAssessmentLoading(true);

        const res = await getTestById(examId);

        const test: Test | undefined = res.data?.data;

        console.log("TEST:", test);

        const access: AssessmentAccessState | undefined =
          test?.assessmentAccess;

        if (access?.isBlocked) {
          setIsAssessmentLocked(true);
          setAssessmentLockReason(
            access.lockReason === "time_over"
              ? "Your assessment time has expired."
              : "This assessment has already been submitted.",
          );
        } else {
          setIsAssessmentLocked(false);
          setAssessmentLockReason(null);
        }

        const initialSeconds =
          access?.remainingSeconds ?? (test?.durationMinutes || 0) * 60;
        setTimeRemaining(initialSeconds);
        sessionStartedRef.current = access?.status === "in_progress";

        const coding = test?.codingQuestions || [];
        const mcqs = test?.mcqQuestions || [];

        // 3. MAP
        const mappedQuestions: Question[] = [
          ...coding.map((q: CodingQuestionAPI) => ({
            id: q.question_id || q._id || crypto.randomUUID(),
            question_id: q.question_id,
            question_text: q.question_text,
            title: q.question_text,
            description: q.question_text,
            type: "coding" as const,
            section: "Coding Problems",
            difficulty: q.difficulty || "easy",
            test_cases: q.test_cases || [],
          })),

          ...mcqs.map((q: McqQuestionAPI) => ({
            id: q.question_id || q._id || crypto.randomUUID(),
            question_id: q.question_id,
            question_text: q.question_text,
            title: q.question_text,
            description: q.question_text,
            type: "mcq" as const,
            section: "Multiple Choice",
            difficulty: q.difficulty || "easy",
            options: q.options || [],
          })),
        ];

        console.log("FINAL QUESTIONS:", mappedQuestions);

        setQuestions(mappedQuestions);

        if (mappedQuestions.length > 0) {
          setCurrentQuestionId(mappedQuestions[0].id);
        }
      } catch (err) {
        console.error("FETCH ERROR:", err);
        setIsAssessmentLocked(true);
        setAssessmentLockReason("Failed to load assessment.");
      } finally {
        setIsAssessmentLoading(false);
      }
    };

    fetchQuestions();
  }, [examId]);

  useEffect(() => {
    if (
      stage !== "exam" ||
      !examId ||
      isAssessmentLocked ||
      sessionStartedRef.current
    ) {
      return;
    }

    const startSession = async () => {
      try {
        const response = await startAssessmentSession(examId);
        const access: AssessmentAccessState | undefined = response.data?.data;

        if (access?.isBlocked) {
          setIsAssessmentLocked(true);
          setAssessmentLockReason(
            access.lockReason === "time_over"
              ? "Your assessment time has expired."
              : "This assessment has already been submitted.",
          );
          return;
        }

        sessionStartedRef.current = true;
        if (typeof access?.remainingSeconds === "number") {
          setTimeRemaining(access.remainingSeconds);
        }
      } catch (error) {
        console.error("Failed to start assessment session:", error);
      }
    };

    void startSession();
  }, [examId, isAssessmentLocked, stage]);

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
  const handleSubmitAssessment = useCallback(
    (reason: "submitted" | "time_over" = "submitted") => {
      if (isSubmitted) return;

      if (examId) {
        void completeAssessmentSession(examId, reason);
      }

      void proctor.endSession();

      console.log("Submitting assessment:", {
        answers,
        timestamp: new Date().toISOString(),
        totalQuestions: questions.length,
        answeredQuestions: Object.keys(answers).length,
      });

      setIsSubmitted(true);
      setIsAssessmentLocked(true);
      setAssessmentLockReason(
        reason === "time_over"
          ? "Your assessment time has expired."
          : "This assessment has been submitted.",
      );

      alert(
        `Assessment submitted!\n\nTotal: ${questions.length}\n` +
          `Answered: ${Object.keys(answers).length}\n\nResults will be announced soon.`,
      );
    },
    [answers, examId, isSubmitted, proctor, questions],
  );

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
          handleSubmitRef.current("time_over");
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
    [questions],
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
        isAssessmentLoading,
        isAssessmentLocked,
        assessmentLockReason,
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
        identityEnrolled: (proctor as any).identityEnrolled ?? false,
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

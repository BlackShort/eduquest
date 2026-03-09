import { AssessmentDetail } from "@/app/assessment/assessment-detail";
import { AssessmentHeader } from "@/components/assessment/assessment-header";
import { useProctor } from "@/hooks/useProctor";
import ProctorOverlay from "@/components/proctor/ProctorOverlay";
import { PanelRightOpen, Code2, ListChecks, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";

interface Question {
  id: string;
  type: "coding" | "mcq";
  title: string;
  section: string;
}

export const AssessmentLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentQuestionId, setCurrentQuestionId] = useState("q_code_001");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  // 🎯 Proctoring Integration
  const proctor = useProctor({ examId: "assessment_2024" });

  const questions: Question[] = [
    {
      id: "q_code_001",
      type: "coding",
      title: "Factorial using Recursion",
      section: "Coding",
    },
    {
      id: "q_code_002",
      type: "coding",
      title: "Palindrome Checker",
      section: "Coding",
    },
    {
      id: "q_mcq_001",
      type: "mcq",
      title: "Binary Search Complexity",
      section: "MCQ",
    },
    {
      id: "q_mcq_002",
      type: "mcq",
      title: "Stack Data Structure",
      section: "MCQ",
    },
    {
      id: "q_code_003",
      type: "coding",
      title: "Reverse Linked List",
      section: "Coding",
    },
    { id: "q_mcq_003", type: "mcq", title: "OOP Fundamentals", section: "MCQ" },
    { id: "q_mcq_003", type: "mcq", title: "OOP Fundamentals", section: "MCQ" },
    { id: "q_mcq_003", type: "mcq", title: "OOP Fundamentals", section: "MCQ" },
    { id: "q_mcq_003", type: "mcq", title: "OOP Fundamentals", section: "MCQ" },
    { id: "q_mcq_003", type: "mcq", title: "OOP Fundamentals", section: "MCQ" },
    { id: "q_mcq_003", type: "mcq", title: "OOP Fundamentals", section: "MCQ" },
    { id: "q_mcq_003", type: "mcq", title: "OOP Fundamentals", section: "MCQ" },
    { id: "q_mcq_003", type: "mcq", title: "OOP Fundamentals", section: "MCQ" },
    { id: "q_mcq_003", type: "mcq", title: "OOP Fundamentals", section: "MCQ" },
  ];

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const enterFullscreen = async () => {
    try {
      await document.documentElement.requestFullscreen();
      setIsFullscreen(true);
      // 🚀 Start proctoring when entering fullscreen
      proctor.startSession();
    } catch (err) {
      console.error("Fullscreen failed:", err);
    }
  };

  useEffect(() => {
    const handleExit = () => {
      if (!document.fullscreenElement) {
        setIsFullscreen(false);
        // 🛑 Stop proctoring when exiting fullscreen
        proctor.endSession();
      }
    };

    document.addEventListener("fullscreenchange", handleExit);
    return () => document.removeEventListener("fullscreenchange", handleExit);
  }, [proctor]);

  const currentQuestion = questions.find((q) => q.id === currentQuestionId);

  // Navigation handlers for MCQ questions
  const mcqQuestions = questions.filter((q) => q.type === "mcq");
  const currentMcqIndex = mcqQuestions.findIndex(
    (q) => q.id === currentQuestionId,
  );

  const handleNext = () => {
    if (
      currentQuestion?.type === "mcq" &&
      currentMcqIndex < mcqQuestions.length - 1
    ) {
      setCurrentQuestionId(mcqQuestions[currentMcqIndex + 1].id);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion?.type === "mcq" && currentMcqIndex > 0) {
      setCurrentQuestionId(mcqQuestions[currentMcqIndex - 1].id);
    }
  };

  // Determine if we should show navigation buttons (only for MCQ questions)
  const showNext =
    currentQuestion?.type === "mcq" &&
    currentMcqIndex < mcqQuestions.length - 1;
  const showPrevious = currentQuestion?.type === "mcq" && currentMcqIndex > 0;

  // Handle answer changes for both MCQ and coding questions
  const handleAnswerChange = (questionId: string, answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  // Handle final submission of entire assessment
  const handleSubmitAssessment = () => {
    if (isSubmitted) return;

    // 🛑 End proctoring session on submission
    proctor.endSession();

    // TODO: Send all answers to backend API
    console.log("Submitting entire assessment:", {
      answers,
      timestamp: new Date().toISOString(),
      totalQuestions: questions.length,
      answeredQuestions: Object.keys(answers).length,
    });

    // In production: await submitAssessment(answers);
    setIsSubmitted(true);

    // Show confirmation dialog or redirect
    alert(
      `Assessment submitted successfully!\n\nTotal Questions: ${questions.length}\nAnswered: ${Object.keys(answers).length}\n\nResults will be announced soon.`,
    );
  };

  return (
    <div className="relative flex flex-col h-screen w-full overflow-hidden bg-neutral-950">
      {!isFullscreen && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-white">
              Fullscreen Required
            </h2>
            <p className="text-neutral-400">
              This assessment must run in fullscreen mode.
            </p>
            <button
              onClick={enterFullscreen}
              className="mt-6 px-6 py-3 bg-orange-500 hover:bg-orange-400 
                                       text-white font-semibold rounded-lg 
                                       transition duration-200 cursor-pointer"
            >
              Enter Fullscreen
            </button>
          </div>
        </div>
      )}

      <AssessmentHeader
        onSubmit={handleSubmitAssessment}
        isRunning={!isSubmitted}
      />

      <main className="m-2 relative flex flex-row flex-1 gap-2 overflow-hidden">
        <aside
          className={`relative rounded-md border border-neutral-800 bg-neutral-900 h-full overflow-y-auto transition-all duration-300 ease-in-out ${sidebarOpen ? "w-72" : "w-16"}`}
        >
          {sidebarOpen ? (
            <div className="p-4 space-y-4">
              <div className="mb-6">
                <h2 className="text-lg font-bold text-white mb-2">Questions</h2>
                <p className="text-xs text-neutral-500">
                  {Object.keys(answers).length} / {questions.length} Answered
                </p>
              </div>

              {/* Coding Questions Section */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Code2 className="w-4 h-4 text-blue-400" />
                  <h3 className="text-sm font-semibold text-neutral-300">
                    Coding Problems
                  </h3>
                </div>
                <div className="space-y-2">
                  {questions
                    .filter((q) => q.type === "coding")
                    .map((question, idx) => {
                      const isAnswered = !!answers[question.id];
                      return (
                        <button
                          key={question.id}
                          onClick={() => setCurrentQuestionId(question.id)}
                          className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                            currentQuestionId === question.id
                              ? "bg-blue-600 text-white"
                              : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold">
                                {idx + 1}
                              </span>
                              <span className="text-sm">{question.title}</span>
                            </div>
                            {isAnswered && (
                              <CheckCircle2 className="w-4 h-4 text-green-400" />
                            )}
                          </div>
                        </button>
                      );
                    })}
                </div>
              </div>

              {/* MCQ Questions Section */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <ListChecks className="w-4 h-4 text-green-400" />
                  <h3 className="text-sm font-semibold text-neutral-300">
                    Multiple Choice
                  </h3>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {questions
                    .filter((q) => q.type === "mcq")
                    .map((question, idx) => {
                      const isAnswered = !!answers[question.id];
                      return (
                        <button
                          key={question.id}
                          onClick={() => setCurrentQuestionId(question.id)}
                          className={`relative w-10 h-10 rounded-full transition-all duration-200 text-center font-medium ${
                            currentQuestionId === question.id
                              ? "bg-green-600 text-white"
                              : isAnswered
                                ? "bg-green-600/30 text-green-300 hover:bg-green-600/40"
                                : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
                          }`}
                        >
                          {idx + 1}
                          {isAnswered && currentQuestionId !== question.id && (
                            <CheckCircle2 className="absolute -top-1 -right-1 w-4 h-4 text-green-400 bg-neutral-900 rounded-full" />
                          )}
                        </button>
                      );
                    })}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-2 space-y-2 mt-4">
              {questions.map((question) => (
                <button
                  key={question.id}
                  onClick={() => setCurrentQuestionId(question.id)}
                  className={`w-full p-2 rounded-lg transition-all duration-200 ${
                    currentQuestionId === question.id
                      ? question.type === "coding"
                        ? "bg-blue-600"
                        : "bg-green-600"
                      : "bg-neutral-800 hover:bg-neutral-700"
                  }`}
                >
                  {question.type === "coding" ? (
                    <Code2 className="w-5 h-5 text-white" />
                  ) : (
                    <ListChecks className="w-5 h-5 text-white" />
                  )}
                </button>
              ))}
            </div>
          )}
        </aside>

        <div
          className={`absolute top-8 transition-all duration-300 ease-in-out ${sidebarOpen ? "left-69" : "left-13"} bg-neutral-700 hover:bg-orange-500 scale-95 hover:scale-100 rounded-full p-2 cursor-pointer text-neutral-200 shadow-lg z-10`}
          onClick={toggleSidebar}
        >
          <PanelRightOpen
            className={`h-4 w-4 transition-transform duration-200 ${sidebarOpen ? "rotate-0" : "rotate-180"}`}
          />
        </div>

        <div className={`flex-1 transition-all duration-300 ease-in-out`}>
          <AssessmentDetail
            questionType={currentQuestion?.type || "coding"}
            questionId={currentQuestionId}
            onNext={showNext ? handleNext : undefined}
            onPrevious={showPrevious ? handlePrevious : undefined}
            onAnswerChange={handleAnswerChange}
            savedAnswer={answers[currentQuestionId] || null}
          />
        </div>
      </main>

      {/* 🎯 Proctoring Overlay - Only active during assessment */}
      <ProctorOverlay
        active={proctor.active && isFullscreen}
        sessionId={proctor.sessionId}
        reportEvent={proctor.reportEvent}
        enrollIdentityFromVideo={proctor.enrollIdentityFromVideo}
        verifyIdentityFromVideo={proctor.verifyIdentityFromVideo}
        shouldRunIdentityVerification={proctor.shouldRunIdentityVerification}
      />
    </div>
  );
};

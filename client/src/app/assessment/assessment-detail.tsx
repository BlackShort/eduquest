import { useState, useEffect } from "react";
import { Circle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProblemDetail } from "@/components/code/problem/problem";
import { codeSubmission } from "@/apis/code-api";
import type { Testcase } from "@/types/types";
import type { Question } from "@/types/assessment.types";
import { useContextAPI } from "@/hooks/useContext";
import type { CodingSubmissionResult } from "@/types/assessment.types";

interface TestResult {
  index: number;
  input: string;
  expectedOutput: string;
  actualOutput: string;
  passed: boolean;
  runtime: string;
  status: string;
  errorMessage?: string;
}

interface AssessmentDetailProps {
  testId: string;
  questionType: "coding" | "mcq";
  questionId: string;
  question?: Question;
  onNext?: () => void;
  onPrevious?: () => void;
  onAnswerChange?: (questionId: string, answer: string) => void;
  onCodingResultChange?: (result: CodingSubmissionResult) => void;
  savedAnswer?: string | null;
}

interface MCQOption {
  id: string;
  text: string;
}

interface MCQQuestionData {
  title: string;
  difficulty: string;
  question: string;
  options: MCQOption[];
}

const MCQQuestion = ({
  data,
  questionId,
  onNext,
  onPrevious,
  onAnswerChange,
  savedAnswer,
}: {
  data: MCQQuestionData;
  questionId: string;
  onNext?: () => void;
  onPrevious?: () => void;
  onAnswerChange?: (questionId: string, answer: string) => void;
  savedAnswer?: string | null;
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(
    savedAnswer || null,
  );

  // Sync with saved answer when question ID changes (user navigates to different question)
  useEffect(() => {
    if (selectedAnswer !== savedAnswer) {
      setSelectedAnswer(savedAnswer || null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionId]);

  const handleOptionSelect = (optionId: string) => {
    setSelectedAnswer(optionId);
    if (onAnswerChange) {
      onAnswerChange(questionId, optionId);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto space-y-6">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">{data.title}</h2>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                data.difficulty === "Easy"
                  ? "bg-green-500/20 text-green-400"
                  : data.difficulty === "Medium"
                    ? "bg-orange-500/20 text-orange-400"
                    : "bg-red-500/20 text-red-400"
              }`}
            >
              {data.difficulty}
            </span>
          </div>
          <p className="text-xl text-neutral-200 leading-relaxed">
            {data.question}
          </p>
        </div>

        {/* Options */}
        <div className="space-y-3">
          {data.options.map((option: MCQOption) => {
            const isSelected = selectedAnswer === option.id;

            return (
              <button
                key={option.id}
                onClick={() => handleOptionSelect(option.id)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "bg-blue-600 border-blue-500 text-white"
                    : "bg-neutral-800 border-neutral-700 text-neutral-300 hover:bg-neutral-700 hover:border-neutral-600"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      isSelected ? "border-white" : "border-neutral-500"
                    }`}
                  >
                    {isSelected && <Circle className="w-3 h-3 fill-current" />}
                  </div>
                  <div className="flex-1">
                    <span className="font-semibold mr-2">
                      {option.id.toUpperCase()}.
                    </span>
                    <span>{option.text}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-neutral-700">
          <Button
            onClick={onPrevious}
            disabled={!onPrevious}
            variant="outline"
            className="bg-neutral-800 hover:bg-neutral-700 text-white border-neutral-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </Button>
          <Button
            onClick={onNext}
            disabled={!onNext}
            className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export const AssessmentDetail = ({
  testId,
  questionType,
  questionId,
  question,
  onNext,
  onPrevious,
  onAnswerChange,
  onCodingResultChange,
  savedAnswer,
}: AssessmentDetailProps) => {
  // Get user ID from context

  const { appLoading, userID } = useContextAPI();
  if (appLoading) {
    return <div className="text-white p-4">Loading...</div>;
  }

  // --- Isolated State for Coding Questions ---
  const [currentCode, setCurrentCode] = useState(savedAnswer || "");
  const [currentLanguage, setCurrentLanguage] = useState("javascript");
  const [testCases, setTestCases] = useState<Testcase[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);

  // Sync state when switching questions
  useEffect(() => {
    setCurrentCode(savedAnswer || "");
    setTestResults([]); // Wipe local test results on problem boundaries
  }, [questionId, savedAnswer]);

  const runCode = async () => {
    try {
      if (!userID) {
        alert("User not ready");
        return;
      }

      setIsRunning(true);

      // Run public test cases just like regular practice mode
      const result = await codeSubmission(
        "assessment",
        testId,
        currentCode,
        currentLanguage,
        testCases.slice(0, 3),
        "run",
        questionId,
        userID,
      );

      const mapped = (result.executionResult?.testcaseResults ?? []).map(
        (
          tc: {
            input: string;
            expectedOutput: string;
            actualOutput: string;
            status: string;
            timeTakenMs: number;
            errorMessage?: string;
          },
          i: number,
        ) => ({
          index: i + 1,
          input: tc.input,
          expectedOutput: tc.expectedOutput,
          actualOutput: tc.actualOutput,
          passed: tc.status === "PASSED",
          status: tc.status,
          errorMessage: tc.errorMessage || "",
          runtime: `${tc.timeTakenMs}ms`,
        }),
      );
      setTestResults(mapped);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Unknown error";
      console.error("Error running code:", errorMsg);
      alert("Error running code: " + errorMsg);
    } finally {
      setIsRunning(false);
    }
  };

  const submitCode = async () => {
    try {
      if (!userID) {
        alert("User not ready");
        return;
      }

      setIsRunning(true);
      // Submit against all available test cases (public + hidden) and persist in DB
      const result = await codeSubmission(
        "assessment",
        testId,
        currentCode,
        currentLanguage,
        testCases,
        "submit",
        questionId,
        userID,
      );

      onCodingResultChange?.({
        questionId,
        submissionId: result.submissionId || null,
        passedTestcases: Number(result.executionResult?.passedTestcases || 0),
        totalTestcases: Number(result.executionResult?.totalTestcases || 0),
        verdict: result.executionResult?.verdict || "PENDING",
      });

      const mapped = (result.executionResult?.testcaseResults ?? []).map(
        (
          tc: {
            input: string;
            expectedOutput: string;
            actualOutput: string;
            status: string;
            timeTakenMs: number;
            errorMessage?: string;
          },
          i: number,
        ) => ({
          index: i + 1,
          input: tc.input,
          expectedOutput: tc.expectedOutput,
          actualOutput: tc.actualOutput,
          passed: tc.status === "PASSED",
          status: tc.status,
          errorMessage: tc.errorMessage || "",
          runtime: `${tc.timeTakenMs}ms`,
        }),
      );
      setTestResults(mapped);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Unknown error";
      console.error("Error submitting code:", errorMsg);
      alert("Error submitting code: " + errorMsg);
    } finally {
      setIsRunning(false);
    }
  };

  if (questionType === "coding") {
    if (!question) {
      return (
        <div className="rounded-md border border-neutral-800 bg-neutral-900 h-full w-full p-8 flex items-center justify-center">
          <p className="text-neutral-400">Loading coding question...</p>
        </div>
      );
    }

    // Use ProblemDetail for coding questions with isolated assessment runner
    return (
      <div className="flex flex-col h-full w-full overflow-hidden">
        <ProblemDetail
          key={questionId}
          problem={question}
          onCodeChange={(code) => {
            setCurrentCode(code);
            // Autosave to the master answers dictionary via parent callback
            if (onAnswerChange) {
              onAnswerChange(questionId, code);
            }
          }}
          onLanguageChange={(lang) => setCurrentLanguage(lang)}
          onRun={() => runCode()}
          onSubmit={() => submitCode()}
          isRunning={isRunning}
          testResults={testResults}
          sendTestCase={(tc) => setTestCases(tc)}
          actionBarLayout="editor-bottom"
          hideSubmissionsAndSolutions={true}
        />
      </div>
    );
  }

  // For MCQ questions
  const data = question
    ? {
        title: question.title,
        difficulty: question.difficulty
          ? question.difficulty.charAt(0).toUpperCase() +
            question.difficulty.slice(1)
          : "Medium",
        question: question.description || question.title,
        options: (question.options || []).map((option, index) => ({
          id: String.fromCharCode(97 + index),
          text: option,
        })),
      }
    : undefined;

  if (!data) {
    return (
      <div className="rounded-md border border-neutral-800 bg-neutral-900 h-full w-full p-8 flex items-center justify-center">
        <p className="text-neutral-400">Question not found</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border border-neutral-800 bg-neutral-900 h-full w-full p-6 overflow-hidden">
      <MCQQuestion
        data={data}
        questionId={questionId}
        onNext={onNext}
        onPrevious={onPrevious}
        onAnswerChange={onAnswerChange}
        savedAnswer={savedAnswer}
      />
    </div>
  );
};

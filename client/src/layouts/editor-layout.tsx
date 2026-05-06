import { useState, useContext } from "react";
import { useParams } from "react-router";
import { ProblemDetail } from "@/app/code";
import { EditorHeader } from "@/components/code/editor/editor-header";
import type { Testcase } from "@/types/types";
import { codeSubmission } from "@/apis/code-api";
import { type LayoutOption } from "@/components/code/settings-modal";
import { ContextAPI } from "@/contexts/AppContext";

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

export const EditorLayout = () => {
  const { problemId } = useParams();
  const context = useContext(ContextAPI);

  // 🟢 WAIT FOR CONTEXT
  if (!context || context.appLoading) {
    return <div className="text-white p-4">Loading...</div>;
  }

  const userID = context.userID;

  const [currentCode, setCurrentCode] = useState("");
  const [currentLanguage, setCurrentLanguage] = useState("javascript");
  const [testCases, setTestCases] = useState<Testcase[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [layout, setLayout] = useState<LayoutOption>("global-header");

  const submitCode = (code: string, language: string, testCases: Testcase[], mode: string) => {
    runCode(code, language, testCases, mode);
  };

  const runCode = async (code: string, language: string, testCases: Testcase[], mode: string) => {
    try {
      // 🟢 BLOCK IF userID NOT READY
      if (!userID) {
        alert("User not ready. Please wait...");
        return;
      }

      console.log("Running code...", { code, language, testCases, userID });

      setIsRunning(true);

      if (!problemId) {
        throw Error("no question id");
      }

      const result = await codeSubmission(
        "problem",
        null,
        code,
        language,
        testCases,
        mode,
        problemId,
        userID
      );

      const mapped = (result.executionResult?.testcaseResults ?? []).map(
        (tc: any, i: number) => ({
          index: i + 1,
          input: tc.input,
          expectedOutput: tc.expectedOutput,
          actualOutput: tc.actualOutput,
          passed: tc.status === "PASSED",
          status: tc.status,
          errorMessage: tc.errorMessage,
          runtime: `${tc.timeTakenMs}ms`,
        })
      );

      setTestResults(mapped);
    } catch (err) {
      console.error("Error running code:", err);
    } finally {
      setIsRunning(false);
    }
  };

  const handleCodeChange = (code: string) => setCurrentCode(code);
  const handleLanguageChange = (language: string) => setCurrentLanguage(language);
  const handleSendTestCases = (testCase: Testcase[]) => setTestCases(testCase);

  if (!problemId) return <div>No Question id</div>;

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden bg-neutral-950">
      <EditorHeader
        onRun={() => runCode(currentCode, currentLanguage, testCases.slice(0, 3), "run")}
        onSubmit={() => submitCode(currentCode, currentLanguage, testCases, "submit")}
        isRunning={isRunning}
        layout={layout}
        onLayoutChange={setLayout}
      />

      <main className="m-2.5 mt-0 flex-1 overflow-hidden">
        <ProblemDetail
          problemId={problemId}
          onSubmit={submitCode}
          onRun={runCode}
          onCodeChange={handleCodeChange}
          onLanguageChange={handleLanguageChange}
          isRunning={isRunning}
          testResults={testResults}
          sendTestCase={handleSendTestCases}
          actionBarLayout={layout}
        />
      </main>
    </div>
  );
};
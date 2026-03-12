import { useState } from "react";
import { useParams } from "react-router";
import { ProblemDetail } from "@/app/code";
import { EditorHeader } from "@/components/code/editor/editor-header";
import type { Testcase } from "@/types/types";
import { codeSubmission } from "@/apis/code-api";

interface TestResult {
  index: number;
  input: string;
  expectedOutput: string;
  actualOutput: string;
  passed: boolean;
  runtime: string;
}

export const EditorLayout = () => {
  const { problemId } = useParams();
  const [currentCode, setCurrentCode] = useState("");
  const [currentLanguage, setCurrentLanguage] = useState("javascript");
  const [testCases, setTestCases] = useState<Testcase[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);

  const submitCode = (code: string, language: string, testCases: Testcase[], mode:string) => {
    runCode(code, language, testCases, mode);
  }

  const runCode = async(code: string, language: string, testCases: Testcase[], mode:string) => {
    try {
      console.log("Running code...", { code, language, testCases });
  
      setIsRunning(true);
      if (!problemId) {
        throw Error("no question id");
      }
      // mode , questionId, testId will be used in future for fetching testcases from backend
      const result = await codeSubmission(code, language, testCases, mode, problemId);
      console.log("Code execution result:", result.data);
      setTestResults(result.data.testResults);
      
    } catch (err) {
      console.error("Error running code:", err);
    } finally {
      setIsRunning(false);
    }
  }

  const handleCodeChange = (code: string) => {
    setCurrentCode(code);
  }

  const handleLanguageChange = (language: string) => {
    setCurrentLanguage(language);
  }

  const handleSendTestCases = (testCase: Testcase[]) => {
    setTestCases(testCase);
  }
  
  if (!problemId) {
    <div>No Question id</div>
  }
  return (
    <div className='flex flex-col h-screen w-full overflow-hidden bg-neutral-950'>
      <EditorHeader
        onRun={() => runCode(currentCode, currentLanguage, testCases.slice(0, 3),"run")}
        onSubmit={() => submitCode(currentCode, currentLanguage, testCases, "submit")}
        isRunning={isRunning}
      />
      <main className="m-2.5 mt-0 flex-1 overflow-hidden">
        <ProblemDetail
          problemId={problemId || ""}
          onSubmit={submitCode}
          onRun={runCode}
          onCodeChange={handleCodeChange}
          onLanguageChange={handleLanguageChange}
          isRunning={isRunning}
          testResults={testResults}
          sendTestCase={handleSendTestCases}
        />
      </main>
    </div>
  )
}

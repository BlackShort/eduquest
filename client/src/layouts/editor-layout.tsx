import { useState } from "react";
import { useParams } from "react-router";
import { ProblemDetail } from "@/app/code";
import { EditorHeader } from "@/components/code/editor/editor-header";
import type { Testcase } from "@/types/types";


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

  const submitCode = (code: string, language: string, testCase: Testcase[]) => {
    runCode(code, language, testCase);
  }

  const runCode = (code: string, language: string, testCase: Testcase[]) => {
    console.log("Running code...", { code, language, testCase });
    setIsRunning(true);

    // Simulate running test cases
    setTimeout(() => {
      // Mock test results - replace with actual API call
      const mockResults: TestResult[] = [
        {
          index: 1,
          input: "[2,7,11,15], target = 9",
          expectedOutput: "[0,1]",
          actualOutput: "[0,1]",
          passed: true,
          runtime: Math.floor(Math.random() * 100) + 10 + " ms",
        },
        {
          index: 2,
          input: "[3,2,4], target = 6",
          expectedOutput: "[1,2]",
          actualOutput: "[1,2]",
          passed: true,
          runtime: Math.floor(Math.random() * 100) + 10 + " ms",
        },
      ];
      setTestResults(mockResults);
      setIsRunning(false);
    }, 1500);
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

  return (
    <div className='flex flex-col h-screen w-full overflow-hidden bg-neutral-950'>
      <EditorHeader
        onRun={() => runCode(currentCode, currentLanguage, testCases.slice(0, 3))}
        onSubmit={() => submitCode(currentCode, currentLanguage, testCases)}
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

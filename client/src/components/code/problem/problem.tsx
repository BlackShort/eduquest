import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import type { editor, IPosition } from "monaco-editor";
import { dummyCoding } from "@/data/dummy-data";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Settings,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  BookOpen,
  FlaskConical,
  History,
  CodeXml,
  Maximize,
  ChevronDown,
  SquareCheck,
  Terminal,
  Loader2,
  Play,
  CloudUpload,
  Maximize2,
  Braces,
  ChartNoAxesGantt
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Testcase } from "@/types/types";
import { EditorSettingsModal } from "../editor-settings-modal";
import type { Question as AssessmentQuestion } from "@/types/assessment.types";


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

interface DisplayProblem {
  question_id: string;
  question_text: string;
  difficulty?: string;
  test_cases: Testcase[];
}

const languageTemplates = {
  javascript: `function solution(input) {\n    // Write your code here\n    return 0;\n}\n`,
  python: `def solution(input):\n    # Write your code here\n    return 0\n`,
  cpp: `#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your code here\n    return 0;\n}\n`,
  java: `public class Solution {\n    public int solution(int n) {\n        // Write your code here\n        return 0;\n    }\n}`,
};

interface ProblemDetailProps {
  problemId?: string;
  problem?: AssessmentQuestion;
  onSubmit?: (code: string, language: string, testCase: Testcase[], mode: string) => void;
  onRun?: (code: string, language: string, testCase: Testcase[], mode: string) => void;
  onCodeChange?: (code: string) => void;
  onLanguageChange?: (language: string) => void;
  isRunning?: boolean;
  testResults?: TestResult[];
  sendTestCase?: (testCases: Testcase[]) => void;
  actionBarLayout?: "global-header" | "editor-top" | "editor-bottom";
}



export const ProblemDetail = ({
  problemId,
  problem: externalProblem,
  onSubmit,
  onRun,
  onCodeChange,
  onLanguageChange,
  isRunning = false,
  testResults: externalTestResults = [],
  sendTestCase,
  actionBarLayout = "global-header",
}: ProblemDetailProps) => {
  const [language, setLanguage] = useState("java");
  const [code, setCode] = useState(languageTemplates[language as keyof typeof languageTemplates]);
  const [activeResultTab, setActiveResultTab] = useState("testcase");
  const [isEditorSettingsOpen, setIsEditorSettingsOpen] = useState(false);
  const [fontSize, setFontSize] = useState(14);
  const [tabSize, setTabSize] = useState(2);
  const [cursorPosition, setCursorPosition] = useState<IPosition>({ lineNumber: 1, column: 1 });

  const PROBLEM_TABS = [
    { value: "description", icon: <FileText className="w-4 h-4 text-blue-500" />, label: "Description" },
    { value: "test-cases", icon: <BookOpen className="w-4 h-4 text-purple-500" />, label: "Test Cases" },
    { value: "solutions", icon: <FlaskConical className="w-4 h-4 text-green-500" />, label: "Solutions" },
    { value: "submissions", icon: <History className="w-4 h-4 text-yellow-500" />, label: "Submissions" },
  ];

  const LANGUAGES = [
    { label: 'Java', value: 'java' },
    { label: 'JavaScript', value: 'javascript' },
    { label: 'TypeScript ', value: 'typescript' },
    { label: 'C++', value: 'cpp' },
    { label: 'Python', value: 'python' },
  ];

  const problem: DisplayProblem | undefined = externalProblem
    ? {
        question_id: externalProblem.question_id || externalProblem.id,
        question_text: externalProblem.question_text || externalProblem.title,
        difficulty: externalProblem.difficulty || "medium",
        test_cases: externalProblem.test_cases || [],
      }
    : dummyCoding[0]?.questions.find(q => q.question_id === problemId) || dummyCoding[0]?.questions[0];

  // Auto-switch to result tab when running starts
  useEffect(() => {
    if (isRunning) {
      setActiveResultTab("result");
    }
  }, [isRunning]);

  useEffect(() => {
    if (problem) {
      sendTestCase?.(problem.test_cases || []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [problem?.question_id]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if already running/submitting
      if (isRunning) return;

      // Run shortcut: Ctrl + ' or Cmd + '
      if ((e.ctrlKey || e.metaKey) && e.key === "'") {
        e.preventDefault();
        e.stopPropagation();
        if (problem && onRun) {
          onRun(code, language, problem.test_cases, (problem as { mode?: string }).mode || "practice");
        }
      }

      // Submit shortcut: Ctrl + Enter or Cmd + Enter
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        e.stopPropagation();
        if (problem && onSubmit) {
          onSubmit(code, language, problem.test_cases, (problem as { mode?: string }).mode || "practice");
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown, true);
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, [code, language, isRunning, problem, onRun, onSubmit]);

  if (!problem) {
    return (
      <div className="flex items-center justify-center h-full text-white">
        Problem not found
      </div>
    );
  }

  const [activeProblemTab, setActiveProblemTab] = useState("description");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  useEffect(() => {
    if (
      hasSubmitted &&
      !isRunning &&
      externalTestResults.length > 0
    ) {
      setActiveProblemTab("test-cases");
    }
  }, [externalTestResults, hasSubmitted, isRunning]);

 

  const handleLanguageChange = (newLang: string) => {
    setLanguage(newLang);
    const newCode = languageTemplates[newLang as keyof typeof languageTemplates];
    setCode(newCode);
    onCodeChange?.(newCode);
    onLanguageChange?.(newLang);
  };

  const handleCodeChange = (newCode: string | undefined) => {
    const codeValue = newCode || "";
    setCode(codeValue);
    onCodeChange?.(codeValue);
  };

  const handleRun = () => {
    setHasSubmitted(false); 

    if (problem) {
      onRun?.(
        code,
        language,
        problem.test_cases,
        (problem as { mode?: string }).mode || "practice"
      );
    }
  };

  const handleSubmit = () => {
    if (problem) {
      setHasSubmitted(true);

      onSubmit?.(
        code,
        language,
        problem.test_cases,
        (problem as { mode?: string }).mode || "practice"
      );
    }
  };

  const handleEditorMount = (editorInstance: editor.IStandaloneCodeEditor) => {
    editorInstance.onDidChangeCursorPosition((e: editor.ICursorPositionChangedEvent) => {
      setCursorPosition(e.position);
    });
  };

  const renderActionButtons = () => {
    if (actionBarLayout === "global-header") return null;


    return (
      <div className="flex gap-2 items-center">
        {onRun && (
          <Button
            size="sm"
            disabled={isRunning}
            onClick={handleRun}
            className="bg-neutral-600 hover:bg-neutral-700 text-neutral-200 cursor-pointer"
          >
            {isRunning ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Play className="w-4 h-4 mr-1 text-green-500" />}
            Run
          </Button>
        )}
        {onSubmit && (
          <Button
            size="sm"
            disabled={isRunning}
            onClick={handleSubmit}
            className="bg-green-600 hover:bg-green-700 text-neutral-200 cursor-pointer"
          >
            <CloudUpload className="w-4 h-4 mr-1" />
            Submit
          </Button>
        )}
      </div>
    );
  };

  return (
    <ResizablePanelGroup
      orientation="horizontal"
      className="h-full w-full gap-0.75"
    >
      <ResizablePanel defaultSize={"45"} minSize={"30"} className="border border-neutral-500 rounded-lg bg-neutral-800">
        <Tabs
          value={activeProblemTab}
          onValueChange={setActiveProblemTab}
          className="w-full h-full text-neutral-100"
        >
          <TabsList className="relative w-full bg-neutral-700/50 rounded-t-lg rounded-b-none p-0 m-0">
            <div className="w-full gap-1 px-1 flex items-center justify-start no-scrollbar overflow-x-auto">
              {
                PROBLEM_TABS.map((tab, index) => (
                  <>
                    <TabsTrigger
                      key={index}
                      value={tab.value}
                      className="data-[state=active]:focus:ring-0 focus-visible:ring-0 focus-visible:outline-none focus-visible:ring-offset-0 group-data-[variant=default]/tabs-list:data-[state=active]:shadow-none flex items-center justify-center gap-1.5 px-2 py-1.5 max-w-32 w-max text-neutral-400 font-normal hover:text-neutral-200 data-[state=active]:text-neutral-100 data-[state=active]:font-medium data-[state=active]:bg-white/5 hover:bg-neutral-100/5  bg-transparent shadow-none data-[state=active]:shadow-none transition-colors border-none rounded-sm"
                    >
                      {tab.icon}
                      {tab.label}
                    </TabsTrigger>
                    {index < PROBLEM_TABS.length - 1 && (
                      <div key={`separator-${index}`} className="w-px h-4 bg-neutral-700 mx-1"></div>
                    )}
                  </>
                ))
              }
            </div>
          </TabsList>

          <TabsContent value="description" className="flex-1 overflow-y-auto px-4 py-4 text-gray-100 mt-0">
            <div className="space-y-4">
              {/* Problem Title */}
              <div>
                <h1 className="text-xl font-medium text-white mb-4">
                  {problem.question_text}
                </h1>
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-2.5 py-1 text-xs font-medium bg-[#ffc01e]/10 text-[#ffc01e] rounded-full">
                    {problem.difficulty || "medium"}
                  </span>
                </div>
              </div>

              {/* Problem Statement */}
              <div className="prose prose-invert max-w-none">
                <p className="text-sm text-[#a0a0a0] leading-relaxed">
                  Solve the problem described above. Your solution should handle all test cases efficiently.
                </p>

                <div className="mt-6">
                  <h3 className="text-base font-medium text-white mb-4">Examples:</h3>
                  {problem.test_cases.slice(0, 2).map((testCase, index) => (
                    <div key={index} className="bg-[#2d2d2d]/50 rounded-lg p-3 mb-3 border border-[#3a3a3a]">
                      <p className="text-xs font-semibold text-white mb-2">Example {index + 1}:</p>
                      <div className="space-y-1.5 text-sm">
                        <div>
                          <span className="text-[#7c7c7c]">Input: </span>
                          <code className="text-white">{testCase.input}</code>
                        </div>
                        <div>
                          <span className="text-[#7c7c7c]">Output: </span>
                          <code className="text-white">{testCase.output}</code>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6">
                  <h3 className="text-base font-medium text-white mb-3">Constraints:</h3>
                  <ul className="list-disc list-inside text-sm text-[#a0a0a0] space-y-1.5">
                    <li>Time complexity should be optimized</li>
                    <li>Handle edge cases properly</li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent
            value="test-cases"
            className="flex-1 overflow-y-auto px-4 py-4 text-gray-100"
          >
            {externalTestResults && externalTestResults.length > 0 ? (
              <div className="space-y-4">

                {/* ✅ Summary */}
                {(() => {
                  const total = externalTestResults.length;

                  const passed = externalTestResults.filter(
                    r => r.status === "PASSED"
                  ).length;

                  const allPassed = passed === total;

                  const failedCase = externalTestResults.find(
                    r => r.status !== "PASSED"
                  );

                  return (
                    <>
                      {/* Verdict Summary */}
                      <div
                        className={`p-4 rounded-lg border ${allPassed
                            ? "border-green-500/30 bg-green-500/5"
                            : "border-red-500/30 bg-red-500/5"
                          }`}
                      >
                        <h2
                          className={`text-lg font-semibold mb-2 ${allPassed ? "text-green-400" : "text-red-400"
                            }`}
                        >
                          {allPassed ? "Accepted" : "Wrong Answer"}
                        </h2>

                        <p className="text-sm text-neutral-300">
                          {passed} / {total} testcases passed
                        </p>
                      </div>

                      {/* ✅ Show ONLY first failed testcase */}
                      {!allPassed && failedCase && (
                        <div className="border border-red-500/30 bg-red-500/5 rounded-lg p-4 space-y-3">

                          <h3 className="text-red-400 font-medium">
                            Failed Testcase
                          </h3>

                          {/* Input */}
                          <div>
                            <div className="text-xs text-neutral-400 mb-1">
                              Input
                            </div>

                            <div className="bg-neutral-800 rounded p-2 font-mono text-sm whitespace-pre-wrap">
                              {failedCase.input}
                            </div>
                          </div>

                          {/* Your Output */}
                          <div>
                            <div className="text-xs text-neutral-400 mb-1">
                              Your Output
                            </div>

                            <div className="bg-neutral-800 rounded p-2 font-mono text-sm whitespace-pre-wrap">
                              {failedCase.actualOutput || "No Output"}
                            </div>
                          </div>

                          {/* Expected Output */}
                          <div>
                            <div className="text-xs text-neutral-400 mb-1">
                              Expected Output
                            </div>

                            <div className="bg-neutral-800 rounded p-2 font-mono text-sm whitespace-pre-wrap">
                              {failedCase.expectedOutput}
                            </div>
                          </div>

                          {/* Error */}
                          {failedCase.errorMessage && (
                            <div>
                              <div className="text-xs text-red-400 mb-1">
                                Error
                              </div>

                              <div className="bg-red-500/10 text-red-300 rounded p-2 font-mono text-sm whitespace-pre-wrap">
                                {failedCase.errorMessage}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-sm text-[#7c7c7c]">
                  Submit code to see testcase results
                </p>
              </div>
            )}
          </TabsContent>
          <TabsContent value="solutions" className="flex-1 overflow-y-auto px-4 py-4 text-gray-100">
            <div className="text-center py-12">
              <p className="text-sm text-[#7c7c7c]">Community solutions coming soon...</p>
            </div>
          </TabsContent>
          <TabsContent value="submissions" className="flex-1 overflow-y-auto px-4 py-4 text-gray-100">
            <div className="text-center py-12">
              <p className="text-sm text-[#7c7c7c]">Your submissions will appear here...</p>
            </div>
          </TabsContent>
        </Tabs>
      </ResizablePanel>

      <ResizableHandle withHandle />

      <ResizablePanel defaultSize={"55"} minSize={"30"}>
        <ResizablePanelGroup orientation="vertical" className="gap-0.75">
          <ResizablePanel defaultSize={"70"} minSize={"6.7"} className="overflow-hidden border border-neutral-500 rounded-lg bg-neutral-800 flex flex-col">
            <div className="bg-neutral-700/50 px-3 flex h-10 items-center justify-between shrink-0">
              <div className="flex gap-1 items-center justify-center text-sm text-neutral-200 font-normal">
                <CodeXml className="h-4 w-4 text-green-500" />
                Code
              </div>

              {actionBarLayout === "editor-top" && renderActionButtons()}

              <div className="flex gap-4 items-center justify-center">
                <Maximize className="h-4 w-4 text-gray-400 hover:text-white cursor-pointer" />
                <ChevronDown className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
              </div>
            </div>

            <div className="flex items-center justify-between bg-neutral-800">
              <div className="flex items-center px-1">
                <Select value={language} onValueChange={handleLanguageChange}>
                  <SelectTrigger className="w-full max-w-48 text-gray-300 text-sm font-normal
                    border-0 bg-transparent shadow-none
                    hover:text-neutral-100 transition-all duration-300
                    focus:outline-none
                    focus:ring-0
                    focus-visible:outline-none
                    focus-visible:ring-0
                    focus-visible:ring-offset-0
                    ring-0
                    data-[state=open]:ring-0
                    data-[state=open]:outline-none
                    data-[state=open]:shadow-none">
                    <SelectValue placeholder="Select a language" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#2d2d2d] border-[#3a3a3a] text-gray-300 cursor-pointer transition-all duration-300">
                    <SelectGroup>
                      {LANGUAGES.map((lang) => (
                        <SelectItem key={lang.value} value={lang.value}>
                          {lang.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-4 px-3 text-gray-400">
                <ChartNoAxesGantt className="h-4 w-4 cursor-pointer hover:text-neural-100" />
                <Braces className="h-4 w-4 cursor-pointer hover:text-neural-100" />
                <RotateCcw
                  className="h-4 w-4 cursor-pointer hover:text-neural-100"
                  onClick={() => {
                    const resetCode = languageTemplates[language as keyof typeof languageTemplates];
                    setCode(resetCode);
                    onCodeChange?.(resetCode);
                  }}
                />
                <Settings
                  className="h-4 w-4 cursor-pointer hover:text-white"
                  onClick={() => setIsEditorSettingsOpen(true)}
                />
                <Maximize2
                  className="h-4 w-4 cursor-pointer hover:text-white"
                />
              </div>
            </div>

            <div className="h-full flex-1 overflow-hidden">
              <Editor
                height="100%"
                language={language === "cpp" ? "cpp" : language}
                theme="vs-dark"
                value={code}
                onChange={handleCodeChange}
                onMount={handleEditorMount}
                options={{
                  minimap: { enabled: false },
                  fontSize: fontSize,
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  tabSize: tabSize,
                }}
              />
            </div>

            <div className="flex items-center justify-between px-1 py-1 min-h-10 h-max bg-[#1e1e1e]">
              <div className="text-xs text-gray-500 pl-2 font-sans">
                Ln {cursorPosition.lineNumber}, Col {cursorPosition.column}
              </div>
              {actionBarLayout === "editor-bottom" && (
                renderActionButtons()
              )}
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel defaultSize={"30"} minSize={"6.5"} className="overflow-hidden border border-neutral-500 rounded-lg bg-neutral-800">
            <Tabs value={activeResultTab} onValueChange={setActiveResultTab} className="w-full h-full text-neutral-100 gap-0">
              <TabsList className="flex items-center justify-start gap-2 p-1 w-full bg-neutral-700/50 rounded-t-lg rounded-b-none">
                <TabsTrigger
                  value="testcase"
                  className="flex items-center justify-center gap-1.5 max-w-32 w-max data-[state=active]:bg-transparent text-neutral-400 hover:text-neutral-400 data-[state=active]:text-neutral-200 p-1 font-normal hover:bg-neutral-700/50 data-[state=active]:shadow-none shadow-none focus-visible:ring-0 focus-visible:outline-none focus-visible:ring-offset-0 group-data-[variant=default]/tabs-list:data-[state=active]:shadow-none"
                >
                  <SquareCheck className="h-4 w-5 text-green-500" />
                  Testcase
                </TabsTrigger>
                <TabsTrigger
                  value="result"
                  className="flex items-center justify-center gap-1.5 max-w-32 w-max data-[state=active]:bg-transparent text-neutral-400 hover:text-neutral-400 data-[state=active]:text-neutral-200 p-1 font-normal hover:bg-neutral-700/50 data-[state=active]:shadow-none shadow-none focus-visible:ring-0 focus-visible:outline-none focus-visible:ring-offset-0 group-data-[variant=default]/tabs-list:data-[state=active]:shadow-none"
                >
                  <Terminal className="h-4 w-5 text-green-500" />
                  Test Result
                </TabsTrigger>
              </TabsList>

              <TabsContent value="testcase" className="flex-1 overflow-y-auto p-3 mt-0">
                <Tabs defaultValue="case-0" className="w-full h-full text-neutral-100">
                  {/* CASE TABS */}
                  <TabsList className="p-1 w-full bg-neutral-800 rounded-md flex items-center justify-start gap-2">
                    {problem.test_cases.slice(0, 3).map((_, index) => (
                      <TabsTrigger
                        key={index}
                        value={`case-${index}`}
                        className="max-w-18 px-3 py-1.5 text-xs rounded-sm data-[state=active]:bg-neutral-700 data-[state=active]:text-white text-neutral-400 hover:bg-neutral-700/50 hover:text-neutral-200 cursor-pointer data-[state=active]:shadow-none shadow-none focus-visible:ring-0 focus-visible:outline-none focus-visible:ring-offset-0 group-data-[variant=default]/tabs-list:data-[state=active]:shadow-none"
                      >
                        Case {index + 1}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {/* CASE CONTENT */}
                  {problem.test_cases.slice(0, 3).map((testCase, index) => (
                    <TabsContent
                      key={index}
                      value={`case-${index}`}
                      className="mt-4 space-y-4"
                    >
                      <div>
                        <div className="text-xs text-gray-400 mb-1">Input</div>
                        <div className="text-sm text-white bg-[#2d2d2d] p-2.5 rounded-md border border-[#3a3a3a] font-mono">
                          {testCase.input}
                        </div>
                      </div>

                      <div>
                        <div className="text-xs text-gray-400 mb-1">Expected</div>
                        <div className="text-sm text-white bg-[#2d2d2d] p-2.5 rounded-md border border-[#3a3a3a] font-mono">
                          {testCase.output}
                        </div>
                      </div>
                    </TabsContent>
                  ))}

                </Tabs>
              </TabsContent>

              <TabsContent value="result" className="flex-1 overflow-y-auto mt-0">
                {isRunning ? (
                  <div className="flex flex-col items-center justify-center h-full gap-3">
                    <Loader2 className="w-6 h-6 text-neutral-400 animate-spin" />
                    <p className="text-sm text-[#7c7c7c]">Running test cases...</p>
                  </div>
                ) : externalTestResults.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-sm text-[#7c7c7c]">You must run your code first.</p>
                  </div>
                ) : (() => {
                      const hasCompileError = externalTestResults.some(r => r.status === "COMPILE_ERROR");
                      const hasRuntimeError = externalTestResults.some(r => r.status === "RUNTIME_ERROR");
                      const hasTLE = externalTestResults.some(r => r.status === "TIME_LIMIT");
                      const allPassed = externalTestResults.every(r => r.status === "PASSED");

                      const totalRuntime = externalTestResults.reduce((sum, r) => sum + parseInt(r.runtime), 0);

                      let verdictText = "Wrong Answer";
                      let verdictColor = "text-red-500";

                      if (hasCompileError) {
                        verdictText = "Compilation Error";
                      } else if (hasRuntimeError) {
                        verdictText = "Runtime Error";
                      } else if (hasTLE) {
                        verdictText = "Time Limit Exceeded";
                      } else if (allPassed) {
                        verdictText = "Accepted";
                        verdictColor = "text-green-500";
                      }
                  return (
                    <>
                      {/* Verdict banner */}
                      <div className="flex items-center justify-between gap-2 px-4 pt-4">
                        <h2 className={`text-xl font-semibold ${verdictColor}`}>
                          {verdictText}
                        </h2>
                        <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                          <Clock className="w-3.5 h-3.5" />
                          Runtime: {totalRuntime} ms
                        </div>
                      </div>

                      {/* Per-case tabs */}
                      <div className="p-3">
                        <Tabs defaultValue="res-0" className="w-full h-full text-neutral-100">
                          <TabsList className="p-1 w-full bg-neutral-800 rounded-md flex items-center justify-start gap-2">
                            {externalTestResults.slice(0, 3).map((result, index) => (
                              <TabsTrigger
                                key={index}
                                value={`res-${index}`}
                                className={`max-w-18 px-3 py-1.5 text-xs rounded-sm border bg-transparent shadow-none hover:bg-neutral-700/50 data-[state=active]:shadow-none focus-visible:ring-0 focus-visible:outline-none focus-visible:ring-offset-0 group-data-[variant=default]/tabs-list:data-[state=active]:shadow-none
                                  ${result.passed
                                    ? "text-neutral-400 data-[state=active]:bg-neutral-700 data-[state=active]:text-neutral-100 hover:text-neutral-200 cursor-pointer"
                                    : "text-neutral-400 data-[state=active]:bg-red-500/10 data-[state=active]:text-red-400 hover:text-red-100 cursor-pointer"
                                  }`}
                              >
                                {result.passed
                                  ? <CheckCircle2 className="w-3 h-3 text-green-500" />
                                  : <XCircle className="w-3 h-3 text-red-500" />
                                }
                                Case {index + 1}
                              </TabsTrigger>
                            ))}
                          </TabsList>

                          {externalTestResults.slice(0, 3).map((result, index) => (
                            <TabsContent key={index} value={`res-${index}`} className="mt-0 space-y-3">
                              <div>
                                <div className="text-xs text-neutral-400 mb-1.5">Input</div>
                                <div className="text-sm text-neutral-100 bg-neutral-700/50 p-2.5 rounded-md font-mono">
                                  {result.input}
                                </div>
                              </div>
                              <div>
                                <div className="text-xs text-neutral-400 mb-1.5">Output</div>
                                <div className={`text-sm p-2.5 rounded-md font-mono ${result.passed ? "text-neutral-100 bg-neutral-700/50" : "text-red-400 bg-red-500/5"}`}>
                                  {result.actualOutput}
                                </div>
                              </div>
                              {result.status !== "PASSED" && result.errorMessage && (
                                <div>
                                  <div className="text-xs text-red-400 mb-1.5">Error</div>
                                  <div className="text-sm text-red-400 bg-red-500/5 p-2.5 rounded-md font-mono whitespace-pre-wrap">
                                    {result.errorMessage}
                                  </div>
                                </div>
                              )}
                            </TabsContent>
                          ))}
                        </Tabs>
                      </div>
                    </>
                  );
                })()}
              </TabsContent>
            </Tabs>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel >

      <EditorSettingsModal
        isOpen={isEditorSettingsOpen}
        onClose={() => setIsEditorSettingsOpen(false)}
        fontSize={fontSize}
        setFontSize={setFontSize}
        tabSize={tabSize}
        setTabSize={setTabSize}
      />
    </ResizablePanelGroup >
  );
};

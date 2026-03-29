import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
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
  FlaskConical,
  History,
  CodeXml,
  Maximize,
  ChevronDown,
  SquareCheck,
  Terminal,
  Loader2,
  Play,
  CloudUpload
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Testcase } from "@/types/types";
import { EditorSettingsModal } from "../editor-settings-modal";

interface TestResult {
  index: number;
  input: string;
  expectedOutput: string;
  actualOutput: string;
  passed: boolean;
  runtime: string;
}

const languageTemplates = {
  javascript: `function solution(input) {\n    // Write your code here\n    return 0;\n}\n`,
  python: `def solution(input):\n    # Write your code here\n    return 0\n`,
  cpp: `#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your code here\n    return 0;\n}\n`,
  java: `public class Solution {\n    public int solution(int n) {\n        // Write your code here\n        return 0;\n    }\n}`,
};

interface ProblemDetailProps {
  problemId?: string;
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
  onSubmit,
  onRun,
  onCodeChange,
  onLanguageChange,
  isRunning = false,
  testResults: externalTestResults = [],
  sendTestCase,
  actionBarLayout = "global-header",
}: ProblemDetailProps) => {
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(languageTemplates[language as keyof typeof languageTemplates]);
  const [activeResultTab, setActiveResultTab] = useState("testcase");
  const [isEditorSettingsOpen, setIsEditorSettingsOpen] = useState(false);
  const [fontSize, setFontSize] = useState(14);
  const [tabSize, setTabSize] = useState(2);

  // Find the problem from dummy data
  const problem = dummyCoding[0]?.questions.find(q => q.question_id === problemId) || dummyCoding[0]?.questions[0];

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
    if (problem) {
      onRun?.(code, language, problem.test_cases, (problem as { mode?: string }).mode || "practice");
    }
  };

  const handleSubmit = () => {
    if (problem) {
      onSubmit?.(code, language, problem.test_cases, (problem as { mode?: string }).mode || "practice");
    }
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
            {isRunning ? <Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> : <Play className="w-4 h-4 mr-1.5 text-green-500" />}
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
            <CloudUpload className="w-4 h-4 mr-1.5" />
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
      <ResizablePanel defaultSize="50%" minSize="3.5%" className="border border-neutral-500 rounded-lg bg-neutral-800">
        <Tabs defaultValue="description" className="w-full h-full text-neutral-100">
          <TabsList className="p-1 w-full flex-wrap bg-neutral-700/50 rounded-t-lg rounded-b-none">
            <TabsTrigger value="description"
              className="w-max border-0 data-[state=active]:bg-neutral-700/60 bg-transparent text-neutral-400 hover:text-neutral-400 data-[state=active]:text-neutral-200 pb-2 px-0 font-normal"
            >
              <FileText className="text-blue-500" />
              Description
            </TabsTrigger>
            <TabsTrigger value="solutions"
              className="w-max border-0 data-[state=active]:bg-neutral-700/60 bg-transparent text-neutral-400 hover:text-neutral-400 data-[state=active]:text-neutral-200 pb-2 px-0 font-normal"
            >
              <FlaskConical className="text-green-500" />
              Solutions
            </TabsTrigger>
            <TabsTrigger value="submissions"
              className="w-max border-0 data-[state=active]:bg-neutral-700/60 bg-transparent text-neutral-400 hover:text-neutral-400 data-[state=active]:text-neutral-200 pb-2 px-0 font-normal"
            >
              <History className="text-yellow-500" />
              Submissions
            </TabsTrigger>
          </TabsList>
          <TabsContent value="description" className="flex-1 overflow-y-auto px-4 py-4 text-gray-100 mt-0">
            <div className="space-y-4">
              {/* Problem Title */}
              <div>
                <h1 className="text-xl font-medium text-white mb-4">
                  {problem.question_id.slice(7)}. {problem.question_text}
                </h1>
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-2.5 py-1 text-xs font-medium bg-[#ffc01e]/10 text-[#ffc01e] rounded-full">
                    Easy
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

      <ResizablePanel defaultSize="50%">
        <ResizablePanelGroup orientation="vertical" className="gap-0.75">
          <ResizablePanel defaultSize={70} minSize={7} className="overflow-hidden border border-neutral-500 rounded-lg bg-neutral-800 flex flex-col">
            <div className="bg-neutral-700/50 px-3 flex h-10 items-center justify-between shrink-0">
              <div className="flex gap-1 items-center justify-center text-sm text-neutral-200 font-normal">
                <CodeXml className="h-5 w-5 text-green-500" />
                Code
              </div>

              {actionBarLayout === "editor-top" && renderActionButtons()}

              <div className="flex gap-3 items-center justify-center">
                <Maximize className="h-4 w-4 text-gray-400" />
                <ChevronDown className="h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div className="flex items-center justify-between bg-neutral-800">
              <div className="flex items-center px-1">
                <Select value={language} onValueChange={handleLanguageChange}>
                  <SelectTrigger className="
                    w-max h-8 text-gray-300 text-sm 
                    border-0 bg-transparent shadow-none
                    hover:bg-transparent
                    focus:outline-none
                    focus:ring-0
                    focus-visible:outline-none
                    focus-visible:ring-0
                    focus-visible:ring-offset-0
                    ring-0
                    data-[state=open]:ring-0
                    data-[state=open]:outline-none
                    data-[state=open]:shadow-none"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#2d2d2d] border-[#3a3a3a] text-gray-300">
                    <SelectItem value="javascript" className="hover:bg-[#3a3a3a]">JavaScript</SelectItem>
                    <SelectItem value="python" className="hover:bg-[#3a3a3a]">Python</SelectItem>
                    <SelectItem value="cpp" className="hover:bg-[#3a3a3a]">C++</SelectItem>
                    <SelectItem value="java" className="hover:bg-[#3a3a3a]">Java</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-5 px-3">
                <RotateCcw
                  className="h-4 w-4 text-gray-400 cursor-pointer hover:text-white"
                  onClick={() => {
                    const resetCode = languageTemplates[language as keyof typeof languageTemplates];
                    setCode(resetCode);
                    onCodeChange?.(resetCode);
                  }}
                />

                <Settings 
                  className="h-4 w-4 text-gray-400 cursor-pointer hover:text-white" 
                  onClick={() => setIsEditorSettingsOpen(true)}
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
                options={{
                  minimap: { enabled: false },
                  fontSize: fontSize,
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  tabSize: tabSize,
                }}
              />
            </div>
            {actionBarLayout === "editor-bottom" && (
              <div className="flex items-center justify-end px-3 py-1 border-t border-neutral-700 bg-neutral-800">
                {renderActionButtons()}
              </div>
            )}
          </ResizablePanel>

          <ResizableHandle withHandle />

            <ResizablePanel defaultSize={30} minSize={7} className="overflow-hidden border border-neutral-500 rounded-lg bg-neutral-800">
            <Tabs value={activeResultTab} onValueChange={setActiveResultTab} className="w-full h-full text-neutral-100 gap-0">
              <TabsList className="flex items-center justify-start gap-2 p-1 w-full bg-neutral-700/50 rounded-t-lg rounded-b-none">
                <TabsTrigger
                  value="testcase"
                  className="flex items-center justify-center gap-1.5 max-w-32 w-max data-[state=active]:bg-transparent text-neutral-400 hover:text-neutral-400 data-[state=active]:text-neutral-200 p-1 font-normal hover:bg-neutral-700/50 data-[state=active]:shadow-none"
                >
                  <SquareCheck className="h-4 w-5 text-green-500" />
                  Testcase
                </TabsTrigger>
                <TabsTrigger
                  value="result"
                  className="flex items-center justify-center gap-1.5 max-w-32 w-max data-[state=active]:bg-transparent text-neutral-400 hover:text-neutral-400 data-[state=active]:text-neutral-200 p-1 font-normal hover:bg-neutral-700/50 data-[state=active]:shadow-none"
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
                        className="max-w-18 px-3 py-1.5 text-xs rounded-sm data-[state=active]:bg-neutral-700 data-[state=active]:text-white text-neutral-400 hover:bg-neutral-700/50 hover:text-neutral-200 cursor-pointer"
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
                  const allPassed = externalTestResults.every(r => r.passed);
                  const totalRuntime = externalTestResults.reduce((sum, r) => sum + parseInt(r.runtime), 0);
                  return (
                    <>
                      {/* Verdict banner */}
                      <div className="flex items-center justify-between gap-2 px-4 pt-4">
                        <h2 className={`text-xl font-semibold ${allPassed ? "text-green-500" : "text-red-500"}`}>
                          {allPassed ? "Accepted" : "Wrong Answer"}
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
                            {externalTestResults.map((result, index) => (
                              <TabsTrigger
                                key={index}
                                value={`res-${index}`}
                                className={`max-w-18 px-3 py-1.5 text-xs rounded-sm border bg-transparent shadow-none hover:bg-neutral-700/50
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

                          {externalTestResults.map((result, index) => (
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
                              <div>
                                <div className="text-xs text-neutral-400 mb-1.5">Expected</div>
                                <div className="text-sm text-neutral-100 bg-neutral-700/50 p-2.5 rounded-md font-mono">
                                  {result.expectedOutput}
                                </div>
                              </div>
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

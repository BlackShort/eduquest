import { useState } from "react";
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
  Maximize2,
  SquareCheck,
  Terminal,
} from "lucide-react";

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
  cpp: `#include <iostream>\nusing namespace std;\n\nint solution() {\n    // Write your code here\n    return 0;\n}\n`,
  java: `public class Solution {\n    public int solution() {\n        // Write your code here\n        return 0;\n    }\n}`,
};

interface ProblemDetailProps {
  problemId?: string;
  onSubmit?: (code: string, language: string) => void;
  onRun?: (code: string, language: string) => void;
  onCodeChange?: (code: string) => void;
  onLanguageChange?: (language: string) => void;
  isRunning?: boolean;
  testResults?: TestResult[];
}

export const ProblemDetail = ({ 
  problemId, 
  onCodeChange,
  onLanguageChange,
  testResults: externalTestResults = []
}: ProblemDetailProps) => {
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState(languageTemplates[language as keyof typeof languageTemplates]);

  // Find the problem from dummy data
  const problem = dummyCoding[0]?.questions.find(q => q.question_id === problemId) || dummyCoding[0]?.questions[0];

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
                  {problem.question_id}. {problem.question_text}
                </h1>
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-2.5 py-1 text-xs font-medium bg-[#ffc01e]/10 text-[#ffc01e] rounded-full">
                    Medium
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
          <ResizablePanel defaultSize="75%" minSize="7%" className="overflow-hidden border border-neutral-500 rounded-lg bg-neutral-800">
            <div className="bg-neutral-700/50 px-3 flex h-10 items-center justify-between">
              <div className="flex gap-1 items-center justify-center text-sm text-neutral-200 font-normal">
                <CodeXml className="h-5 w-5 text-green-500" />
                Code
              </div>
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
                <Settings className="h-4 w-4 text-gray-400 cursor-pointer hover:text-white" />
                <Maximize2 className="h-4 w-4 text-gray-400 cursor-pointer hover:text-white" />
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
                  fontSize: 14,
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  tabSize: 2,
                }}
              />
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel defaultSize="25%" minSize="7%" className="overflow-hidden border border-neutral-500 rounded-lg bg-neutral-800">
            <Tabs defaultValue="testcase" className="w-full h-full text-neutral-100">
              <TabsList className="p-1 w-full bg-neutral-700/50 rounded-t-lg rounded-b-none">
                <TabsTrigger
                  value="testcase"
                  className="w-max border-0 data-[state=active]:bg-neutral-700/60 bg-transparent text-neutral-400 hover:text-neutral-400 data-[state=active]:text-neutral-200 pb-2 px-0 font-normal"
                >
                  <SquareCheck className="h-4 w-5 text-green-500" />
                  Testcase
                </TabsTrigger>
                <TabsTrigger
                  value="result"
                  className="w-max border-0 data-[state=active]:bg-neutral-700/60 bg-transparent text-neutral-400 hover:text-neutral-400 data-[state=active]:text-neutral-200 pb-2 px-0 font-normal"
                >
                  <Terminal className="h-4 w-5 text-green-500" />
                  Test Result
                </TabsTrigger>
              </TabsList>

              <TabsContent value="testcase" className="flex-1 overflow-y-auto p-3 mt-0">
                <Tabs defaultValue="case-0" className="w-full h-full text-neutral-100">
                  {/* CASE TABS */}
                  <TabsList className="p-1 w-full bg-neutral-800 rounded-md flex gap-2">
                    {problem.test_cases.slice(0, 3).map((_, index) => (
                      <TabsTrigger
                        key={index}
                        value={`case-${index}`}
                        className="px-3 py-1.5 text-xs rounded-md data-[state=active]:bg-neutral-700 data-[state=active]:text-white text-neutral-400"
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

              <TabsContent value="result" className="flex-1 overflow-y-auto p-3 mt-0">
                {externalTestResults.length === 0 ? (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-sm text-[#7c7c7c]">You must run your code first.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 px-3 py-2 bg-[#2d2d2d] rounded-lg border border-[#3a3a3a]">
                      <CheckCircle2 className="w-4 h-4 text-[#00b8a3]" />
                      <span className="text-sm text-[#00b8a3] font-medium">
                        Accepted
                      </span>
                    </div>

                    {externalTestResults.map((result) => (
                      <div
                        key={result.index}
                        className="rounded-lg p-3 bg-[#2d2d2d] border border-[#3a3a3a]"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-white">
                            Case {result.index}
                          </span>
                          <div className="flex items-center gap-3">
                            <span className="text-xs text-gray-400 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {result.runtime}
                            </span>
                            {result.passed ? (
                              <CheckCircle2 className="w-4 h-4 text-[#00b8a3]" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-500" />
                            )}
                          </div>
                        </div>
                        <div className="space-y-2 text-xs">
                          <div>
                            <div className="text-gray-400 mb-1">Input</div>
                            <div className="text-white bg-[#1a1a1a] p-2 rounded font-mono">
                              {result.input}
                            </div>
                          </div>
                          <div>
                            <div className="text-gray-400 mb-1">Output</div>
                            <div className="text-white bg-[#1a1a1a] p-2 rounded font-mono">
                              {result.actualOutput}
                            </div>
                          </div>
                          <div>
                            <div className="text-gray-400 mb-1">Expected</div>
                            <div className="text-white bg-[#1a1a1a] p-2 rounded font-mono">
                              {result.expectedOutput}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel >

    </ResizablePanelGroup >
  );
};

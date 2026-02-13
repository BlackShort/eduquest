import { useState } from "react";
import { Link, useParams } from "react-router";
import { ChevronLeft, ChevronRight, Settings, User, ListVideo, CloudUpload, Play, LayoutPanelLeft } from 'lucide-react';
import eduquest from '@/assets/logo/favicon.png'
import { useContextAPI } from '@/hooks/useContext';
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { ProblemDetail } from "@/app/code";

interface CodeHeaderProps {
  onRun: () => void;
  onSubmit: () => void;
  isRunning: boolean;
}

const CodeHeader = ({ onRun, onSubmit, isRunning }: CodeHeaderProps) => {
  const { isLoggedIn, user } = useContextAPI();

  return (
    <header className="w-full h-12">
      <div className="w-full px-6 h-full">
        <div className="flex items-center justify-between h-full">
          <div className="flex h-5 items-center gap-2">
            <Link to="/dashboard" className="flex items-center">
              <img
                src={eduquest}
                alt="EduQuest"
                className="h-6 w-6"
              />
            </Link>
            <Separator orientation="vertical" className="bg-neutral-600" />
            <div className="flex items-center gap-2 text-gray-300">
              <ListVideo className="w-4 h-4" />
              <span className="text-sm font-medium">Problem List</span>
              <ChevronLeft className="w-4 h-4 cursor-pointer hover:text-white" />
              <ChevronRight className="w-4 h-4 cursor-pointer hover:text-white" />
            </div>
          </div>

          <div className="flex items-center justify-center">
            <ButtonGroup className="flex gap-0.5">
              <Button
                size={'sm'}
                className="rounded-sm bg-neutral-800 text-blue-500 hover:bg-neutral-700/50"
                onClick={onRun}
                disabled={isRunning}
              >
                <Play /> <span>{isRunning ? "Running..." : "Run"}</span>
              </Button>
              <Button
                size={'sm'}
                className="rounded-sm bg-neutral-800 text-green-500 hover:bg-neutral-700/50"
                onClick={onSubmit}
                disabled={isRunning}
              >
                <CloudUpload /> <span>Submit</span>
              </Button>
            </ButtonGroup>
          </div>

          <div className="flex items-center gap-5">
            <div className="flex gap-4">
              <LayoutPanelLeft className="w-5 h-5 text-gray-400 cursor-pointer hover:text-white" />
              <Settings className="w-5 h-5 text-gray-400 cursor-pointer hover:text-white" />
            </div>
            {isLoggedIn && user?._id ? (
              <Link to={`/profile/${user._id}/me`} className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#3a3a3a] hover:bg-[#4a4a4a] cursor-pointer">
                <User className="w-4 h-4 text-gray-300" />
              </Link>
            ) : (
              <Link to={'/login'}>
                <Button
                  size={'sm'}
                  className="text-sm font-medium text-white bg-orange-500 rounded-full hover:bg-orange-600 transition-all duration-200"
                >
                  <User className="w-4 h-4" />
                  Login
                </Button>
              </Link>
            )
            }
          </div>
        </div>
      </div>
    </header>
  )
}

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
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);

  const submitCode = (code: string, language: string) => {
    console.log("Submitting code...", { code, language });
    // Implement submission logic here
    runCode(code, language);
  }

  const runCode = (code: string, language: string) => {
    console.log("Running code...", { code, language });
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

  return (
    <div className='flex flex-col h-screen w-full overflow-hidden bg-neutral-950'>
      <CodeHeader
        onRun={() => runCode(currentCode, currentLanguage)}
        onSubmit={() => submitCode(currentCode, currentLanguage)}
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
        />
      </main>
    </div>
  )
}

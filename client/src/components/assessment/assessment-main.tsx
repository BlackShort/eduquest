import { PanelRightOpen, Code2, ListChecks, CheckCircle2 } from "lucide-react";
import { AssessmentDetail } from "@/app/assessment/assessment-detail";
import { useAssessment } from "@/contexts/AssessmentContext";

export const AssessmentMain = () => {
    const {
        sidebarOpen,
        setSidebarOpen,
        toggleSidebar,
        currentQuestionId,
        setCurrentQuestionId,
        answers,
        handleAnswerChange,
        questions,
        getCurrentQuestion,
        showNext,
        showPrevious,
        handleNext,
        handlePrevious,
    } = useAssessment();

    const currentQuestion = getCurrentQuestion();

    return (
        <main className="p-2 h-[calc(100vh-3rem)] relative flex flex-row gap-2 overflow-hidden">
            {/* Sidebar */}
            <aside
                className={`relative rounded-md border border-neutral-800 bg-neutral-900 h-full
                             transition-all duration-300 ease-in-out shrink-0
                             ${sidebarOpen ? "w-72" : "w-13"} overflow-hidden flex flex-col`}
            >
                <div className="flex-1 overflow-y-auto w-72">
                    {/* Expanded sidebar content */}
                    <div className={`transition-opacity duration-200 ${sidebarOpen ? "opacity-100" : "opacity-0"}`}>
                        {sidebarOpen && (
                            <div className="p-4 space-y-4">
                                <div className="mb-6">
                                    <h2 className="text-lg font-bold text-white mb-2">Questions</h2>
                                    <p className="text-xs text-neutral-500">
                                        {Object.keys(answers).length} / {questions.length} Answered
                                    </p>
                                </div>

                                {/* Coding section */}
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
                                                        className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${currentQuestionId === question.id
                                                                ? "bg-blue-600 text-white"
                                                                : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
                                                            }`}
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-xs font-bold">{idx + 1}</span>
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

                                {/* MCQ section */}
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
                                                        key={`${question.id}-${idx}`}
                                                        onClick={() => setCurrentQuestionId(question.id)}
                                                        className={`relative w-10 h-10 rounded-full transition-all duration-200 text-center font-medium ${currentQuestionId === question.id
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
                        )}
                    </div>

                    {/* Collapsed sidebar — icon quick-jump */}
                    <div
                        className={`absolute top-0 left-0 w-13 h-full overflow-y-auto transition-opacity duration-200 ${!sidebarOpen ? "opacity-100 z-10" : "opacity-0 pointer-events-none"
                            }`}
                    >
                        {!sidebarOpen && (
                            <div className="flex flex-col items-center p-2 space-y-4 mt-2 pb-4">
                                {questions.some((q) => q.type === "coding") && (
                                    <button
                                        onClick={() => {
                                            const first = questions.find((q) => q.type === "coding");
                                            if (first) setCurrentQuestionId(first.id);
                                            setSidebarOpen(true);
                                        }}
                                        className={`w-9 h-9 flex items-center justify-center shrink-0 rounded-lg transition-all duration-200 ${currentQuestion?.type === "coding"
                                                ? "bg-blue-600 shadow-md shadow-blue-500/20"
                                                : "bg-neutral-800 hover:bg-neutral-700"
                                            }`}
                                        title="Coding Problems"
                                    >
                                        <Code2 className="w-5 h-5 text-white" />
                                    </button>
                                )}
                                {questions.some((q) => q.type === "mcq") && (
                                    <button
                                        onClick={() => {
                                            const first = questions.find((q) => q.type === "mcq");
                                            if (first) setCurrentQuestionId(first.id);
                                            setSidebarOpen(true);
                                        }}
                                        className={`w-9 h-9 flex items-center justify-center shrink-0 rounded-lg transition-all duration-200 ${currentQuestion?.type === "mcq"
                                                ? "bg-green-600 shadow-md shadow-green-500/20"
                                                : "bg-neutral-800 hover:bg-neutral-700"
                                            }`}
                                        title="Multiple Choice"
                                    >
                                        <ListChecks className="w-5 h-5 text-white" />
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </aside>

            {/* Sidebar toggle button */}
            <div
                className={`absolute top-13 transition-all duration-300 ease-in-out ${sidebarOpen ? "left-71" : "left-12"
                    } bg-neutral-700 hover:bg-orange-500 scale-95 hover:scale-100 rounded-full p-2
                  cursor-pointer text-neutral-200 shadow-lg z-10`}
                onClick={toggleSidebar}
            >
                <PanelRightOpen
                    className={`h-4 w-4 transition-transform duration-200 ${sidebarOpen ? "rotate-0" : "rotate-180"
                        }`}
                />
            </div>

            {/* Question panel */}
            <AssessmentDetail
                questionType={currentQuestion?.type ?? "coding"}
                questionId={currentQuestionId}
                onNext={showNext() ? handleNext : undefined}
                onPrevious={showPrevious() ? handlePrevious : undefined}
                onAnswerChange={handleAnswerChange}
                savedAnswer={answers[currentQuestionId] ?? null}
            />
        </main>
    );
};
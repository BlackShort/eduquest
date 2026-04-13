import { useEffect, useState } from "react";
import { Link } from "react-router";
import {
    GalleryVerticalEnd,
    ChevronLeft,
    ChevronRight,
    Settings,
    CloudUpload,
    LayoutPanelLeft,
    AlarmClock,
} from "lucide-react";
import { logo } from "@/assets/logo";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { SettingsModal } from "@/components/code/settings-modal";
import { useAssessment } from "@/contexts/AssessmentContext";


export const AssessmentHeader = () => {
    const { timeRemaining, decrementTimeRemaining, handleSubmitAssessment, isSubmitted, stage } =
        useAssessment();

    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    const isRunning = !isSubmitted && stage === "exam";

    // Timer tick — driven by context state, only active during exam
    useEffect(() => {
        if (!isRunning || timeRemaining <= 0) return;
        const interval = setInterval(decrementTimeRemaining, 1000);
        return () => clearInterval(interval);
    }, [isRunning, timeRemaining, decrementTimeRemaining]);

    const formatTime = (seconds: number): string => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        const mm = m.toString().padStart(2, "0");
        const ss = s.toString().padStart(2, "0");
        return h > 0 ? `${h.toString().padStart(2, "0")}:${mm}:${ss}` : `${mm}:${ss}`;
    };

    const timerColor =
        timeRemaining <= 300
            ? "text-red-500"
            : timeRemaining <= 600
                ? "text-orange-500"
                : "text-green-500";

    return (
        <header className="w-full h-12 border-b border-neutral-800 bg-neutral-900">
            <div className="w-full px-6 h-full">
                <div className="flex items-center justify-between h-full">
                    {/* Left — logo + section nav */}
                    <div className="flex w-max h-10 items-center gap-2">
                        <Link to="/dashboard" className="flex items-center pl-2">
                            <img src={logo.light.logoL128} alt="CodeAlpha" className="w-full h-10 object-cover" />
                            {/* <span className="ml-2 text-lg tracking-wide font-medium text-white">
                                Assessment
                            </span> */}
                        </Link>

                        <div className="mr-1 h-5 w-px bg-neutral-600" />

                        <div className="flex items-center gap-0 text-gray-300 bg-neutral-700/40 rounded transition-colors group">
                            <div className="flex items-center gap-2 px-3 py-1.5 hover:bg-white/10 rounded-l transition-colors cursor-pointer">
                                <GalleryVerticalEnd className="w-5 h-5" />
                                <span className="text-sm font-normal">Section</span>
                            </div>
                            <div className="h-8 w-px bg-neutral-950" />
                            <div className="flex items-center">
                                <button className="p-1.5 hover:bg-white/10 transition-colors cursor-pointer">
                                    <ChevronLeft className="w-5 h-5 text-neutral-400 hover:text-neutral-200" />
                                </button>
                                <div className="h-8 w-px bg-neutral-950" />
                                <button className="p-1.5 hover:bg-white/10 rounded-r transition-colors cursor-pointer">
                                    <ChevronRight className="w-5 h-5 text-neutral-400 hover:text-neutral-200" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Center — timer + submit */}
                    <div className="flex items-center justify-center gap-4">
                        <ButtonGroup className="flex gap-0.5">
                            <Button
                                className={`rounded-sm bg-neutral-800 hover:bg-neutral-700/50 ${timeRemaining <= 300 ? "text-red-500 animate-pulse" : "text-blue-500"
                                    }`}
                            >
                                <AlarmClock className="h-5 w-5" />
                            </Button>
                            <Button
                                className={`text-base rounded-sm bg-neutral-800 hover:bg-neutral-700/50 font-mono ${timerColor}`}
                            >
                                {formatTime(timeRemaining)}
                            </Button>
                            <Button
                                className="cursor-pointer rounded-sm bg-neutral-800 text-amber-500 hover:bg-neutral-700/50"
                                onClick={handleSubmitAssessment}
                                disabled={!isRunning}
                            >
                                <CloudUpload />
                                <span>Submit</span>
                            </Button>
                        </ButtonGroup>
                    </div>

                    {/* Right — layout + settings */}
                    <div className="flex items-center gap-4">
                        <div className="flex gap-4">
                            <LayoutPanelLeft className="w-5 h-5 text-gray-400 cursor-pointer hover:text-white" />
                            <Settings
                                className="w-5 h-5 text-gray-400 cursor-pointer hover:text-white"
                                onClick={() => setIsSettingsOpen(true)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            <SettingsModal
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
                currentLayout="editor-bottom"
                onLayoutChange={() => { }}
                isAssessmentMode={true}
            />
        </header>
    );
};
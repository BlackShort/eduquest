import { Link } from "react-router";
import { GalleryVerticalEnd, ChevronLeft, ChevronRight, Settings, CloudUpload, LayoutPanelLeft, AlarmClock } from 'lucide-react';
import eduquest from '@/assets/logo/favicon.png'
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { useState, useEffect } from 'react';


interface EditorHeaderProps {
    onSubmit: () => void;
    isRunning: boolean;
    initialTime?: number; // in seconds, default 1 hour
}

export const AssessmentHeader = ({ onSubmit, isRunning, initialTime = 3600 }: EditorHeaderProps) => {
    const [timeRemaining, setTimeRemaining] = useState(initialTime);

    useEffect(() => {
        if (timeRemaining <= 0) {
            // Auto-submit when timer reaches 0
            onSubmit();
            return;
        }

        const interval = setInterval(() => {
            setTimeRemaining(prev => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [timeRemaining, onSubmit]);

    const formatTime = (seconds: number): string => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        
        if (hours > 0) {
            return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        }
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const getTimerColor = () => {
        if (timeRemaining <= 300) return 'text-red-500'; // Less than 5 minutes
        if (timeRemaining <= 600) return 'text-orange-500'; // Less than 10 minutes
        return 'text-green-500';
    };


    return (
        <header className="w-full h-12 border-b border-neutral-800 bg-neutral-900">
            <div className="w-full px-6 h-full">
                <div className="flex items-center justify-between h-full">
                    <div className="flex w-max h-7 items-center gap-2">
                        <Link to="/dashboard" className="flex items-center px-2">
                            <img
                                src={eduquest}
                                alt="EduQuest"
                                className="w-full h-7 object-cover"
                            />
                            <span className="ml-2 text-lg tracking-wide font-medium text-white">Assessment</span>
                        </Link>

                        <div className="h-5 w-px bg-neutral-600" />

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

                    <div className="flex items-center justify-center">
                        <ButtonGroup className="flex gap-0.5">
                            <Button
                                className={`rounded-sm bg-neutral-800 hover:bg-neutral-700/50 ${timeRemaining <= 300 ? 'text-red-500 animate-pulse' : 'text-blue-500'}`}
                            >
                                <AlarmClock className="h-5 w-5"/>
                            </Button>
                            <Button
                                
                                className={`text-base rounded-sm bg-neutral-800 hover:bg-neutral-700/50 font-mono ${getTimerColor()}`}
                            >
                                {formatTime(timeRemaining)}
                            </Button>
                        </ButtonGroup>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex gap-4">
                            <LayoutPanelLeft className="w-5 h-5 text-gray-400 cursor-pointer hover:text-white" />
                            <Settings className="w-5 h-5 text-gray-400 cursor-pointer hover:text-white" />
                        </div>

                        <div className="flex items-center justify-center">
                            <Button
                                size={'sm'}
                                className="cursor-pointer rounded-sm bg-neutral-800 text-amber-500 hover:bg-neutral-700/50"
                                onClick={onSubmit}
                                disabled={isRunning}
                            >
                                <CloudUpload /> <span>Submit</span>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}
import { Link } from "react-router";
import { ChevronLeft, ChevronRight, Settings, User, ListVideo, CloudUpload, Play, LayoutPanelLeft, Shuffle } from 'lucide-react';
import eduquest from '@/assets/logo/favicon.png'
import { useContextAPI } from '@/hooks/useContext';
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"

interface EditorHeaderProps {
    onRun: () => void;
    onSubmit: () => void;
    isRunning: boolean;
}

export const EditorHeader = ({ onRun, onSubmit, isRunning }: EditorHeaderProps) => {
    const { isLoggedIn, user } = useContextAPI();

    return (
        <header className="w-full h-12">
            <div className="w-full px-6 h-full">
                <div className="flex items-center justify-between h-full">
                    <div className="flex w-max h-7 items-center gap-2">
                        <Link to="/dashboard" className="flex items-center px-2">
                            <img
                                src={eduquest}
                                alt="EduQuest"
                                className="w-full h-7 object-cover"
                            />
                        </Link>

                        <div className="h-5 w-px bg-neutral-600" />

                        <div className="flex items-center gap-0 text-gray-300 hover:bg-neutral-700/40 rounded transition-colors group">
                            <div className="flex items-center gap-2 px-3 py-1.5 hover:bg-white/10 rounded-l transition-colors cursor-pointer">
                                <ListVideo className="w-5 h-5" />
                                <span className="text-sm font-normal">Problem List</span>
                            </div>

                            <div className="h-8 w-px bg-neutral-950" />

                            <div className="flex items-center">
                                <button className="p-1.5 hover:bg-white/10 transition-colors cursor-pointer">
                                    <ChevronLeft className="w-5 h-5 text-neutral-400 hover:text-neutral-200" />
                                </button>

                                <div className="h-8 w-px bg-neutral-950" />

                                <button className="p-1.5 hover:bg-white/10 transition-colors cursor-pointer">
                                    <ChevronRight className="w-5 h-5 text-neutral-400 hover:text-neutral-200" />
                                </button>
                            </div>

                            <div className="h-8 w-px bg-neutral-950" />

                            <button className="p-1.5 hover:bg-neutral-700/60 rounded-r transition-colors cursor-pointer">
                                <Shuffle className="w-5 h-5 text-neutral-400 hover:text-neutral-200" />
                            </button>
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

                    <div className="flex items-center gap-4">
                        <div className="flex gap-4">
                            <LayoutPanelLeft className="w-5 h-5 text-gray-400 cursor-pointer hover:text-white" />
                            <Settings className="w-5 h-5 text-gray-400 cursor-pointer hover:text-white" />
                        </div>
                        {isLoggedIn && user ? (
                            <Link to={'/profile'}>
                                <button
                                    type="button"
                                    className="cursor-pointer flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-neutral-100 border border-orange-600/60 bg-orange-500 rounded-full hover:bg-orange-500 hover:text-white transition-all duration-200"
                                >
                                    <User size={18} />
                                    <span className="select-none">Profile</span>
                                </button>
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
import { useEffect, useState } from "react";
import {
    MonitorOff,
    UserCheck,
    Smartphone,
    AlertTriangle,
    Clock,
    ChevronRight,
    ShieldCheck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Severity = "high" | "medium";

interface Rule {
    icon: LucideIcon;
    title: string;
    description: string;
    severity: Severity;
}

const RULES: Rule[] = [
    {
        icon: MonitorOff,
        title: "No tab switching",
        description: "Navigating away from this tab will be flagged immediately and recorded.",
        severity: "high",
    },
    {
        icon: UserCheck,
        title: "Keep your face visible",
        description: "Your camera must capture your face clearly at all times during the exam.",
        severity: "high",
    },
    {
        icon: Smartphone,
        title: "No external devices",
        description: "Phones, tablets, smartwatches, or any secondary screens are strictly prohibited.",
        severity: "high",
    },
    {
        icon: AlertTriangle,
        title: "Suspicious activity is recorded",
        description: "All flagged events are reviewed by our proctoring team after submission.",
        severity: "medium",
    },
];

const COUNTDOWN_FROM = 30;


interface InstructionsScreenProps {
    onStart: () => void;
}

export const InstructionsScreen = ({ onStart }: InstructionsScreenProps) => {
    const [phase, setPhase] = useState<"reading" | "countdown">("reading");
    const [countdown, setCountdown] = useState(COUNTDOWN_FROM);

    useEffect(() => {
        if (phase !== "countdown") return;
        if (countdown <= 0) {
            onStart();
            return;
        }
        const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
        return () => clearTimeout(t);
    }, [phase, countdown, onStart]);

    const progress = ((COUNTDOWN_FROM - countdown) / COUNTDOWN_FROM) * 100;
    const circumference = 2 * Math.PI * 34;

    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-neutral-950 overflow-y-auto py-8">
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="w-125 h-125 rounded-full bg-orange-500/5 blur-3xl" />
            </div>

            {phase === "countdown" && (
                <div className="text-center space-y-4 mb-8">
                    <div className="relative inline-flex items-center justify-center">
                        <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                            <circle
                                cx="40" cy="40" r="34"
                                fill="none"
                                stroke="#262626"
                                strokeWidth="4"
                            />
                            <circle
                                cx="40" cy="40" r="34"
                                fill="none"
                                stroke="#f97316"
                                strokeWidth="4"
                                strokeLinecap="round"
                                strokeDasharray={circumference}
                                strokeDashoffset={circumference * (1 - progress / 100)}
                                className="transition-all duration-1000 ease-linear"
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <Clock className="w-4 h-4 text-orange-400 mb-0.5" />
                            <span className="text-xl font-bold text-white font-mono tabular-nums leading-none">
                                {countdown}
                            </span>
                        </div>
                    </div>
                    <p className="text-sm text-neutral-400">Assessment starting automatically...</p>
                </div>
            )}

            {phase === "reading" && (
                <div className="relative w-full max-w-lg mx-auto px-4">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/20 mb-5">
                            <ShieldCheck className="w-7 h-7 text-orange-400" />
                        </div>
                        <h1 className="text-2xl font-bold text-white tracking-tight mb-2">
                            Before You Begin
                        </h1>
                        <p className="text-sm text-neutral-400">
                            Read the following rules carefully. You are responsible for complying with them.
                        </p>
                    </div>

                    <div className="space-y-2.5 mb-8">
                        {RULES.map((rule, i) => (
                            <div
                                key={i}
                                className={`flex items-start gap-4 p-4 rounded-xl border transition-colors ${rule.severity === "high"
                                    ? "bg-neutral-900 border-neutral-800"
                                    : "bg-neutral-900/50 border-neutral-800/60"
                                    }`}
                            >
                                <div
                                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${rule.severity === "high" ? "bg-orange-500/10" : "bg-neutral-800"
                                        }`}
                                >
                                    <rule.icon
                                        className={`w-4 h-4 ${rule.severity === "high" ? "text-orange-400" : "text-neutral-400"
                                            }`}
                                    />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-white mb-0.5">{rule.title}</p>
                                    <p className="text-xs text-neutral-500 leading-relaxed">{rule.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="h-px bg-neutral-800 mb-6" />

                    <div className="space-y-3">
                        <p className="text-xs text-neutral-500 text-center">
                            By clicking start, you agree to be monitored for the duration of this assessment.
                        </p>
                        <button
                            onClick={() => setPhase("countdown")}
                            className="w-full flex items-center justify-center gap-2 px-6 py-3.5
                                       bg-orange-500 hover:bg-orange-400 active:bg-orange-600
                                       text-white font-semibold text-sm rounded-xl
                                       transition-all duration-200 cursor-pointer
                                       shadow-lg shadow-orange-500/20"
                        >
                            I Understand — Start Assessment
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
import { createContext, useContext } from "react";
import type { Question, Stage } from "@/types/assessment.types";
import type { ProctorEventType } from "@/types/proctor";

export interface AssessmentContextType {
    // ── Stage ──────────────────────────────────────────────────────────────────
    stage: Stage;
    setStage: (stage: Stage) => void;

    // ── Sidebar ────────────────────────────────────────────────────────────────
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
    toggleSidebar: () => void;

    // ── Questions ──────────────────────────────────────────────────────────────
    questions: Question[];
    currentQuestionId: string;
    setCurrentQuestionId: (id: string) => void;

    // ── Answers ────────────────────────────────────────────────────────────────
    answers: Record<string, string>;
    handleAnswerChange: (questionId: string, answer: string) => void;

    // ── Submission ─────────────────────────────────────────────────────────────
    isSubmitted: boolean;
    handleSubmitAssessment: () => void;

    // ── Timer ──────────────────────────────────────────────────────────────────
    timeRemaining: number;
    decrementTimeRemaining: () => void;

    // ── Proctor — session lifecycle ────────────────────────────────────────────
    startProctorSession: () => void;
    endProctorSession: () => void;
    proctorActive: boolean;
    proctorSessionId: string | null;

    // ── Proctor — detection callbacks (passed straight to ProctorOverlay) ──────
    reportEvent: (type: ProctorEventType, isActive: boolean, confidence?: number) => void;
    enrollIdentityFromVideo: ((video: HTMLVideoElement) => Promise<boolean>) | undefined;
    verifyIdentityFromVideo: (
        (video: HTMLVideoElement) => Promise<{
            matched: boolean;
            score: number;
            threshold: number;
        } | null>
    ) | undefined;
    shouldRunIdentityVerification: ((intervalMs?: number) => boolean) | undefined;

    // ── Navigation helpers ─────────────────────────────────────────────────────
    getCurrentQuestion: () => Question | undefined;
    getMcqQuestions: () => Question[];
    showNext: () => boolean;
    showPrevious: () => boolean;
    handleNext: () => void;
    handlePrevious: () => void;
}

export const AssessmentContext = createContext<AssessmentContextType | undefined>(undefined);

export function useAssessment(): AssessmentContextType {
    const ctx = useContext(AssessmentContext);
    if (!ctx) {
        throw new Error("useAssessment must be used inside <AssessmentProvider>");
    }
    return ctx;
}
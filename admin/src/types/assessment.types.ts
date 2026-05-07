import type { LucideIcon } from "lucide-react";

export interface Question {
    id: string;
    type: "coding" | "mcq";
    title: string;
    description?: string;
    section: string;
    difficulty?: string;
    options?: string[];
    test_cases?: {
        input: string;
        output: string;
        isHidden?: boolean;
    }[];
    question_id?: string;
    question_text?: string;
}

export type Stage = "fullscreen" | "setup" | "instructions" | "exam";

export type PatchFn = (id: CheckId, update: Partial<CheckItem>) => void;
export type SetPhaseFn = (phase: "pre" | "running" | "done") => void;

export type CheckStatus = "idle" | "checking" | "granted" | "failed" | "warning";

export type CheckId = "camera" | "microphone" | "display" | "network";

export interface CheckItem {
    id: CheckId;
    label: string;
    sublabel: string;
    icon: LucideIcon;
    status: CheckStatus;
    detail?: string;
    blocking: boolean;
}

export interface NetworkResult {
    mbps: number;
    latencyMs: number;
}

export interface ExtendedScreen extends Screen {
    readonly isExtended?: boolean;
}

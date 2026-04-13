import { useEffect, useState, useRef } from "react";
import {
  Camera,
  Mic,
  Wifi,
  ShieldCheck,
  ChevronRight,
  RefreshCw,
  Layers,
} from "lucide-react";
import type { CheckItem, CheckStatus, PatchFn } from "@/types/assessment.types";
import { CheckCard } from "@/components/assessment/check-card";
import { runChecks } from "@/lib/utils";

const INITIAL_CHECKS: CheckItem[] = [
  {
    id: "camera",
    label: "Camera",
    sublabel: "Required for identity verification and live monitoring",
    icon: Camera,
    status: "idle",
    blocking: true,
  },
  {
    id: "microphone",
    label: "Microphone",
    sublabel: "Required to detect verbal assistance or background help",
    icon: Mic,
    status: "idle",
    blocking: true,
  },
  {
    id: "display",
    label: "Single display only",
    sublabel: "Multiple monitors are not permitted during the assessment",
    icon: Layers,
    status: "idle",
    blocking: true,
  },
  {
    id: "network",
    label: "Network speed",
    sublabel: "Minimum 1 Mbps required for a stable proctored session",
    icon: Wifi,
    status: "idle",
    blocking: false,
  },
];

interface ProctorSetupProps {
  onComplete: () => void;
}

export const ProctorSetup = ({ onComplete }: ProctorSetupProps) => {
  const [checks, setChecks] = useState<CheckItem[]>(INITIAL_CHECKS);
  const [phase, setPhase] = useState<"pre" | "running" | "done">("pre");
  const mountedRef = useRef(true);

  const patch: PatchFn = (id, update) => {
    setChecks((prev) => prev.map((c) => (c.id === id ? { ...c, ...update } : c)));
  };

  const startChecks = () => {
    setPhase("pre");
    setChecks(INITIAL_CHECKS.map((c) => ({ ...c, status: "idle" as CheckStatus, detail: undefined })));
    runChecks(patch, setPhase, () => mountedRef.current);
  };

  useEffect(() => {
    mountedRef.current = true;
    runChecks(patch, setPhase, () => mountedRef.current);
    return () => { mountedRef.current = false; };
  }, []);

  // Derived state
  const blockingFailed = checks.some((c) => c.blocking && c.status === "failed");
  const anyPending = checks.some((c) => c.status === "checking" || c.status === "idle");
  const canProceed = phase === "done" && !blockingFailed;
  const grantedCount = checks.filter((c) => c.status === "granted").length;
  const progress = Math.round((grantedCount / checks.length) * 100);
  const barColor = blockingFailed ? "#ef4444" : canProceed ? "#22c55e" : "#f97316";

  const statusText = anyPending
    ? "Checking your environment..."
    : blockingFailed
      ? "Some required checks failed - resolve them to continue"
      : canProceed
        ? "All checks passed - ready to proceed"
        : "";

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-neutral-950 overflow-y-auto py-8">
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="w-150 h-150 rounded-full bg-orange-500/5 blur-3xl" />
      </div>

      <div className="relative w-full max-w-lg mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/20 mb-5">
            <ShieldCheck className="w-7 h-7 text-orange-400" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mb-1.5">
            Environment Check
          </h1>
          <p className="text-sm text-neutral-400 max-w-sm mx-auto leading-relaxed">
            Verifying your setup for a secure, plagiarism-free assessment. All required checks must pass.
          </p>
        </div>

        {/* Check cards */}
        <div className="space-y-2">
          {checks.map((check) => (
            <CheckCard key={check.id} check={check} />
          ))}
        </div>

        {/* Progress */}
        <div className="mt-6">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-neutral-400">{statusText}</span>
            <span className="font-mono text-neutral-500">{grantedCount} / {checks.length}</span>
          </div>
          <div className="h-1 w-full bg-neutral-800 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700 ease-out"
              style={{ width: `${progress}%`, background: barColor }}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 space-y-3">
          {phase === "done" && blockingFailed && (
            <button
              onClick={startChecks}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-white font-semibold text-sm rounded-xl transition-all duration-200 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              Retry Failed Checks
            </button>
          )}
          {canProceed && (
            <button
              onClick={onComplete}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-400 active:bg-orange-600 text-white font-semibold text-base rounded-xl transition-all duration-200 cursor-pointer shadow-lg shadow-orange-500/20"
            >
              Continue to Instructions
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
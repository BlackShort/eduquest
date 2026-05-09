"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useAssessment } from "@/contexts/AssessmentContext";
import {
  evaluateEnrollmentQuality,
  initFaceDetector,
  initObjectDetector,
  initFaceApi,
} from "@/proctor/proctor.engine";
import type { IdentityQualityChecks } from "@/types/proctor";

interface Props {
  onComplete: () => void;
  onCancel?: () => void;
}

const Spinner = () => (
  <svg className="animate-spin" width="13" height="13" viewBox="0 0 24 24"
    fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

const ScanRing = ({ passed }: { passed: boolean }) => (
  <svg className="pointer-events-none absolute inset-0 z-10"
    viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <circle cx="100" cy="100" r="93" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
    <circle cx="100" cy="100" r="93" fill="none"
      stroke={passed ? "#10b981" : "#f97316"}
      strokeWidth="2" strokeDasharray="90 490" strokeLinecap="round"
      style={{ animation: "ring-spin 3s linear infinite", transformOrigin: "100px 100px", transition: "stroke 0.5s" }} />
    <circle cx="100" cy="100" r="93" fill="none"
      stroke={passed ? "#10b981" : "#f97316"}
      strokeWidth="1.5" strokeDasharray="40 490" strokeLinecap="round"
      style={{ animation: "ring-spin 3s linear infinite reverse", transformOrigin: "100px 100px", opacity: 0.35, transition: "stroke 0.5s" }} />
    <circle cx="100" cy="7" r="3"
      fill={passed ? "#10b981" : "#f97316"}
      style={{ animation: "ring-spin 3s linear infinite", transformOrigin: "100px 100px", transition: "fill 0.5s" }} />
    <style>{`@keyframes ring-spin { to { transform: rotate(360deg); } }`}</style>
  </svg>
);

function MetricBar({ label, icon, score, expected, ok }: {
  label: string; icon: React.ReactNode;
  score: number; expected: number; ok: boolean | null;
}) {
  const pct = Math.min(100, Math.round((score / expected) * 100));
  const hasData = score > 0;
  return (
    <div className={`rounded-xl border p-3.5 transition-colors duration-300 ${ok === true ? "border-emerald-500/30 bg-neutral-900/70"
        : ok === false ? "border-orange-500/30 bg-neutral-900/70"
          : "border-white/[0.07] bg-neutral-900/50"
      }`}>
      <div className="mb-2.5 flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-zinc-400">
          {icon} {label}
        </span>
        <span className="font-mono text-[11px] text-zinc-600">
          {hasData ? score.toFixed(1) : "—"} / {expected}+
        </span>
      </div>
      <div className="h-[5px] w-full overflow-hidden rounded-full bg-neutral-800">
        <div
          className={`h-full rounded-full transition-all duration-700 ${ok === true ? "bg-emerald-500" : "bg-orange-500"}`}
          style={{ width: hasData ? `${pct}%` : "0%" }}
        />
      </div>
    </div>
  );
}

function StatusPill({ label, value, ok, pending, iconOk, iconFail }: {
  label: string; value: string;
  ok: boolean; pending: boolean;
  iconOk: React.ReactNode; iconFail: React.ReactNode;
}) {
  return (
    <div className={`flex items-center gap-3 rounded-xl border p-3 transition-colors duration-300 ${pending ? "border-white/[0.07] bg-neutral-900/50"
        : ok ? "border-emerald-500/25 bg-emerald-500/[0.07]"
          : "border-orange-500/25 bg-orange-500/[0.07]"
      }`}>
      <div className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg text-sm ${pending ? "bg-neutral-800 text-zinc-500"
          : ok ? "bg-emerald-500/20 text-emerald-400"
            : "bg-orange-500/20 text-orange-400"
        }`}>
        {pending ? iconOk : ok ? iconOk : iconFail}
      </div>
      <div>
        <div className="text-[10px] uppercase tracking-[0.08em] text-zinc-600">{label}</div>
        <div className={`mt-0.5 text-[13px] font-semibold ${pending ? "text-zinc-500" : ok ? "text-emerald-400" : "text-orange-400"
          }`}>{value}</div>
      </div>
    </div>
  );
}

export const QualityGate = ({ onComplete, onCancel }: Props) => {
  const { enrollIdentityFromVideo } = useAssessment();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [streamActive, setStreamActive] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [modelsReady, setModelsReady] = useState(false);
  const [quality, setQuality] = useState<IdentityQualityChecks | null>(null);
  const [checking, setChecking] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [enrolled, setEnrolled] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modelProgress, setModelProgress] = useState(0);
  const [step, setStep] = useState(2);

  const BRIGHTNESS_EXPECTED = 75;
  const BLUR_EXPECTED = 55;
  const brightnessScore = quality?.brightnessScore ?? 0;
  const blurScore = quality?.blurScore ?? 0;

  useEffect(() => {
    let stream: MediaStream | null = null;
    let mounted = true;
    let prog = 0;

    async function start() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });
        if (!mounted) return;
        if (videoRef.current) videoRef.current.srcObject = stream;
        setStreamActive(true);

        const ticker = setInterval(() => {
          prog = Math.min(85, prog + Math.random() * 8);
          if (mounted) setModelProgress(Math.round(prog));
        }, 200);

        const [a, b, c] = await Promise.all([
          initFaceDetector(),
          initObjectDetector(),
          initFaceApi(),
        ]);
        clearInterval(ticker);
        if (!a) throw new Error("Face detector failed to load");
        if (!b) throw new Error("Object detector failed to load");
        if (!c) throw new Error("Face-API models failed — check internet connection");

        if (mounted) { setModelProgress(100); setModelsReady(true); }
      } catch (err) {
        if (mounted)
          setError(err instanceof Error ? err.message : "Initialization failed. Check console.");
      }
    }

    void start();
    return () => {
      mounted = false;
      if (stream) stream.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const runCheck = async () => {
    const video = videoRef.current;
    if (!video || !videoReady) { setError("Camera is still loading."); return; }
    setChecking(true);
    setError(null);
    try {
      const q = await evaluateEnrollmentQuality(video);
      setQuality(q);
      if (q.passed) setStep(3);
    } catch (err) {
      console.error(err);
      setError("Quality check failed");
    } finally {
      setChecking(false);
    }
  };

  const handleEnroll = useCallback(async () => {
    const video = videoRef.current;
    if (!video || !videoReady || !enrollIdentityFromVideo) { setError("Camera not ready."); return; }
    setEnrolling(true);
    setError(null);
    try {
      const ok = await enrollIdentityFromVideo(video);
      if (ok) { setEnrolled(true); onComplete(); }
      else { setError("Enrollment failed — try again in better light"); }
    } catch (err) {
      console.error(err);
      setError("Enrollment error — check console");
    } finally {
      setEnrolling(false);
    }
  }, [enrollIdentityFromVideo, onComplete, videoReady]);

  useEffect(() => {
    if (quality?.passed && !enrolling && !enrolled) {
      const t = setTimeout(() => void handleEnroll(), 600);
      return () => clearTimeout(t);
    }
  }, [quality?.passed, enrolling, enrolled, handleEnroll]);

  const canCheck = streamActive && modelsReady && videoReady && !checking && !quality?.passed;
  const canEnroll = !!quality?.passed && videoReady && !enrolling && !enrolled;

  // Hide buttons progressively
  const showCancelCheck = !quality?.passed && !enrolled;
  const showEnroll = quality?.passed && !enrolled;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
      <style>{`
        @keyframes scan-line {
          0% { top: 14px; opacity: 0; }
          8% { opacity: 0.7; }
          92% { opacity: 0.7; }
          100% { top: calc(100% - 14px); opacity: 0; }
        }
        .scan-anim { animation: scan-line 3s ease-in-out 0.5s infinite; }
      `}</style>

      <div className="flex w-full max-w-[840px] flex-col overflow-hidden rounded-2xl border border-white/[0.07] bg-[#111114] shadow-2xl">

        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.07] px-7 py-5">
          <div className="flex items-center gap-3">
            <div className={`h-2 w-2 rounded-full transition-colors duration-500 ${enrolled ? "bg-emerald-400" : "bg-orange-400"
              }`} style={{ animation: "pulse 2s ease-in-out infinite" }} />
            <div>
              <h2 className="text-[15px] font-semibold tracking-tight text-zinc-100">Identity Enrollment</h2>
              <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-zinc-600">Quality Verification</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex gap-1.5">
              {[1, 2, 3].map((s) => (
                <div key={s} className={`h-1 w-6 rounded-full transition-all duration-500 ${s < step ? "bg-emerald-500" : s === step ? "bg-orange-500" : "bg-neutral-800"
                  }`} />
              ))}
            </div>
            <span className="font-mono text-[11px] text-zinc-600">
              {enrolled ? "✓ Done" : `${step} / 3`}
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="grid grid-cols-[240px_1fr] gap-6 p-7">

          {/* Camera */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative h-[196px] w-[196px]">
              <ScanRing passed={!!enrolled} />
              <video
                ref={videoRef}
                autoPlay muted playsInline
                onLoadedMetadata={() => setVideoReady(true)}
                onPlaying={() => setVideoReady(true)}
                className="absolute inset-[13px] z-[2] h-[calc(100%-26px)] w-[calc(100%-26px)] rounded-full bg-black object-cover"
              />
              <div className="scan-anim pointer-events-none absolute left-[13px] right-[13px] z-[4] h-[1.5px] rounded-full bg-gradient-to-r from-transparent via-orange-400 to-transparent"
                style={{ top: "13px", opacity: 0 }} />
            </div>

            <div className="flex items-center gap-2">
              <div className={`h-[5px] w-[5px] rounded-full ${enrolled ? "bg-emerald-400" : streamActive ? "bg-orange-400" : "bg-zinc-600"
                }`} style={streamActive ? { animation: "pulse 1.5s infinite" } : {}} />
              <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-zinc-500">
                {enrolled ? "Enrolled" : !streamActive ? "Initializing…" : !modelsReady ? "Loading models…"
                  : quality?.passed ? "Quality verified" : "Camera active"}
              </span>
            </div>

            {!modelsReady && (
              <div className="w-full">
                <div className="h-[3px] w-full overflow-hidden rounded-full bg-neutral-800">
                  <div className="h-full rounded-full bg-orange-500 transition-all duration-300"
                    style={{ width: `${modelProgress}%` }} />
                </div>
                <p className="mt-1.5 text-center font-mono text-[10px] text-zinc-600">
                  {modelProgress}% — loading ML models
                </p>
              </div>
            )}
          </div>

          {/* Metrics */}
          <div className="flex flex-col gap-3">

            {!modelsReady && (
              <div className="flex items-center gap-2 rounded-xl border border-orange-500/20 bg-orange-500/[0.07] px-3.5 py-2.5 font-mono text-[11px] text-orange-400">
                <Spinner />
                Loading ML models — please wait
              </div>
            )}

            {enrolled ? (
              <div className="flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/[0.08] px-4 py-3.5">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" className="flex-shrink-0">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                <span className="text-[13px] font-semibold text-emerald-400">Identity enrolled successfully</span>
              </div>
            ) : (
              <>
                <MetricBar label="Brightness"
                  icon={<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="4" /><line x1="12" y1="2" x2="12" y2="6" /><line x1="12" y1="18" x2="12" y2="22" /><line x1="4.93" y1="4.93" x2="7.76" y2="7.76" /><line x1="16.24" y1="16.24" x2="19.07" y2="19.07" /><line x1="2" y1="12" x2="6" y2="12" /><line x1="18" y1="12" x2="22" y2="12" /></svg>}
                  score={brightnessScore} expected={BRIGHTNESS_EXPECTED}
                  ok={quality ? (quality.brightnessOk ?? null) : null} />

                <MetricBar label="Sharpness"
                  icon={<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><line x1="14.31" y1="8" x2="20.05" y2="17.94" /><line x1="9.69" y1="8" x2="21.17" y2="8" /><line x1="7.38" y1="12" x2="13.12" y2="2.06" /><line x1="9.69" y1="16" x2="3.95" y2="6.06" /></svg>}
                  score={blurScore} expected={BLUR_EXPECTED}
                  ok={quality ? (quality.blurOk ?? null) : null} />

                <div className="grid grid-cols-2 gap-2.5">
                  <StatusPill label="Face"
                    value={quality ? (quality.singleFace ? "Detected" : "Not found") : "Pending"}
                    ok={!!quality?.singleFace} pending={!quality}
                    iconOk={<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>}
                    iconFail={<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>}
                  />
                  <StatusPill label="Status"
                    value={quality ? (quality.passed ? "Passed" : "Failed") : "Pending"}
                    ok={!!quality?.passed} pending={!quality}
                    iconOk={<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="20 6 9 17 4 12" /></svg>}
                    iconFail={<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>}
                  />
                </div>

                {quality?.passed && (
                  <div className="flex items-center gap-2 rounded-xl border border-emerald-500/25 bg-emerald-500/[0.07] px-3.5 py-2.5 font-mono text-[11px] text-emerald-400">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="flex-shrink-0"><polyline points="20 6 9 17 4 12" /></svg>
                    All checks passed — enrolling identity…
                  </div>
                )}

                {!quality?.passed && (
                  <div className="flex items-center gap-2 rounded-xl border border-amber-500/20 bg-amber-500/[0.07] px-3.5 py-2.5 font-mono text-[11px] text-amber-400">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="flex-shrink-0"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
                    Poor lighting or blur will cause check failure
                  </div>
                )}
              </>
            )}

            {error && (
              <div className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/[0.07] px-3.5 py-2.5 font-mono text-[11px] text-red-400">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="flex-shrink-0"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                {error}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-white/[0.07] px-7 py-4">
          <p className="font-mono text-[11px] tracking-[0.05em] text-zinc-600">
            {enrolled ? "Enrollment complete"
              : !streamActive ? "Awaiting camera permission"
                : !modelsReady ? "Loading AI models…"
                  : quality?.passed ? "All checks passed — enrolling identity"
                    : quality ? "Adjust conditions and re-run check"
                      : "Position face in frame, then run quality check"}
          </p>

          {/* Buttons hide themselves when their job is done */}
          {!enrolled && (
            <div className="flex items-center gap-2.5">
              {showCancelCheck && (
                <>
                  <button
                    className="rounded-[9px] border border-white/10 bg-transparent px-4 py-2 text-xs font-semibold text-zinc-400 transition hover:border-white/20 hover:text-zinc-200"
                    onClick={() => onCancel?.()}
                  >
                    Cancel
                  </button>
                  <button
                    className="rounded-[9px] border border-white/10 bg-neutral-800 px-4 py-2 text-xs font-semibold text-zinc-100 transition hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-40"
                    onClick={runCheck}
                    disabled={!canCheck}
                  >
                    {checking ? (
                      <span className="flex items-center gap-1.5"><Spinner />{quality ? "Re-checking…" : "Checking…"}</span>
                    ) : quality ? "Re-check" : "Check Quality"}
                  </button>
                </>
              )}
              {showEnroll && (
                <button
                  className="rounded-[9px] bg-orange-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-40"
                  onClick={handleEnroll}
                  disabled={!canEnroll}
                >
                  {enrolling ? (
                    <span className="flex items-center gap-1.5"><Spinner />Enrolling…</span>
                  ) : "Enroll Identity"}
                </button>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default QualityGate;
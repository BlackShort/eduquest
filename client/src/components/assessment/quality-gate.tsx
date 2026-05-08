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

export const QualityGate = ({ onComplete, onCancel }: Props) => {
  const { enrollIdentityFromVideo } = useAssessment();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [streamActive, setStreamActive] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [modelsReady, setModelsReady] = useState(false);
  const [quality, setQuality] = useState<IdentityQualityChecks | null>(null);
  const [checking, setChecking] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const BRIGHTNESS_EXPECTED = 75;
  const BLUR_EXPECTED = 55;

  const brightnessScore = quality?.brightnessScore ?? 0;
  const blurScore = quality?.blurScore ?? 0;
  const brightnessProgress = Math.min(
    100,
    Math.round((brightnessScore / BRIGHTNESS_EXPECTED) * 100),
  );
  const blurProgress = Math.min(
    100,
    Math.round((blurScore / BLUR_EXPECTED) * 100),
  );

  useEffect(() => {
    let stream: MediaStream | null = null;
    let mounted = true;

    async function start() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480 },
        });
        if (!mounted) return;
        if (videoRef.current) videoRef.current.srcObject = stream;

        // Load all ML models
        console.log("Loading ML models...");
        const blazefaceReady = await initFaceDetector();
        if (!blazefaceReady) throw new Error("Face detector failed to load");
        console.log("Face detector loaded");

        const cocoReady = await initObjectDetector();
        if (!cocoReady) throw new Error("Object detector failed to load");
        console.log("Object detector loaded");

        const faceApiReady = await initFaceApi();
        if (!faceApiReady)
          throw new Error(
            "Face-API models failed to load - check internet connection",
          );
        console.log("Face-API models loaded");

        setStreamActive(true);
        setModelsReady(true);
      } catch (err) {
        console.error(err);
        setError(
          err instanceof Error
            ? err.message
            : "Failed to initialize. Check console for details.",
        );
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
    if (!video || !videoReady) {
      setError("Camera is still loading. Please wait a moment.");
      return;
    }
    setChecking(true);
    try {
      const q = await evaluateEnrollmentQuality(video);
      setQuality(q);
    } catch (err) {
      console.error("Quality check failed", err);
      setError("Quality check failed");
    } finally {
      setChecking(false);
    }
  };

  const handleEnroll = useCallback(async () => {
    const video = videoRef.current;
    if (!video || !videoReady || !enrollIdentityFromVideo) {
      setError("Camera is still loading. Please wait a moment.");
      return;
    }
    setEnrolling(true);
    setError(null);
    try {
      const ok = await enrollIdentityFromVideo(video);
      if (ok) {
        onComplete();
      } else {
        setError("Enrollment failed - try again in a better-lit area");
      }
    } catch (err) {
      console.error(err);
      setError("Enrollment error - check console for details");
    } finally {
      setEnrolling(false);
    }
  }, [enrollIdentityFromVideo, onComplete, videoReady]);

  useEffect(() => {
    if (quality?.passed && !enrolling) {
      const t = setTimeout(() => {
        void handleEnroll();
      }, 600);
      return () => clearTimeout(t);
    }
  }, [quality?.passed, enrolling, handleEnroll]);

  return (
    <div className="fixed inset-0 z-50 h-screen w-screen overflow-hidden bg-neutral-950/95 p-3 sm:p-4">
      <div className="mx-auto flex h-full w-full max-w-6xl flex-col rounded-2xl border border-neutral-800 bg-neutral-900/95 shadow-2xl">
        <div className="border-b border-neutral-800 px-4 py-3 sm:px-6 sm:py-4">
          <h2 className="text-base font-semibold text-white sm:text-lg">
            Quality Check
          </h2>
          <p className="mt-1 text-xs text-neutral-400 sm:text-sm">
            Ensure proper lighting and clarity before enrollment to reduce false
            proctoring alerts.
          </p>
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto p-3 sm:gap-3 sm:p-4">
          {/* Camera and Scores Row */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {/* Camera */}
            <div className="flex min-h-0 items-center justify-center">
              <div className="w-full max-w-sm rounded-xl border border-neutral-800 bg-neutral-950 p-2 sm:p-3">
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  onLoadedMetadata={() => setVideoReady(true)}
                  onPlaying={() => setVideoReady(true)}
                  className="h-40 w-full rounded-lg bg-black object-cover sm:h-48"
                />
                <div className="mt-1.5 text-center text-xs text-neutral-400">
                  {streamActive
                    ? "Camera ready"
                    : "Waiting for camera permission"}
                </div>
              </div>
            </div>

            {/* Brightness and Blur Scores */}
            <div className="flex min-h-0 flex-col gap-2">
              <div className="rounded-lg border border-neutral-800 bg-neutral-950/60 p-2.5">
                <div className="mb-0.5 flex items-center justify-between">
                  <span className="text-xs font-medium text-white">
                    Brightness
                  </span>
                  <span className="text-[10px] text-neutral-400">
                    {brightnessScore.toFixed(1)} / {BRIGHTNESS_EXPECTED}+
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-800">
                  <div
                    className={`h-full rounded-full ${quality?.brightnessOk ? "bg-emerald-500" : "bg-amber-500"}`}
                    style={{ width: `${brightnessProgress}%` }}
                  />
                </div>
              </div>

              <div className="rounded-lg border border-neutral-800 bg-neutral-950/60 p-2.5">
                <div className="mb-0.5 flex items-center justify-between">
                  <span className="text-xs font-medium text-white">Blur</span>
                  <span className="text-[10px] text-neutral-400">
                    {blurScore.toFixed(1)} / {BLUR_EXPECTED}+
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-800">
                  <div
                    className={`h-full rounded-full ${quality?.blurOk ? "bg-emerald-500" : "bg-amber-500"}`}
                    style={{ width: `${blurProgress}%` }}
                  />
                </div>
              </div>

              <div className="rounded-lg border border-neutral-800 bg-neutral-950/60 p-2.5 text-[11px] text-neutral-300">
                <div>
                  Face:{" "}
                  {quality ? (quality.singleFace ? "Detected" : "Failed") : "—"}
                </div>
                <div>
                  Status:{" "}
                  {quality ? (quality.passed ? "Passed" : "Failed") : "Pending"}
                </div>
              </div>
            </div>
          </div>

          {/* Single-line Warning */}
          <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 px-2 py-1 text-[11px] text-amber-200">
            Low light or blurry areas will fail. Ensure good lighting and clear
            image.
          </div>

          {/* Loading State */}
          {!modelsReady && (
            <div className="rounded-lg border border-blue-500/20 bg-blue-500/5 px-2 py-1 text-[11px] text-blue-200">
              Loading ML models... Please wait.
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-2 py-1 text-[11px] text-red-300">
              {error}
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-2 sm:justify-end">
            <button
              className="flex-1 rounded-lg bg-neutral-700 px-3 py-2 text-xs font-medium text-white hover:bg-neutral-600 sm:flex-none sm:px-4"
              onClick={() => onCancel?.()}
            >
              Cancel
            </button>
            <button
              className="flex-1 rounded-lg bg-neutral-800 px-3 py-2 text-xs font-medium text-white hover:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none sm:px-4"
              onClick={runCheck}
              disabled={
                !streamActive || !modelsReady || !videoReady || checking
              }
            >
              {!modelsReady
                ? "Loading..."
                : checking
                  ? "Checking..."
                  : "Check Quality"}
            </button>
            <button
              className="flex-1 rounded-lg bg-orange-500 px-3 py-2 text-xs font-semibold text-white hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-60 sm:flex-none sm:px-4"
              onClick={handleEnroll}
              disabled={!quality || !quality.passed || !videoReady || enrolling}
            >
              {enrolling ? "Enrolling..." : "Enroll"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QualityGate;

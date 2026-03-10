"use client";

import { useEffect, useRef, useState } from "react";
import {
  initFaceDetector,
  detectFaces,
  initObjectDetector,
  detectPhone,
} from "@/proctor/proctor.engine";
import type { ProctorEventType } from "@/types/proctor";

interface Props {
  active: boolean;
  sessionId: string | null;
  reportEvent: (
    type: ProctorEventType,
    isActive: boolean,
    confidence?: number,
  ) => void;
  enrollIdentityFromVideo?: (video: HTMLVideoElement) => Promise<boolean>;
  verifyIdentityFromVideo?: (video: HTMLVideoElement) => Promise<{
    matched: boolean;
    score: number;
    threshold: number;
  } | null>;
  shouldRunIdentityVerification?: (intervalMs?: number) => boolean;
}

export default function ProctorOverlay({
  active,
  sessionId,
  reportEvent,
  enrollIdentityFromVideo,
  verifyIdentityFromVideo,
  shouldRunIdentityVerification,
}: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [faceCount, setFaceCount] = useState(0);

  const detectionInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const tickCounter = useRef(0);
  const lastPhoneDetection = useRef(false);
  const identityEnrolledRef = useRef(false);
  const lastEnrollAttemptAtRef = useRef<number | null>(null);
  const identityMismatchRef = useRef(false);

  // Keep identity state stable across effect re-runs; reset only on session stop/change.
  useEffect(() => {
    if (!active || !sessionId) {
      identityEnrolledRef.current = false;
      lastEnrollAttemptAtRef.current = null;
      identityMismatchRef.current = false;
    }
  }, [active, sessionId]);

  // Webcam lifecycle.

  useEffect(() => {
    if (!active) return;

    let stream: MediaStream | null = null;

    async function startCam() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480 },
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch {
        setWarning("Camera access denied");
      }
    }

    startCam();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [active]);

  // Main detection loop: identity + face/phone events + UI warning state.

  useEffect(() => {
    if (!active || !sessionId) return;

    let isCancelled = false;

    async function startDetection() {
      await initFaceDetector();
      await initObjectDetector();

      detectionInterval.current = setInterval(async () => {
        if (isCancelled) return;

        const video = videoRef.current;
        if (!video) return;

        tickCounter.current++;

        // Identity flow.
        const now = Date.now();
        const readyForIdentity = video.readyState >= 2;

        if (
          readyForIdentity &&
          !identityEnrolledRef.current &&
          enrollIdentityFromVideo
        ) {
          const lastTry = lastEnrollAttemptAtRef.current;
          const canRetry = !lastTry || now - lastTry >= 10000;

          if (canRetry) {
            lastEnrollAttemptAtRef.current = now;
            try {
              const enrolled = await enrollIdentityFromVideo(video);
              if (enrolled) {
                identityEnrolledRef.current = true;
              }
            } catch (err) {
              console.error("Identity enrollment failed", err);
            }
          }
        }

        if (
          readyForIdentity &&
          identityEnrolledRef.current &&
          verifyIdentityFromVideo &&
          // shouldRunIdentityVerification?.(5 * 60 * 1000)
          shouldRunIdentityVerification?.(5 * 1000)
        ) {
          try {
            const verifyResult = await verifyIdentityFromVideo(video);
            if (verifyResult) {
              identityMismatchRef.current = !verifyResult.matched;
            }
          } catch (err) {
            console.error("Identity verification failed", err);
          }
        }

        // Face detection runs every cycle.

        const count = await detectFaces(video);
        setFaceCount(count);

        // reportEvent handles state transitions and per-event limits.
        const isNoFace = count === 0;
        const isMultipleFaces = count > 1;

        reportEvent("NO_FACE", isNoFace);
        reportEvent("MULTIPLE_FACES", isMultipleFaces);

        // Phone detection is less frequent to reduce load.

        if (tickCounter.current % 3 === 0) {
          const phoneDetected = await detectPhone(video);
          lastPhoneDetection.current = phoneDetected;
          reportEvent("PHONE_DETECTED", phoneDetected, 0.8);
        }

        // Warning priority for banner display.

        const currentNoFace = count === 0;
        const currentMultipleFaces = count > 1;
        const phoneDetected = lastPhoneDetection.current;

        if (phoneDetected) {
          setWarning("📱 Phone detected");
        } else if (currentNoFace) {
          setWarning("⚠️ No face detected");
        } else if (identityMismatchRef.current) {
          setWarning("⚠️ Identity mismatch detected");
        } else if (currentMultipleFaces) {
          setWarning("⚠️ Multiple faces detected");
        } else {
          setWarning(null);
        }
      }, 500);
    }

    startDetection();

    return () => {
      isCancelled = true;

      if (detectionInterval.current) {
        clearInterval(detectionInterval.current);
      }
    };
  }, [
    active,
    sessionId,
    reportEvent,
    enrollIdentityFromVideo,
    verifyIdentityFromVideo,
    shouldRunIdentityVerification,
  ]);

  if (!active) return null;

  return (
    <>
      {/* Floating proctor panel */}
      <div
        style={{
          position: "fixed",
          bottom: 20,
          left: 20,
          width: 240,
          background: "linear-gradient(180deg, #1d1d20 0%, #131316 100%)",
          border: "1px solid rgba(255, 122, 0, 0.35)",
          borderRadius: 14,
          padding: 10,
          boxShadow: "0 10px 30px rgba(0, 0, 0, 0.45)",
          backdropFilter: "blur(4px)",
          zIndex: 9999,
        }}
      >
        <div
          style={{
            color: "#ff8a24",
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: 0.3,
          }}
        >
          ● Proctor Active
        </div>

        <div style={{ fontSize: 12, color: "#a8a8af", marginTop: 4 }}>
          Faces detected: {faceCount}
        </div>

        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          style={{
            width: "100%",
            marginTop: 8,
            borderRadius: 8,
            border: "1px solid rgba(255,255,255,0.08)",
            background: "#000",
          }}
        />
      </div>

      {/* Warning banner */}
      {warning && (
        <div
          style={{
            position: "fixed",
            top: 20,
            left: "50%",
            transform: "translateX(-50%)",
            background: "linear-gradient(90deg, #ff5a3d 0%, #ff7a00 100%)",
            color: "white",
            padding: "10px 16px",
            borderRadius: 10,
            border: "1px solid rgba(255,255,255,0.2)",
            fontWeight: 700,
            letterSpacing: 0.2,
            boxShadow: "0 8px 18px rgba(0,0,0,0.28)",
            zIndex: 10000,
          }}
        >
          {warning}
        </div>
      )}
    </>
  );
}

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
}

export default function ProctorOverlay({
  active,
  sessionId,
  reportEvent,
}: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [faceCount, setFaceCount] = useState(0);

  const detectionInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const tickCounter = useRef(0);
  const lastPhoneDetection = useRef(false); // Track phone state for UI

  /* ==============================
     START WEBCAM
  ============================== */

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

  /* ==============================
     AI DETECTION LOOP
  ============================== */

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

        /* -------- FACE DETECTION (Every cycle) -------- */

        const count = await detectFaces(video);
        setFaceCount(count);

        // 🎯 State-based reporting (not event spam)
        const isNoFace = count === 0;
        const isMultipleFaces = count > 1;

        reportEvent("NO_FACE", isNoFace);
        reportEvent("MULTIPLE_FACES", isMultipleFaces);

        /* -------- PHONE DETECTION (Every 3rd cycle ~1.5s) -------- */

        if (tickCounter.current % 3 === 0) {
          const phoneDetected = await detectPhone(video);
          lastPhoneDetection.current = phoneDetected;
          reportEvent("PHONE_DETECTED", phoneDetected, 0.8);
        }

        /* -------- WARNING PRIORITY (Based on current states) -------- */

        const currentNoFace = count === 0;
        const currentMultipleFaces = count > 1;
        const phoneDetected = lastPhoneDetection.current;

        if (phoneDetected) {
          setWarning("📱 Phone detected");
        } else if (currentNoFace) {
          setWarning("⚠️ No face detected");
        } else if (currentMultipleFaces) {
          setWarning("⚠️ Multiple faces detected");
        } else {
          setWarning(null);
        }
      }, 500); // ⚡ 500ms = Near real-time detection with API throttling
    }

    startDetection();

    return () => {
      isCancelled = true;

      if (detectionInterval.current) {
        clearInterval(detectionInterval.current);
      }
    };
  }, [active, sessionId, reportEvent]);

  if (!active) return null;

  return (
    <>
      {/* Floating Camera Panel */}
      <div
        style={{
          position: "fixed",
          bottom: 20,
          right: 20,
          width: 220,
          background: "#111",
          borderRadius: 12,
          padding: 10,
          boxShadow: "0 0 12px rgba(0,0,0,0.4)",
          zIndex: 9999,
        }}
      >
        <div style={{ color: "#0f0", fontSize: 12 }}>● Proctor Active</div>

        <div style={{ fontSize: 12, color: "#aaa" }}>Faces: {faceCount}</div>

        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          style={{
            width: "100%",
            borderRadius: 8,
            background: "#000",
          }}
        />
      </div>

      {/* Warning Banner */}
      {warning && (
        <div
          style={{
            position: "fixed",
            top: 20,
            left: "50%",
            transform: "translateX(-50%)",
            background: "#ff4444",
            color: "white",
            padding: "10px 18px",
            borderRadius: 8,
            fontWeight: 600,
            zIndex: 10000,
          }}
        >
          {warning}
        </div>
      )}
    </>
  );
}

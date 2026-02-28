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
  reportEvent: (type: ProctorEventType) => void;
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
  const activeViolations = useRef<Record<string, boolean>>({});
  const tickCounter = useRef(0);

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

        if (count === 0) {
          if (!activeViolations.current["NO_FACE"]) {
            reportEvent("NO_FACE");
            activeViolations.current["NO_FACE"] = true;
          }
        } else {
          activeViolations.current["NO_FACE"] = false;
        }

        if (count > 1) {
          if (!activeViolations.current["MULTIPLE_FACES"]) {
            reportEvent("MULTIPLE_FACES");
            activeViolations.current["MULTIPLE_FACES"] = true;
          }
        } else {
          activeViolations.current["MULTIPLE_FACES"] = false;
        }

        /* -------- PHONE DETECTION (Every 3rd cycle ~9s) -------- */

        let phoneDetected = false;

        if (tickCounter.current % 3 === 0) {
          phoneDetected = await detectPhone(video);

          if (phoneDetected) {
            if (!activeViolations.current["PHONE_DETECTED"]) {
              reportEvent("PHONE_DETECTED");
              activeViolations.current["PHONE_DETECTED"] = true;
            }
          } else {
            activeViolations.current["PHONE_DETECTED"] = false;
          }
        }

        /* -------- WARNING PRIORITY -------- */

        if (activeViolations.current["PHONE_DETECTED"]) {
          setWarning("📱 Phone detected");
        } else if (activeViolations.current["NO_FACE"]) {
          setWarning("⚠️ No face detected");
        } else if (activeViolations.current["MULTIPLE_FACES"]) {
          setWarning("⚠️ Multiple faces detected");
        } else {
          setWarning(null);
        }
      }, 3000);
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
        <div style={{ color: "#0f0", fontSize: 12 }}>
          ● Proctor Active
        </div>

        <div style={{ fontSize: 12, color: "#aaa" }}>
          Faces: {faceCount}
        </div>

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
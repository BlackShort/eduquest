"use client";

import { useEffect, useRef, useState } from "react";

interface Props {
  active: boolean;
}

export default function ProctorOverlay({ active }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [warning, setWarning] = useState<string | null>(null);

  /* ---------- start webcam ---------- */

  useEffect(() => {
    if (!active) return;

    const videoE1 = videoRef.current

    async function startCam() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });

        if (videoE1) {
          videoE1.srcObject = stream;
        }
      } catch (err) {
        console.log(err)
        setWarning("Camera access denied");
      }
    }

    startCam();

    return () => {
      if (videoE1?.srcObject) {
        const tracks = (videoE1.srcObject as MediaStream).getTracks();
        tracks.forEach(t => t.stop());
      }
    };
  }, [active]);

  /* ---------- tab warning UI ---------- */

  useEffect(() => {
    if (!active) return;

    const vis = () => {
      if (document.visibilityState === "hidden") {
        setWarning("⚠️ Tab switch detected");
        setTimeout(() => setWarning(null), 3000);
      }
    };

    window.addEventListener("blur", vis);
    document.addEventListener("visibilitychange", vis);

    return () => {
      window.removeEventListener("blur", vis);
      document.removeEventListener("visibilitychange", vis);
    };
  }, [active]);

  if (!active) return null;

  return (
    <>
      {/* floating camera panel */}
      <div
        style={{
          position: "fixed",
          bottom: 20,
          right: 20,
          width: 200,
          background: "#111",
          borderRadius: 12,
          padding: 10,
          boxShadow: "0 0 12px rgba(0,0,0,0.4)",
          zIndex: 9999,
        }}
      >
        <div style={{ color: "#0f0", fontSize: 12, marginBottom: 6 }}>
          ● Proctor Active
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

      {/* warning banner */}
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

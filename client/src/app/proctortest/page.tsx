"use client";

import { useProctor } from "@/hooks/useProctor";
import ProctorOverlay from "@/components/proctor/ProctorOverlay";

export const ProctorTestPage = () => {
  const proctor = useProctor({ examId: "exam_dev_ts_001" });

  return (
    <div style={{ padding: 40 }}>
      <h1>Proctor TS Test Page</h1>

      <button onClick={proctor.startSession}>Start Session</button>

      <button onClick={proctor.endSession}>End Session</button>

      <hr />

      <button onClick={() => proctor.reportEvent("TAB_SWITCH")}>
        Simulate Tab Switch
      </button>

      <button onClick={() => proctor.reportEvent("MULTIPLE_FACES")}>
        Simulate Multiple Faces
      </button>

      <button onClick={() => proctor.reportEvent("PHONE_DETECTED")}>
        Simulate Phone
      </button>

      <p>Session: {proctor.sessionId}</p>
      <p>Status: {proctor.active ? "ACTIVE" : "INACTIVE"}</p>
      
      {/* ✅ Proctor Overlay Mounted */}
      <ProctorOverlay active={proctor.active} />
    </div>
  );
};

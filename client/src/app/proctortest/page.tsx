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
      <h3>🎯 Event-Based Limiting System Tests</h3>

      <div style={{ marginBottom: "20px" }}>
        <h4>📵 Tab Switch (Max: 10 calls)</h4>
        <button onClick={() => proctor.reportEvent("TAB_SWITCH", true)}>
          Tab Switch ON
        </button>
        <button onClick={() => proctor.reportEvent("TAB_SWITCH", false)}>
          Tab Switch OFF
        </button>
        <small style={{ display: "block", color: "#666" }}>
          API calls stop after 10th occurrence
        </small>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <h4>👤 No Face (5s + 15s timing)</h4>
        <button onClick={() => proctor.reportEvent("NO_FACE", true)}>
          No Face START
        </button>
        <button onClick={() => proctor.reportEvent("NO_FACE", false)}>
          Face Returns
        </button>
        <small style={{ display: "block", color: "#666" }}>
          API call after 5s, then another at 15s if still active
        </small>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <h4>📱 Phone (2 calls max, then flagged)</h4>
        <button onClick={() => proctor.reportEvent("PHONE_DETECTED", true)}>
          Phone Detected
        </button>
        <button onClick={() => proctor.reportEvent("PHONE_DETECTED", false)}>
          Phone Gone
        </button>
        <small style={{ display: "block", color: "#666" }}>
          No API call on 1st detection, API calls on 2nd & 3rd, then flagged (no
          more calls)
        </small>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <h4>👥 Multiple Faces (Max: 1 call)</h4>
        <button onClick={() => proctor.reportEvent("MULTIPLE_FACES", true)}>
          Multiple Faces ON
        </button>
        <button onClick={() => proctor.reportEvent("MULTIPLE_FACES", false)}>
          Single Face
        </button>
        <small style={{ display: "block", color: "#666" }}>
          No API calls after 1st occurrence
        </small>
      </div>

      <hr />

      <p>Session: {proctor.sessionId}</p>
      <p>Status: {proctor.active ? "ACTIVE" : "INACTIVE"}</p>

      {/* ✅ Proctor Overlay Mounted */}
      <ProctorOverlay
        active={proctor.active}
        sessionId={proctor.sessionId}
        reportEvent={proctor.reportEvent}
        enrollIdentityFromVideo={proctor.enrollIdentityFromVideo}
        verifyIdentityFromVideo={proctor.verifyIdentityFromVideo}
        shouldRunIdentityVerification={proctor.shouldRunIdentityVerification}
      />
    </div>
  );
};

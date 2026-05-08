import { useEffect, useRef, useCallback } from "react";
import { useAssessment } from "@/contexts/AssessmentContext";
import { FullscreenGate } from "@/components/assessment/fullscreen-gate";
import { ProctorSetup } from "@/components/assessment/proctor-setup";
import { InstructionsScreen } from "@/components/assessment/instructions-screen";
import { AssessmentHeader } from "@/components/assessment/assessment-header";
import { AssessmentMain } from "@/components/assessment/assessment-main";
import ProctorOverlay from "@/components/proctor/ProctorOverlay";

export const AssessmentLayout = () => {
  const {
    isAssessmentLoading,
    isAssessmentLocked,
    assessmentLockReason,
    stage,
    setStage,
    startProctorSession,
    suspendProctorSession,
    proctorActive,
    proctorSessionId,
    reportEvent,
    enrollIdentityFromVideo,
    verifyIdentityFromVideo,
    shouldRunIdentityVerification,
  } = useAssessment();

  const stageRef = useRef(stage);
  useEffect(() => {
    stageRef.current = stage;
  }, [stage]);

  const handleViolation = useCallback(() => {
    if (stageRef.current === "fullscreen") return;
    setStage("fullscreen");
    suspendProctorSession();
  }, [setStage, suspendProctorSession]);

  useEffect(() => {
    // Fullscreen API exit — ESC key, F11, browser chrome buttons
    const onFullscreenChange = () => {
      if (!document.fullscreenElement) {
        handleViolation();
      }
    };

    // Visibility API — back button
    // tab switch, screen lock, notification shade pull-down
    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        handleViolation();
      }
    };

    // Window blur — Alt+Tab on desktop, clicking outside the browser
    // window, incoming call overlay on some platforms
    const onBlur = () => {
      handleViolation();
    };

    document.addEventListener("fullscreenchange", onFullscreenChange);
    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("blur", onBlur);

    return () => {
      document.removeEventListener("fullscreenchange", onFullscreenChange);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("blur", onBlur);
    };
  }, [handleViolation]);

  if (isAssessmentLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-neutral-950 text-neutral-300">
        Preparing assessment...
      </div>
    );
  }

  if (isAssessmentLocked) {
    return (
      <div className="flex h-screen items-center justify-center bg-neutral-950 px-6 text-center">
        <div className="max-w-lg rounded-2xl border border-neutral-800 bg-neutral-900 p-8">
          <p className="mb-3 text-sm uppercase tracking-[0.2em] text-orange-400">
            Assessment locked
          </p>
          <h1 className="mb-3 text-2xl font-semibold text-white">
            Access is no longer available
          </h1>
          <p className="text-sm leading-6 text-neutral-400">
            {assessmentLockReason ||
              "This assessment cannot be reopened from this device."}
          </p>
        </div>
      </div>
    );
  }

  const enterFullscreen = async () => {
    try {
      await document.documentElement.requestFullscreen();
      setStage("setup");
      startProctorSession();
    } catch (err) {
      console.error("Fullscreen failed:", err);
    }
  };

  return (
    <div className="relative flex flex-col h-screen w-full overflow-hidden bg-neutral-950">
      {stage === "fullscreen" && <FullscreenGate onEnter={enterFullscreen} />}

      {stage === "setup" && (
        <ProctorSetup onComplete={() => setStage("instructions")} />
      )}

      {stage === "instructions" && (
        <InstructionsScreen onStart={() => setStage("exam")} />
      )}

      <AssessmentHeader />
      <AssessmentMain />

      <ProctorOverlay
        active={proctorActive && stage === "exam"}
        sessionId={proctorSessionId}
        reportEvent={reportEvent}
        enrollIdentityFromVideo={enrollIdentityFromVideo}
        verifyIdentityFromVideo={verifyIdentityFromVideo}
        shouldRunIdentityVerification={shouldRunIdentityVerification}
      />
    </div>
  );
};

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
    stage,
    setStage,
    startProctorSession,
    endProctorSession,
    proctorActive,
    proctorSessionId,
    reportEvent,
    enrollIdentityFromVideo,
    verifyIdentityFromVideo,
    shouldRunIdentityVerification,
  } = useAssessment();

  const stageRef = useRef(stage);
  useEffect(() => { stageRef.current = stage; }, [stage]);

  const handleViolation = useCallback(() => {
    if (stageRef.current === "fullscreen") return;
    setStage("fullscreen");
    endProctorSession();
  }, [setStage, endProctorSession]);

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
      {stage === "fullscreen" && (
        <FullscreenGate onEnter={enterFullscreen} />
      )}

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
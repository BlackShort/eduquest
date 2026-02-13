import { useEffect, useRef, useState, useCallback } from "react";
import { sendProctorEvent, completeProctorSession } from "@/apis/proctor-api";
import type { ProctorEventType } from "@/types/proctor";

interface UseProctorOpts {
  examId: string;
}

export function useProctor({ examId }: UseProctorOpts) {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [active, setActive] = useState(false);
  const cooldownRef = useRef<Record<string, number>>({});

  function startSession() {
    const id = crypto.randomUUID();
    setSessionId(id);
    setActive(true);
  }

  const endSession = useCallback(async () => {
    if (!sessionId) return;
    await completeProctorSession(sessionId);
    setActive(false);
  }, [sessionId]);

  const reportEvent = useCallback(
    async (type: ProctorEventType, confidence = 1) => {
      if (!active || !sessionId) return;

      const now = Date.now();
      const cd = 5000;

      if (
        cooldownRef.current[type] &&
        now - cooldownRef.current[type] < cd
      ) return;

      cooldownRef.current[type] = now;

      await sendProctorEvent({
        examId,
        sessionId,
        eventType: type,
        confidence,
        metadata: {},
      });
    },
    [active, sessionId, examId]
  );

  /* tab switch detection */

  useEffect(() => {
    if (!active) return;

    const vis = () => {
      if (document.visibilityState === "hidden") {
        reportEvent("TAB_SWITCH");
      }
    };

    const blur = () => reportEvent("TAB_SWITCH");

    document.addEventListener("visibilitychange", vis);
    window.addEventListener("blur", blur);

    return () => {
      document.removeEventListener("visibilitychange", vis);
      window.removeEventListener("blur", blur);
    };
  }, [active, reportEvent]); // ✅ fixed deps

  return { sessionId, active, startSession, endSession, reportEvent };
}

import { useEffect, useRef, useState, useCallback } from "react";
import {
  completeProctorSession,
  enrollIdentity,
  sendProctorEvent,
  verifyIdentity,
} from "@/apis/proctor-api";
import {
  captureVideoFrameAsBase64,
  evaluateEnrollmentQuality,
  extractFaceEmbedding,
} from "@/proctor/proctor.engine";
import type { ProctorEventType } from "@/types/proctor";

interface UseProctorOpts {
  examId: string;
}

interface IdentityVerifyResult {
  matched: boolean;
  score: number;
  threshold: number;
}

// 🎯 Event-Based Limiting System
interface EventLimitTracker {
  count: number;
  firstDetectionTime?: number;
  lastApiCallTime?: number;
  flagged: boolean; // Stop generating API calls when flagged
}

// 📏 Event Limits Configuration
const EVENT_LIMITS = {
  TAB_SWITCH: { maxCount: 10, description: "Tab switches" },
  NO_FACE: { 
    firstCallDelay: 5000,    // 5s delay for first call
    secondCallDelay: 15000,  // 15s total for second check
    maxCalls: 2,
    description: "No face periods"
  },
  PHONE_DETECTED: { 
    minDetections: 2, 
    maxCount: 2, 
    description: "Phone detections (2 calls max)" 
  },
  MULTIPLE_FACES: { maxCount: 1, description: "Multiple face incidents" }
} as const;

export function useProctor({ examId }: UseProctorOpts) {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [active, setActive] = useState(false);
  const [identityEnrolled, setIdentityEnrolled] = useState(false);
  
  // 🎯 Event-Based Limiting System
  const currentViolations = useRef<Partial<Record<ProctorEventType, boolean>>>({});
  const eventTrackers = useRef<Partial<Record<ProctorEventType, EventLimitTracker>>>({});
  const noFaceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastIdentityVerifyAtRef = useRef<number | null>(null);
  const identityMismatchCountRef = useRef(0);
  const identityVerificationHaltedRef = useRef(false);
  
  // 🛡️ Initialize event tracker for a violation type
  const getOrCreateTracker = useCallback((type: ProctorEventType): EventLimitTracker => {
    if (!eventTrackers.current[type]) {
      eventTrackers.current[type] = {
        count: 0,
        flagged: false
      };
    }
    return eventTrackers.current[type]!;
  }, []);
  
  // 🚨 Check if event should trigger API call based on limits
  const shouldTriggerApiCall = useCallback((type: ProctorEventType, tracker: EventLimitTracker): boolean => {
    if (tracker.flagged) return false; // Already reached limit
    
    switch (type) {
      case "TAB_SWITCH":
        return tracker.count < EVENT_LIMITS.TAB_SWITCH.maxCount;
        
      case "PHONE_DETECTED":
        // Call API starting from 2nd detection, but stop after 2 total calls
        return tracker.count >= EVENT_LIMITS.PHONE_DETECTED.minDetections && 
               tracker.count <= EVENT_LIMITS.PHONE_DETECTED.maxCount;
        
      case "MULTIPLE_FACES":
        return tracker.count <= EVENT_LIMITS.MULTIPLE_FACES.maxCount;
        
      case "NO_FACE":
        // Special handling - managed by timer system
        return false;
        
      default:
        return false;
    }
  }, []);

  function startSession() {
    const id = crypto.randomUUID();
    setSessionId(id);
    setActive(true);
    
    // 🧹 Reset all event trackers for new session
    eventTrackers.current = {};
    currentViolations.current = {};
    lastIdentityVerifyAtRef.current = null;
    identityMismatchCountRef.current = 0;
    identityVerificationHaltedRef.current = false;
    setIdentityEnrolled(false);
  }

  const endSession = useCallback(async () => {
    if (!sessionId) return;
    
    // 🧹 Clear timers
    if (noFaceTimerRef.current) {
      clearTimeout(noFaceTimerRef.current);
    }
    
    await completeProctorSession(sessionId);
    setActive(false);
    
    // 🧹 Cleanup
    currentViolations.current = {};
    eventTrackers.current = {};
    lastIdentityVerifyAtRef.current = null;
    identityMismatchCountRef.current = 0;
    identityVerificationHaltedRef.current = false;
    setIdentityEnrolled(false);
  }, [sessionId]);

  const enrollIdentityFromVideo = useCallback(
    async (video: HTMLVideoElement): Promise<boolean> => {
      if (!active || !sessionId) return false;

      const baselineEmbedding = await extractFaceEmbedding(video);
      if (!baselineEmbedding) return false;

      const qualityChecks = await evaluateEnrollmentQuality(video);
      if (!qualityChecks.passed) return false;

      const baselineImageBase64 = captureVideoFrameAsBase64(video);

      await enrollIdentity({
        examId,
        sessionId,
        baselineEmbedding,
        baselineImageBase64,
        qualityChecks,
      });

      setIdentityEnrolled(true);
      lastIdentityVerifyAtRef.current = Date.now();
      return true;
    },
    [active, examId, sessionId]
  );

  const verifyIdentityFromVideo = useCallback(
    async (video: HTMLVideoElement): Promise<IdentityVerifyResult | null> => {
      if (
        !active ||
        !sessionId ||
        !identityEnrolled ||
        identityVerificationHaltedRef.current
      ) {
        return null;
      }

      const liveEmbedding = await extractFaceEmbedding(video);
      if (!liveEmbedding) return null;

      const liveImageBase64 = captureVideoFrameAsBase64(video, 0.8);

      const result = await verifyIdentity({
        examId,
        sessionId,
        liveEmbedding,
        confidence: 1,
        liveImageBase64,
      });

      lastIdentityVerifyAtRef.current = Date.now();

      if (!result.matched) {
        identityMismatchCountRef.current += 1;
        if (identityMismatchCountRef.current >= 2) {
          identityVerificationHaltedRef.current = true;
          console.log(
            "IDENTITY_MISMATCH limit reached (2). Halting further identity verify API calls for this session."
          );
        }
      }

      return {
        matched: result.matched,
        score: result.score,
        threshold: result.threshold,
      };
    },
    [active, examId, sessionId, identityEnrolled]
  );

  const shouldRunIdentityVerification = useCallback(
    (intervalMs = 5 * 60 * 1000): boolean => {
      if (
        !identityEnrolled ||
        !active ||
        identityVerificationHaltedRef.current
      ) {
        return false;
      }
      const last = lastIdentityVerifyAtRef.current;
      if (!last) return true;
      return Date.now() - last >= intervalMs;
    },
    [active, identityEnrolled]
  );

  // 🎯 Event-Based Limiting System - Smart violation processing
  const reportEvent = useCallback(
    async (type: ProctorEventType, isActive: boolean, confidence = 1) => {
      if (!active || !sessionId) return;

      const wasActive = currentViolations.current[type] || false;
      const tracker = getOrCreateTracker(type);
      
      // 🔄 State change detection
      if (isActive === wasActive) return; // No state change, skip
      
      currentViolations.current[type] = isActive;
      const now = Date.now();
      
      if (isActive) {
        // 🚨 Violation STARTED
        tracker.count++;
        console.log(`${type} violation #${tracker.count} detected`);
        
        if (type === "NO_FACE") {
          // 👤 Special NO_FACE handling with timed API calls
          if (!tracker.firstDetectionTime) {
            tracker.firstDetectionTime = now;
          }
          
          // Clear any existing timer
          if (noFaceTimerRef.current) {
            clearTimeout(noFaceTimerRef.current);
          }
          
          // Schedule first API call after 5 seconds
          noFaceTimerRef.current = setTimeout(async () => {
            if (currentViolations.current["NO_FACE"] && !tracker.flagged) {
              await sendProctorEvent({
                examId,
                sessionId,
                eventType: "NO_FACE",
                confidence,
                metadata: { 
                  callNumber: 1,
                  duration: Date.now() - (tracker.firstDetectionTime || now),
                  count: tracker.count 
                },
              });
              tracker.lastApiCallTime = Date.now();
              
              // Schedule second check after 15 seconds total
              noFaceTimerRef.current = setTimeout(async () => {
                if (currentViolations.current["NO_FACE"] && !tracker.flagged) {
                  await sendProctorEvent({
                    examId,
                    sessionId,
                    eventType: "NO_FACE",
                    confidence,
                    metadata: { 
                      callNumber: 2,
                      duration: Date.now() - (tracker.firstDetectionTime || now),
                      count: tracker.count,
                      final: true
                    },
                  });
                  tracker.flagged = true; // Stop further NO_FACE calls
                  console.log("NO_FACE: Reached maximum calls (2) - flagged");
                }
              }, EVENT_LIMITS.NO_FACE.secondCallDelay - EVENT_LIMITS.NO_FACE.firstCallDelay);
            }
          }, EVENT_LIMITS.NO_FACE.firstCallDelay);
          
        } else {
          // 🎯 Standard event limit processing
          if (shouldTriggerApiCall(type, tracker)) {
            await sendProctorEvent({
              examId,
              sessionId,
              eventType: type,
              confidence,
              metadata: {
                occurrenceCount: tracker.count,
                limitBased: true
              },
            });
            tracker.lastApiCallTime = now;
            
            // Check if we should flag this event type
            switch (type) {
              case "TAB_SWITCH":
                if (tracker.count >= EVENT_LIMITS.TAB_SWITCH.maxCount) {
                  tracker.flagged = true;
                  console.log("TAB_SWITCH: Reached maximum (10) - flagged");
                }
                break;
              case "PHONE_DETECTED":
                if (tracker.count >= EVENT_LIMITS.PHONE_DETECTED.maxCount) {
                  tracker.flagged = true;
                  console.log("PHONE_DETECTED: Reached maximum (2) - flagged");
                }
                break;
              case "MULTIPLE_FACES":
                if (tracker.count >= EVENT_LIMITS.MULTIPLE_FACES.maxCount) {
                  tracker.flagged = true;
                  console.log("MULTIPLE_FACES: Reached maximum (1) - flagged");
                }
                break;
            }
          } else {
            console.log(`${type}: Event logged but no API call (limit logic)`);
          }
        }
        
      } else {
        // ✅ Violation ENDED
        if (type === "NO_FACE") {
          // Clear timer when face returns
          if (noFaceTimerRef.current) {
            clearTimeout(noFaceTimerRef.current);
          }
          
          // Reset first detection time for next occurrence
          if (tracker.firstDetectionTime) {
            const wasDetected = Date.now() - tracker.firstDetectionTime;
            console.log(`NO_FACE ended after ${wasDetected}ms`);
            tracker.firstDetectionTime = undefined;
          }
        }
      }
    },
    [active, sessionId, examId, getOrCreateTracker, shouldTriggerApiCall]
  );
  
  /* 👁️ Tab switch detection */

  useEffect(() => {
    if (!active) return;

    const vis = () => {
      const isHidden = document.visibilityState === "hidden";
      reportEvent("TAB_SWITCH", isHidden);
    };

    const blur = () => reportEvent("TAB_SWITCH", true);
    const focus = () => reportEvent("TAB_SWITCH", false);

    document.addEventListener("visibilitychange", vis);
    window.addEventListener("blur", blur);
    window.addEventListener("focus", focus);

    return () => {
      document.removeEventListener("visibilitychange", vis);
      window.removeEventListener("blur", blur);
      window.removeEventListener("focus", focus);
    };
  }, [active, reportEvent]);

  return {
    sessionId,
    active,
    identityEnrolled,
    startSession,
    endSession,
    reportEvent,
    enrollIdentityFromVideo,
    verifyIdentityFromVideo,
    shouldRunIdentityVerification,
  };
}

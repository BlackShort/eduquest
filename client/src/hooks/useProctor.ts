import { useEffect, useRef, useState, useCallback } from "react";
import { sendProctorEvent, completeProctorSession } from "@/apis/proctor-api";
import type { ProctorEventType } from "@/types/proctor";

interface UseProctorOpts {
  examId: string;
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
  MULTIPLE_FACES: { maxCount: 1, description: "Multiple face incidents" },
  LIP_MOVEMENT_TALKING: { maxCount: 5, description: "Talking incidents" }
} as const;

export function useProctor({ examId }: UseProctorOpts) {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [active, setActive] = useState(false);
  
  // 🎯 Event-Based Limiting System
  const currentViolations = useRef<Partial<Record<ProctorEventType, boolean>>>({});
  const eventTrackers = useRef<Partial<Record<ProctorEventType, EventLimitTracker>>>({});
  const noFaceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
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
        
      case "LIP_MOVEMENT_TALKING":
        return tracker.count < EVENT_LIMITS.LIP_MOVEMENT_TALKING.maxCount;
        
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
  }, [sessionId]);

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
              case "LIP_MOVEMENT_TALKING":
                if (tracker.count >= EVENT_LIMITS.LIP_MOVEMENT_TALKING.maxCount) {
                  tracker.flagged = true;
                  console.log("LIP_MOVEMENT_TALKING: Reached maximum (5) - flagged");
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

  return { sessionId, active, startSession, endSession, reportEvent };
}

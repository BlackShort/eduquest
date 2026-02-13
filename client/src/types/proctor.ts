export type ProctorEventType =
  | "TAB_SWITCH"
  | "MULTIPLE_FACES"
  | "NO_FACE"
  | "PHONE_DETECTED"
  | "LIP_MOVEMENT_TALKING";

export interface ProctorEventPayload {
  examId: string;
  sessionId: string;
  eventType: ProctorEventType;
  confidence?: number;
  metadata?: Record<string, unknown>;
  timestamp?: string;
}

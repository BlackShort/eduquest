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

// 🎯 Enhanced event reporting for limiting system
export interface LimitBasedEventMetadata {
  // General event limiting
  occurrenceCount?: number;
  limitBased?: boolean;
  
  // NO_FACE specific
  callNumber?: number;
  duration?: number;
  count?: number;
  final?: boolean;
  
  // Legacy batching (kept for backward compatibility)
  immediate?: boolean;
  batchedEvent?: boolean;
}

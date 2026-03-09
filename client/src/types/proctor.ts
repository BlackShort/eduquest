export type ProctorEventType =
  | "TAB_SWITCH"
  | "MULTIPLE_FACES"
  | "NO_FACE"
  | "PHONE_DETECTED"
  | "IDENTITY_MISMATCH";

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

export interface IdentityQualityChecks {
  passed: boolean;
  singleFace: boolean;
  brightnessOk: boolean;
  blurOk: boolean;
  brightnessScore: number;
  blurScore: number;
}

export interface EnrollIdentityPayload {
  examId: string;
  sessionId: string;
  baselineEmbedding: number[];
  baselineImageBase64?: string;
  baselineImageS3Key?: string;
  thresholdUsed?: number;
  qualityChecks: IdentityQualityChecks;
}

export interface VerifyIdentityPayload {
  examId: string;
  sessionId: string;
  liveEmbedding: number[];
  confidence?: number;
  liveImageBase64?: string;
  liveImageS3Key?: string;
}

export interface VerifyIdentityResponse {
  matched: boolean;
  score: number;
  threshold: number;
  eventCreated: boolean;
  mismatchEventId: string | null;
}

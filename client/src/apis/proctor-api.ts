import { proctorUrl as server } from "./server-api";
import type {
  EnrollIdentityPayload,
  ProctorEventPayload,
  VerifyIdentityPayload,
  VerifyIdentityResponse,
} from "@/types/proctor";

const BASE = `${server}/v1`;

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem("accessToken");

  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

export async function sendProctorEvent(payload: ProctorEventPayload) {
  const res = await fetch(`${BASE}/events`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw await res.json();
  return res.json();
}

export async function completeProctorSession(sessionId: string) {
  const res = await fetch(`${BASE}/sessions/${sessionId}/complete`, {
    method: "POST",
    headers: getAuthHeaders(),
  });

  if (!res.ok) throw await res.json();
  return res.json();
}

export async function enrollIdentity(payload: EnrollIdentityPayload) {
  const res = await fetch(
    `${BASE}/sessions/${payload.sessionId}/identity/enroll`,
    {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        examId: payload.examId,
        baselineEmbedding: payload.baselineEmbedding,
        baselineImageBase64: payload.baselineImageBase64,
        baselineImageS3Key: payload.baselineImageS3Key,
        thresholdUsed: payload.thresholdUsed,
        qualityChecks: payload.qualityChecks,
      }),
    }
  );

  if (!res.ok) throw await res.json();
  return res.json();
}

export async function verifyIdentity(
  payload: VerifyIdentityPayload
): Promise<VerifyIdentityResponse> {
  const res = await fetch(
    `${BASE}/sessions/${payload.sessionId}/identity/verify`,
    {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({
        examId: payload.examId,
        liveEmbedding: payload.liveEmbedding,
        confidence: payload.confidence,
        liveImageBase64: payload.liveImageBase64,
        liveImageS3Key: payload.liveImageS3Key,
      }),
    }
  );

  if (!res.ok) throw await res.json();
  return res.json();
}

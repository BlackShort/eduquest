import { proctorUrl as server } from "./server-api";
import type { ProctorEventPayload } from "@/types/proctor";

const BASE = `${server}/api/v1/proctor`;

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

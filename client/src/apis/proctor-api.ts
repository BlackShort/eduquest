import { createApi } from "@/apis/api-client";
import { proctorUrl } from "@/apis/server-api"; 
import type {
  EnrollIdentityPayload,
  ProctorEventPayload,
  VerifyIdentityPayload,
  VerifyIdentityResponse,
} from "@/types/proctor";

const proctorApi = createApi(`${proctorUrl}/v1`);

export const sendProctorEvent = async (payload: ProctorEventPayload) => {
  const { data } = await proctorApi.post("/events", payload);
  return data;
};

export const completeProctorSession = async (sessionId: string) => {
  const { data } = await proctorApi.post(`/sessions/${sessionId}/complete`);
  return data;
};

export const enrollIdentity = async (payload: EnrollIdentityPayload) => {
  const { data } = await proctorApi.post(
    `/sessions/${payload.sessionId}/identity/enroll`,
    payload
  );
  return data;
};

export const verifyIdentity = async (
  payload: VerifyIdentityPayload
): Promise<VerifyIdentityResponse> => {
  const { data } = await proctorApi.post(
    `/sessions/${payload.sessionId}/identity/verify`,
    payload
  );
  return data;
};
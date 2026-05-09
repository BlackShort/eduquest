import { createApi } from "@/apis/api-client";
import { proctorUrl } from "@/apis/server-api";
import type {
  EnrollIdentityPayload,
  ProctorEventPayload,
  VerifyIdentityPayload,
  VerifyIdentityResponse,
} from "@/types/proctor";

const proctorApi = createApi(`${proctorUrl}/v1`);

proctorApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export const sendProctorEvent = async (payload: ProctorEventPayload) => {
  const { data } = await proctorApi.post("/events", payload);
  return data;
};

export const completeProctorSession = async (
  sessionId: string,
  examId: string,
) => {
  const { data } = await proctorApi.post(`/sessions/${sessionId}/complete`, {
    examId,
  });
  return data;
};

export const enrollIdentity = async (payload: EnrollIdentityPayload) => {
  const { data } = await proctorApi.post(
    `/sessions/${payload.sessionId}/identity/enroll`,
    payload,
  );
  return data;
};

export const verifyIdentity = async (
  payload: VerifyIdentityPayload,
): Promise<VerifyIdentityResponse> => {
  const { data } = await proctorApi.post(
    `/sessions/${payload.sessionId}/identity/verify`,
    payload,
  );
  return data;
};

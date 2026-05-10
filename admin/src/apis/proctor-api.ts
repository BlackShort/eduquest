import { proctorUrl } from "./server-api";
import { createApi } from "./api-client";

const proctorApi = createApi(`${proctorUrl}/v1`);

export const getStudentExamSessions = async (
  studentId: string,
  examId: string,
) => {
  const response = await proctorApi.get(
    `/students/${studentId}/exams/${examId}`,
  );
  return response.data;
};

export const getSession = async (sessionId: string) => {
  const response = await proctorApi.get(`/sessions/${sessionId}`);
  return response.data;
};

// sessionId: session.sessionId (string) and examId required by backend
export const getEnrollmentImageUrl = async (
  sessionId: string,
  examId: string,
) => {
  const response = await proctorApi.get(
    `/sessions/${sessionId}/identity/enroll-image-url`,
    {
      params: { examId },
    },
  );
  return response.data;
};

export default proctorApi;

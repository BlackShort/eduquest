import { createApi } from "./api-client";
import { contentUrl } from "@/apis/server-api";

const api = createApi(contentUrl);

export const getAllTests = async () => {
  return api.get("/v1/faculty/tests/public");
};

export const getTestById = async (id: string) => {
  return api.get(`/v1/faculty/tests/public/${id}`);
};

export const submitAssignment = async (testId: string, formData: FormData) => {
  return api.post(`/v1/faculty/submissions/assignment/${testId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getMyAssignmentAttempt = async (testId: string) => {
  return api.get(`/v1/faculty/submissions/assignment/${testId}/my-attempt`);
};

export const submitAssessment = async (
  testId: string,
  payload: {
    answers: Record<string, string>;
    timeSpentMinutes: number;
    codingResults?: Array<{
      questionId: string;
      submissionId: string | null;
      passedTestcases: number;
      totalTestcases: number;
      verdict: string;
    }>;
  }
) => {
  return api.post(`/v1/faculty/submissions/assessment/${testId}`, payload);
};

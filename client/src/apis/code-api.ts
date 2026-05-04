import { createApi } from "@/apis/api-client";
// import { codeUrl } from "@/apis/server-api";
import type { Testcase } from "@/types/types";
import { contentUrl } from "@/apis/server-api";

const api = createApi(contentUrl);

export const codeSubmission = async (
    env_type: string,
    testId: string | null,
    code: string,
    language: string,
    testCase: Testcase[],
    mode: string,
    questionId: string
) => {
    const { data } = await api.post("/v1/submissions/execute", {
        env_type,
        testId,
        code,
        language,
        testCase,
        mode,
        questionId,
    });

    return data;
};

export const getCodingByIds = async (ids: string[]) => {
  const { data } = await api.post("/v1/coding/bulk", { ids });
  return data;
};

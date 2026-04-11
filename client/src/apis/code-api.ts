import { createApi } from "@/apis/api-client";
import { codeUrl } from "@/apis/server-api";
import type { Testcase } from "@/types/types";

const codeApi = createApi(codeUrl);

export const codeSubmission = async (
    code: string,
    language: string,
    testCase: Testcase[],
    mode: string,
    problemId: string
) => {
    const { data } = await codeApi.post("/v1/submissions/execute", {
        code,
        language,
        testCase,
        mode,
        questionId: problemId,
    });

    return data;
};
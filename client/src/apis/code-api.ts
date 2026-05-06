import { createApi } from "@/apis/api-client";
import type { Testcase } from "@/types/types";
import { codeUrl } from "@/apis/server-api";

const api = createApi(codeUrl);

export const codeSubmission = async (
    env_type: string,
    testId: string | null,
    code: string,
    language: string,
    testCase: Testcase[],
    mode: string,
    questionId: string,
    studentId?: string | number
) => {
    // Debug logging
    console.log("BEFORE API CALL - codeSubmission params:", {
        env_type,
        testId,
        questionId,
        studentId,
        language,
        codeLength: code.length,
        mode,
        testCaseCount: testCase.length,
    });

    const config: any = { headers: {} };

    if (studentId) {
        config.headers["x-student-id"] = String(studentId);
    }

    console.log("API CONFIG:", config);
    console.log("Calling URL:", `${codeUrl}/v1/submissions/execute`);

    try {
        const { data } = await api.post("/v1/submissions/execute", {
            env_type,
            testId,
            code,
            language,
            testCase,
            mode,
            questionId,
        }, config);

        console.log("API RESPONSE:", data);
        return data;
    } catch (error: any) {
        console.error("NETWORK ERROR DETAILS:", {
            message: error.message,
            status: error.response?.status,
            statusText: error.response?.statusText,
            responseData: error.response?.data,
            url: error.config?.url,
            headers: error.config?.headers,
            error: error,
        });
        throw error;
    }
};

export const getCodingByIds = async (ids: string[]) => {
    const { data } = await api.post("/v1/coding/bulk", { ids });
    return data;
};

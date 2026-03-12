import type { Testcase } from "@/types/types";
import axios from "axios";
const API_URL = 'http://localhost:5003';

// Create axios instance with default config
const codeApi = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

// `testCases` represents an array of simple input/output pairs that will be
// sent to the backend for execution.  Use the `Testcase` interface (lower‑case
// “c”), which matches what the front end components already consume.
export const codeSubmission = async (
    code: string,
    language: string,
    testCase: Testcase[],
    mode: string,
    problemId : string
) => {
    const response = await codeApi.post('/v1/submissions/execute', {
        code,
        language,
        // backend currently expects property named `testCase`, so map accordingly
        testCase,
        mode,
        questionId: problemId,
        studentId: "jaskdlieriwr"
    });
    return response;
}
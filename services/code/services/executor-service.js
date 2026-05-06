import axios from 'axios';
import { JUDGE0_BASE_URL, JUDGE0_LANGUAGE_IDS } from '../configs/judge0-config.js';

// How long to wait for Judge0 to finish processing (ms)
const POLLING_INTERVAL_MS = 3000;
const MAX_POLLS = 15;

/**
 * Submit code to Judge0 and return a token.
 */
async function submitToJudge0({ languageId, code, stdin }) {
    const payload = {
        language_id: languageId,
        source_code: Buffer.from(code).toString('base64'),
        stdin: stdin ? Buffer.from(stdin).toString('base64') : '',
    };

    try {
        const response = await axios.post(
            `${JUDGE0_BASE_URL}/submissions?base64_encoded=true&wait=false`,
            payload,
            { timeout: 10000 }
        );

        return response.data.token;
    } catch (err) {
        console.error("❌ FULL ERROR:", {
            message: err.message,
            code: err.code,
            response: err.response?.data,
        });
        throw err;
    }
}

/**
 * Poll Judge0 until execution completes
 */
async function pollJudge0(token) {
    for (let attempt = 0; attempt < MAX_POLLS; attempt++) {
        await new Promise((resolve) => setTimeout(resolve, POLLING_INTERVAL_MS));

        try {
            const response = await axios.get(
                `${JUDGE0_BASE_URL}/submissions/${token}?base64_encoded=true`,
                { timeout: 10000 }
            );

            const data = response.data;
            const statusId = data.status?.id;

            if (statusId === 1 || statusId === 2) continue;

            const stdout = data.stdout
                ? Buffer.from(data.stdout, 'base64').toString('utf-8')
                : '';

            const stderr = data.stderr
                ? Buffer.from(data.stderr, 'base64').toString('utf-8')
                : '';

            const compileOutput = data.compile_output
                ? Buffer.from(data.compile_output, 'base64').toString('utf-8')
                : '';

            return {
                statusId,
                statusDescription: data.status?.description || '',
                stdout,
                stderr,
                compileOutput,
                timeMs: data.time ? Math.round(parseFloat(data.time) * 1000) : 0,
                memoryKb: data.memory || 0,
            };
        } catch (err) {
            console.error("❌ Polling error:", err.response?.data || err.message);
            throw err;
        }
    }

    return {
        statusId: 5,
        statusDescription: 'Time Limit Exceeded (polling timeout)',
        stdout: '',
        stderr: 'Execution timed out',
        compileOutput: '',
        timeMs: MAX_POLLS * POLLING_INTERVAL_MS,
        memoryKb: 0,
    };
}

/**
 * Map Judge0 status
 */
function mapJudge0Status(statusId) {
    if (statusId === 3) return 'PASSED';
    if (statusId === 4) return 'FAILED';
    if (statusId === 5) return 'TIME_LIMIT';
    if (statusId === 6) return 'COMPILE_ERROR';
    if (statusId >= 7 && statusId <= 12) return 'RUNTIME_ERROR';
    return 'RUNTIME_ERROR';
}

/**
 * Execute single testcase
 */
async function executeWithJudge0({ language, code, stdin }) {
    const languageId = JUDGE0_LANGUAGE_IDS[language];

    if (!languageId) {
        throw new Error(`Language not supported: ${language}`);
    }

    try {
        const token = await submitToJudge0({ languageId, code, stdin });
        const result = await pollJudge0(token);

        console.log("🧪 Judge0 Result:", result);

        const status = mapJudge0Status(result.statusId);

        return {
            stdout: result.stdout || '',
            stderr: result.stderr || result.compileOutput || '',
            timeMs: result.timeMs || 0,
            status,
        };
    } catch (err) {
        console.error('❌ Judge0 execution error:', err.response?.data || err.message);

        return {
            stdout: '',
            stderr: err.response?.data || err.message,
            timeMs: 0,
            status: 'RUNTIME_ERROR',
        };
    }
}

/**
 * Compare outputs
 */
function outputsMatch(actual, expected) {
    if (actual == null || expected == null) return false;
    return actual.trim() === expected.trim();
}

/**
 * Run all testcases
 */
export async function runCodeForQuestion({ code, language, testcases }) {
    if (!Array.isArray(testcases) || testcases.length === 0) {
        return {
            totalTestcases: 0,
            passedTestcases: 0,
            verdict: "PENDING",
            overallTimeMs: 0,
            testcaseResults: [],
        };
    }

    try {
        const testcasePromises = testcases.map(async (tc) => {
            const stdin = tc.input || "";
            const expectedOutput = tc.output || "";
            const testcaseId = tc._id ? tc._id.toString() : null;

            try {
                const result = await executeWithJudge0({
                    language,
                    code,
                    stdin,
                });

                let status = result.status;

                if (status === "PASSED" && !outputsMatch(result.stdout, expectedOutput)) {
                    status = "FAILED";
                }

                return {
                    testcaseId,
                    status,
                    input: stdin,
                    expectedOutput,
                    actualOutput: result.stdout,
                    errorMessage: result.stderr,
                    timeTakenMs: result.timeMs,
                };
            } catch (err) {
                console.error("❌ Testcase error:", err);

                return {
                    testcaseId,
                    status: "RUNTIME_ERROR",
                    input: stdin,
                    expectedOutput,
                    actualOutput: "",
                    errorMessage: err.message,
                    timeTakenMs: 0,
                };
            }
        });

        const testcaseResults = await Promise.all(testcasePromises);

        let passedCount = 0;
        let totalTime = 0;

        for (const result of testcaseResults) {
            if (result.status === "PASSED") passedCount++;
            totalTime += result.timeTakenMs;
        }

        const totalTestcases = testcaseResults.length;

        let verdict = "WRONG_ANSWER";
        if (passedCount === totalTestcases && totalTestcases > 0) {
            verdict = "ACCEPTED";
        } else if (passedCount > 0) {
            verdict = "PARTIALLY_CORRECT";
        }

        return {
            totalTestcases,
            passedTestcases: passedCount,
            verdict,
            overallTimeMs: totalTime,
            testcaseResults,
        };
    } catch (err) {
        console.error("❌ runCodeForQuestion error:", err);

        return {
            totalTestcases: 0,
            passedTestcases: 0,
            verdict: "RUNTIME_ERROR",
            overallTimeMs: 0,
            testcaseResults: [],
        };
    }
}
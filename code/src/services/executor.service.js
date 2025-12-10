
const axios = require('axios');
const { PISTON_BASE_URL } = require('../config/piston.config');

const languageMap = {
    cpp: {
        language: 'cpp',
        version: '10.2.0', 
        filename: 'main.cpp',
    },
    c: {
        language: 'c',
        version: '10.2.0',
        filename: 'main.c',
    },
    python: {
        language: 'python',
        version: '3.10.0',
        filename: 'main.py',
    },
    java: {
        language: 'java',
        version: '15.0.2',
        filename: 'Main.java',
    },
    javascript: {
        language: 'javascript',
        version: '18.15.0',
        filename: 'main.js',
    },
};

async function executeWithPiston({ language, code, stdin }) {
    const langConfig = languageMap[language];

    if (!langConfig) {
        throw new Error(`Language not supported for execution: ${language}`);
    }

    const payload = {
        language: langConfig.language,
        version: langConfig.version,
        files: [
            {
                name: langConfig.filename,
                content: code,
            },
        ],
        stdin,
    };

    try {
        const start = Date.now();

        const response = await axios.post(
            `${PISTON_BASE_URL}/execute`,
            payload,
            {
                timeout: 15000, // 15 seconds per testcase
            }
        );

        const end = Date.now();
        const timeMs = end - start;

        const run = response.data.run || {};

        const stdout = (run.stdout || '').toString();
        const stderr = (run.stderr || '').toString();
        const exitCode = typeof run.code === 'number' ? run.code : null;

        let status = 'PASSED';

        if (exitCode !== 0) {
            status = 'RUNTIME_ERROR';
        }

        if (stderr && stderr.trim().length > 0) {
            status = 'RUNTIME_ERROR';
        }

        return {
            stdout,
            stderr,
            exitCode,
            timeMs,
            status,
        };
    } catch (err) {
        console.error('Error calling Piston:', err.message);
        return {
            stdout: '',
            stderr: err.message,
            exitCode: null,
            timeMs: 0,
            status: 'ERROR',
        };
    }
}


function outputsMatch(actual, expected) {
    if (actual == null || expected == null) return false;
    return actual.trim() === expected.trim();
}

async function runCodeForQuestion({ code, language, testcases }) {
    if (!Array.isArray(testcases) || testcases.length === 0) {
        return {
            totalTestcases: 0,
            passedTestcases: 0,
            verdict: 'PENDING',
            overallTimeMs: 0,
            testcaseResults: [],
        };
    }

    const testcaseResults = [];
    let totalTime = 0;
    let passedCount = 0;

    
    for (const tc of testcases) {
        const stdin = tc.input || '';
        const expectedOutput = tc.expectedOutput || '';
        const testcaseId = tc._id ? tc._id.toString() : null;

        const result = await executeWithPiston({
            language,
            code,
            stdin,
        });

        const isCorrect =
            result.status === 'PASSED' &&
            outputsMatch(result.stdout, expectedOutput);

        let status = result.status;

        if (status === 'PASSED' && !isCorrect) {
            status = 'FAILED'; 
        }

        if (status === 'PASSED' && isCorrect) {
            passedCount++;
        }

        totalTime += result.timeMs || 0;

        testcaseResults.push({
            testcaseId,
            status,
            input: stdin,
            expectedOutput,
            actualOutput: result.stdout,
            errorMessage: result.stderr,
            timeTakenMs: result.timeMs,
        });
    }

    const totalTestcases = testcaseResults.length;

    let verdict = 'WRONG_ANSWER';
    if (passedCount === totalTestcases && totalTestcases > 0) {
        verdict = 'ACCEPTED';
    } else if (passedCount > 0) {
        verdict = 'PARTIALLY_CORRECT';
    } else if (totalTestcases === 0) {
        verdict = 'PENDING';
    }

    return {
        totalTestcases,
        passedTestcases: passedCount,
        verdict,
        overallTimeMs: totalTime,
        testcaseResults,
    };
}

module.exports = {
    runCodeForQuestion,
};

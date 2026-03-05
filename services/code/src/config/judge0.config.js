const JUDGE0_BASE_URL =
    process.env.JUDGE0_BASE_URL || 'http://localhost:2358';

// Judge0 language IDs — add more as needed
// Full list: https://ce.judge0.com/languages
const JUDGE0_LANGUAGE_IDS = {
    c:          50,
    cpp:        54,   // C++ (GCC 9.2.0)
    java:       62,   // Java (OpenJDK 13.0.1)
    python:     71,   // Python (3.8.1)
    javascript: 63,   // JavaScript (Node.js 12.14.0)
};

export {
    JUDGE0_BASE_URL,
    JUDGE0_LANGUAGE_IDS,
};

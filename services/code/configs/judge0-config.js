const JUDGE0_BASE_URL = process.env.JUDGE0_BASE_URL || 'http://localhost:2358';

// Judge0 language IDs
const JUDGE0_LANGUAGE_IDS = {
    c: 50,
    cpp: 54,
    java: 62,
    python: 71,
    javascript: 63,
};

export {
    JUDGE0_BASE_URL,
    JUDGE0_LANGUAGE_IDS,
};

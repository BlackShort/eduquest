const Submission = require('../models/submission.model');

function normalizeCode(rawCode = '') {
    let code = rawCode;

    if (!code || typeof code !== 'string') return '';

    code = code.replace(/\/\/.*$/gm, '');

    code = code.replace(/\/\*[\s\S]*?\*\//gm, '');

    code = code.replace(/#.*$/gm, '');

    code = code
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line.length > 0)
        .join('\n');

    code = code.replace(/\s+/g, ' ');

    return code;
}


function tokenize(code) {
    if (!code) return [];

        const tokenRegex =
            /[a-zA-Z_][a-zA-Z0-9_]*|[0-9]+|==|!=|<=|>=|&&|\|\||[+\-*\/%<>=!&|^]/g;

        const tokens = code.match(tokenRegex) || [];
        return tokens;
    }  

function makeNGrams(tokens, k = 5) {
    const ngrams = [];
    if (!tokens || tokens.length < k) return ngrams;

    for (let i = 0; i <= tokens.length - k; i++) {
        const gram = tokens.slice(i, i + k).join(' ');
        ngrams.push(gram);
    }
    return ngrams;
}

/**
 * STEP 4: Jaccard similarity between two n-gram sets
 * J(A, B) = |A ∩ B| / |A ∪ B|
 */
function jaccardSimilarity(ngramsA, ngramsB) {
    const setA = new Set(ngramsA);
    const setB = new Set(ngramsB);

    if (setA.size === 0 && setB.size === 0) return 0;

    let intersection = 0;
    for (const item of setA) {
        if (setB.has(item)) intersection++;
    }

    const union = setA.size + setB.size - intersection;
    if (union === 0) return 0;

    return intersection / union; // 0..1
}


async function checkSubmissionPlagiarism(currentSubmission, options = {}) {
    const {
        questionId,
        language,
        _id: currentId,
        code: currentCode,
    } = currentSubmission;

    const {
        maxComparisons = 100,
        ngramSize = 5,
        suspiciousThreshold = 70
    } = options;      
    const otherSubmissions = await Submission.find({
        questionId,
        language,
        _id: { $ne: currentId },
    })
        .sort({ createdAt: -1 }) 
        .limit(maxComparisons)
        .select('_id code');

    if (!otherSubmissions.length) {
        return {
            checked: true,
            maxSimilarity: 0,
            similarSubmissions: [],
        };
    }

    const normCurrent = normalizeCode(currentCode);
    const tokensCurrent = tokenize(normCurrent);

    if (!tokensCurrent.length) {
        return {
            checked: true,
            maxSimilarity: 0,
            similarSubmissions: [],
        };
    }

    let maxSimilarity = 0;
    const similarSubmissions = [];

    for (const other of otherSubmissions) {
        const normOther = normalizeCode(other.code);
        const tokensOther = tokenize(normOther);

        if (!tokensOther.length) continue;

        // Jaccard over tokens instead of n-grams
        const sim = jaccardSimilarity(tokensCurrent, tokensOther) * 100; // to %
        const similarity = Math.round(sim * 100) / 100; // round to 2 decimals

        if (similarity > maxSimilarity) {
            maxSimilarity = similarity;
        }

        if (similarity >= suspiciousThreshold) {
            similarSubmissions.push({
                submissionId: other._id,
                similarity,
            });
        }
    }

    return {
        checked: true,
        maxSimilarity: Math.round(maxSimilarity * 100) / 100,
        similarSubmissions,
    };
}

module.exports = {
    checkSubmissionPlagiarism,
};

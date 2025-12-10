const mongoose = require('mongoose');

const TestcaseResultSchema = new mongoose.Schema(
    {
        testcaseId: {
            type: mongoose.Schema.Types.ObjectId,
            required: false, 
        },
        status: {
            type: String,
            enum: ['PASSED', 'FAILED', 'RUNTIME_ERROR', 'COMPILE_ERROR', 'TIME_LIMIT'],
            required: true,
        },
        input: {
            type: String,
        },
        expectedOutput: {
            type: String,
        },
        actualOutput: {
            type: String,
        },
        errorMessage: {
            type: String,
        },
        timeTakenMs: {
            type: Number,
        },
    },
    { _id: false }
);

const PlagiarismInfoSchema = new mongoose.Schema(
    {
        checked: {
            type: Boolean,
            default: false,
        },
        maxSimilarity: {
            type: Number, // 0–100
            default: 0,
        },
        similarSubmissions: [
            {
                submissionId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Submission',
                },
                similarity: {
                    type: Number,
                },
            },
        ],
    },
    { _id: false }
);

const SubmissionSchema = new mongoose.Schema(
    {   
        testId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        questionId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        language: {
            type: String,
            required: true,
            enum: ['cpp', 'java', 'python', 'c', 'javascript'],
        },
        code: {
            type: String,
            required: true,
        },
        mode: {
            type: String,
            enum: ['run', 'submit'],
            required: true,
        },

        totalTestcases: {
            type: Number,
            default: 0,
        },
        passedTestcases: {
            type: Number,
            default: 0,
        },
        verdict: {
            type: String,
            enum: ['ACCEPTED', 'PARTIALLY_CORRECT', 'WRONG_ANSWER', 'ERROR', 'PENDING'],
            default: 'PENDING',
        },
        overallTimeMs: {
            type: Number,
            default: 0,
        },

        testcaseResults: [TestcaseResultSchema],

        plagiarism: {
            type: PlagiarismInfoSchema,
            default: () => ({}),
        },
    },
    {
        timestamps: true, 
    }
);

SubmissionSchema.index({ studentId: 1, questionId: 1 });
SubmissionSchema.index({ questionId: 1 });
SubmissionSchema.index({ createdAt: -1 });

const Submission = mongoose.model('Submission', SubmissionSchema);

module.exports = Submission;

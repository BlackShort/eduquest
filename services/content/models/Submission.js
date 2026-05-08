import mongoose from 'mongoose';

const testcaseResultSchema = new mongoose.Schema(
    {
        status: String,
        input: String,
        expectedOutput: String,
        actualOutput: String,
        errorMessage: String,
        timeTakenMs: Number
    },
    { _id: false }
);

const submissionSchema = new mongoose.Schema(
    {
        env_type: String,
        testId: mongoose.Schema.Types.ObjectId,
        studentId: String,
        questionId: String,
        language: String,
        code: String,
        mode: String,
        totalTestcases: Number,
        passedTestcases: Number,
        verdict: String,
        overallTimeMs: Number,
        testcaseResults: [testcaseResultSchema]
    },
    {
        timestamps: true,
        collection: 'submissions'
    }
);

submissionSchema.index({ testId: 1, studentId: 1, questionId: 1, mode: 1, createdAt: -1 });

const Submission = mongoose.models.Submission || mongoose.model('Submission', submissionSchema);

export default Submission;

import mongoose from 'mongoose';

const studentAttemptSchema = new mongoose.Schema({
    testId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Test',
        required: [true, 'Test ID is required']
    },
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Student ID is required']
    },
    studentName: {
        type: String,
        default: ''
    },
    studentEmail: {
        type: String,
        default: ''
    },
    startedAt: {
        type: Date,
        default: Date.now
    },
    submittedAt: {
        type: Date,
        default: null
    },
    status: {
        type: String,
        enum: {
            values: ['in_progress', 'submitted', 'graded'],
            message: '{VALUE} is not a valid status'
        },
        default: 'in_progress'
    },
    responses: {
        mcqResponses: [{
            questionId: {
                type: String,
                required: true
            },
            selectedAnswer: {
                type: String,
                default: null
            },
            isCorrect: {
                type: Boolean,
                default: null
            },
            marksObtained: {
                type: Number,
                default: 0
            },
            maxMarks: {
                type: Number,
                default: 0
            }
        }],
        codingSubmissionIds: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Submission'
        }],
        codingResponses: [{
            questionId: {
                type: String,
                required: true
            },
            submissionId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Submission',
                default: null
            },
            passedTestcases: {
                type: Number,
                default: 0
            },
            totalTestcases: {
                type: Number,
                default: 0
            },
            marksObtained: {
                type: Number,
                default: 0
            },
            maxMarks: {
                type: Number,
                default: 0
            },
            verdict: {
                type: String,
                default: 'NOT_SUBMITTED'
            }
        }],
        assignmentFileUrl: {
            type: String,
            default: null
        }
    },
    score: {
        obtained: {
            type: Number,
            default: 0,
            min: 0
        },
        total: {
            type: Number,
            default: 0,
            min: 0
        },
        percentage: {
            type: Number,
            default: 0,
            min: 0,
            max: 100
        }
    },
    scoreBreakdown: {
        mcq: {
            obtained: { type: Number, default: 0 },
            total: { type: Number, default: 0 }
        },
        coding: {
            obtained: { type: Number, default: 0 },
            total: { type: Number, default: 0 }
        },
        assignment: {
            obtained: { type: Number, default: 0 },
            total: { type: Number, default: 0 }
        }
    },
    gradedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    gradedAt: {
        type: Date,
        default: null
    },
    feedback: {
        type: String,
        default: '',
        maxLength: [5000, 'Feedback cannot exceed 5000 characters']
    },
    timeSpentMinutes: {
        type: Number,
        default: 0
    },
    ipAddress: {
        type: String,
        default: null
    },
    userAgent: {
        type: String,
        default: null
    }
}, {
    timestamps: true,
    collection: 'student_attempts'
});

// Calculate percentage before saving
studentAttemptSchema.pre('save', function() {
    if (this.score.total > 0) {
        this.score.percentage = (this.score.obtained / this.score.total) * 100;
    }
});

// Indexes for better query performance
studentAttemptSchema.index({ testId: 1, studentId: 1 });
studentAttemptSchema.index({ studentId: 1, status: 1 });
studentAttemptSchema.index({ testId: 1, status: 1 });
studentAttemptSchema.index({ submittedAt: 1 });

const StudentAttempt = mongoose.model('StudentAttempt', studentAttemptSchema);

export default StudentAttempt;

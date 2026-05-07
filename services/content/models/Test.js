import mongoose from 'mongoose';

const customMcqQuestionSchema = new mongoose.Schema({
    question_id: { type: String, required: true },
    question_text: { type: String, required: true },
    options: [{ type: String, required: true }],
    correct_answer: { type: String, required: true },
    marks: { type: Number, default: 1 },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        default: 'medium'
    },
    tags: [{ type: String }],
    explanation: { type: String, default: '' }
}, { _id: false });

const customCodingTestCaseSchema = new mongoose.Schema({
    input: { type: String, required: true },
    output: { type: String, required: true },
    isHidden: { type: Boolean, default: false }
}, { _id: false });

const customCodingQuestionSchema = new mongoose.Schema({
    question_id: { type: String, required: true },
    question_text: { type: String, required: true },
    marks: { type: Number, default: 10 },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        default: 'medium'
    },
    tags: [{ type: String }],
    timeLimit: { type: Number, default: 1 },
    memoryLimit: { type: Number, default: 256 },
    constraints: { type: String, default: '' },
    inputFormat: { type: String, default: '' },
    outputFormat: { type: String, default: '' },
    sampleInput: { type: String, default: '' },
    sampleOutput: { type: String, default: '' },
    test_cases: {
        type: [customCodingTestCaseSchema],
        default: []
    }
}, { _id: false });

const customAssignmentQuestionSchema = new mongoose.Schema({
    question_id: { type: String, required: true },
    question_text: { type: String, required: true },
    marks: { type: Number, default: 5 },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        default: 'medium'
    },
    tags: [{ type: String }],
    wordLimit: { type: Number, default: null },
    attachmentRequired: { type: Boolean, default: false }
}, { _id: false });

const testSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Test title is required'],
        trim: true,
        maxLength: [200, 'Title cannot exceed 200 characters']
    },
    description: {
        type: String,
        trim: true,
        maxLength: [1000, 'Description cannot exceed 1000 characters']
    },
    type: {
        type: String,
        required: [true, 'Test type is required'],
        enum: {
            values: ['assessment', 'assignment', 'contest'],
            message: '{VALUE} is not a valid test type'
        }
    },
    creatorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Creator ID is required']
    },
    subjectId: {
        type: String,
        required: [true, 'Subject ID is required'],
        trim: true
    },
    status: {
        type: String,
        enum: {
            values: ['draft', 'published', 'archived'],
            message: '{VALUE} is not a valid status'
        },
        default: 'draft'
    },
    scheduledStart: {
        type: Date,
        default: null
    },
    scheduledEnd: {
        type: Date,
        default: null,
        validate: {
            validator: function(value) {
                if (!value || !this.scheduledStart) return true;
                return value > this.scheduledStart;
            },
            message: 'Scheduled end time must be after start time'
        }
    },
    durationMinutes: {
        type: Number,
        default: 60,
        min: [1, 'Duration must be at least 1 minute'],
        max: [600, 'Duration cannot exceed 600 minutes']
    },
    questionRefs: {
        mcqIds: [{
            type: String,
            trim: true
        }],
        codingIds: [{
            type: String,
            trim: true
        }],
        assignmentIds: [{
            type: String,
            trim: true
        }]
    },
    customQuestions: {
        mcq: {
            type: [customMcqQuestionSchema],
            default: []
        },
        coding: {
            type: [customCodingQuestionSchema],
            default: []
        },
        assignment: {
            type: [customAssignmentQuestionSchema],
            default: []
        }
    },
    settings: {
        allowLateSubmission: {
            type: Boolean,
            default: false
        },
        showResultsImmediately: {
            type: Boolean,
            default: false
        },
        randomizeQuestions: {
            type: Boolean,
            default: false
        },
        enableProctoring: {
            type: Boolean,
            default: false
        }
    },
    marksAllocation: {
        mcq: {
            type: Number,
            default: 0,
            min: 0
        },
        coding: {
            type: Number,
            default: 0,
            min: 0
        },
        assignment: {
            type: Number,
            default: 0,
            min: 0
        }
    },
    passingPercentage: {
        type: Number,
        default: 40,
        min: [0, 'Passing percentage cannot be negative'],
        max: [100, 'Passing percentage cannot exceed 100']
    },
    instructions: {
        type: String,
        default: '',
        maxLength: [5000, 'Instructions cannot exceed 5000 characters']
    },
    totalMarks: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true,
    collection: 'tests'
});

// Calculate total marks before saving
testSchema.pre('save', function () {
    this.totalMarks =
        (this.marksAllocation?.mcq || 0) +
        (this.marksAllocation?.coding || 0) +
        (this.marksAllocation?.assignment || 0);
});

// Indexes for better query performance
testSchema.index({ creatorId: 1, status: 1 });
testSchema.index({ status: 1, scheduledStart: 1 });
testSchema.index({ subjectId: 1 });

const Test = mongoose.model('Test', testSchema);

export default Test;

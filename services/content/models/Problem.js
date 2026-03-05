import mongoose from 'mongoose';

const testCaseSchema = new mongoose.Schema({
    input: {
        type: String,
        required: true
    },
    output: {
        type: String,
        required: true
    },
    isHidden: {
        type: Boolean,
        default: false
    },
    isSample: {
        type: Boolean,
        default: false
    }
}, { _id: false });

const problemSchema = new mongoose.Schema({
    problemId: {
        type: String,
        required: [true, 'Problem ID is required'],
        unique: true,
        trim: true
    },
    title: {
        type: String,
        required: [true, 'Problem title is required'],
        trim: true,
        maxLength: [200, 'Title cannot exceed 200 characters']
    },
    description: {
        type: String,
        required: [true, 'Problem description is required']
    },
    difficulty: {
        type: String,
        enum: {
            values: ['easy', 'medium', 'hard'],
            message: '{VALUE} is not a valid difficulty'
        },
        default: 'medium'
    },
    tags: [{
        type: String,
        trim: true
    }],
    category: {
        type: String,
        default: 'general'
    },
    creatorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Creator ID is required']
    },
    // Problem constraints
    timeLimit: {
        type: Number,
        default: 1, // seconds
        min: [0.1, 'Time limit must be at least 0.1 seconds'],
        max: [10, 'Time limit cannot exceed 10 seconds']
    },
    memoryLimit: {
        type: Number,
        default: 256, // MB
        min: [64, 'Memory limit must be at least 64 MB'],
        max: [1024, 'Memory limit cannot exceed 1024 MB']
    },
    // Problem details
    constraints: {
        type: String,
        default: ''
    },
    inputFormat: {
        type: String,
        default: ''
    },
    outputFormat: {
        type: String,
        default: ''
    },
    // Test cases
    testCases: {
        type: [testCaseSchema],
        required: true,
        validate: {
            validator: function(testCases) {
                return testCases && testCases.length > 0;
            },
            message: 'At least one test case is required'
        }
    },
    // Solution template
    solutionTemplate: {
        cpp: { type: String, default: '' },
        java: { type: String, default: '' },
        python: { type: String, default: '' },
        javascript: { type: String, default: '' }
    },
    // Editorial/hints
    hints: [{
        type: String
    }],
    editorial: {
        type: String,
        default: ''
    },
    // Statistics
    usageCount: {
        type: Number,
        default: 0
    },
    submissionCount: {
        type: Number,
        default: 0
    },
    acceptedCount: {
        type: Number,
        default: 0
    },
    // Marks for scoring
    defaultMarks: {
        type: Number,
        default: 10,
        min: [1, 'Marks must be at least 1']
    },
    // Status
    status: {
        type: String,
        enum: ['draft', 'published', 'archived'],
        default: 'draft'
    },
    isPublic: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
    collection: 'problems'
});

// Virtual for acceptance rate
problemSchema.virtual('acceptanceRate').get(function() {
    if (this.submissionCount === 0) return 0;
    return ((this.acceptedCount / this.submissionCount) * 100).toFixed(2);
});

// Indexes for better query performance
problemSchema.index({ problemId: 1 });
problemSchema.index({ creatorId: 1, status: 1 });
problemSchema.index({ difficulty: 1 });
problemSchema.index({ tags: 1 });
problemSchema.index({ category: 1 });
problemSchema.index({ status: 1, isPublic: 1 });

// Pre-save middleware to generate problemId if not provided
problemSchema.pre('save', function(next) {
    if (!this.problemId) {
        this.problemId = `PROB${Date.now()}${Math.floor(Math.random() * 1000)}`;
    }
    next();
});

const Problem = mongoose.model('Problem', problemSchema);

export default Problem;

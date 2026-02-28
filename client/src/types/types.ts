export interface User {
    _id: string;
    username: string;
    email: string;
    role: "user" | "admin" | "faculty";
    isVerified: boolean;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface Assignment {
    _id: string;
    test_id: string;
    subject_id: string;
    num_questions: number;
    questions: {
        question_id: string;
        question_text: string;
    }[];
    createdAt: string;
    updatedAt: string;
}

export interface Testcase {
    input: string;
    output: string;
}

export interface CodingQuestion {
    question_id: string;
    question_text: string;
    test_cases: Testcase[];
}

export interface Coding {
    _id: string;
    test_id: string;
    subject_id: string;
    num_questions: number;
    questions: CodingQuestion[];
    createdAt: string;
    updatedAt: string;
}

export interface McqQuestion {
    question_id: string;
    question_text: string;
    options: string[];
    correct_answer: string;
}

export interface Mcq {
    _id: string;
    test_id: string;
    subject_id: string;
    num_questions: number;
    questions: McqQuestion[];
    createdAt: string;
    updatedAt: string;
}

export interface Question {
    question_id: string;
    number: number;
    question_text: string;
    difficulty: string;
    acceptance: string;
    isPremium: boolean;
    category: string;
}

// ============= FACULTY DASHBOARD TYPES =============

export interface Test {
    _id: string;
    title: string;
    description?: string;
    type: 'assessment' | 'assignment' | 'contest';
    creatorId: string;
    subjectId: string;
    status: 'draft' | 'published' | 'archived';
    scheduledStart?: string;
    scheduledEnd?: string;
    durationMinutes: number;
    questionRefs: {
        mcqIds: string[];
        codingIds: string[];
        assignmentIds: string[];
    };
    settings: {
        allowLateSubmission: boolean;
        showResultsImmediately: boolean;
        randomizeQuestions: boolean;
        enableProctoring: boolean;
    };
    marksAllocation: {
        mcq: number;
        coding: number;
        assignment: number;
    };
    passingPercentage: number;
    instructions?: string;
    totalMarks: number;
    createdAt: string;
    updatedAt: string;
}

export interface MCQResponse {
    questionId: string;
    selectedAnswer: string | null;
    isCorrect: boolean | null;
    marksObtained: number;
    maxMarks: number;
}

export interface StudentAttempt {
    _id: string;
    testId: string | Test;
    studentId: string | User;
    startedAt: string;
    submittedAt: string | null;
    status: 'in_progress' | 'submitted' | 'graded';
    responses: {
        mcqResponses: MCQResponse[];
        codingSubmissionIds: string[];
        assignmentFileUrl: string | null;
    };
    score: {
        obtained: number;
        total: number;
        percentage: number;
    };
    gradedBy: string | null;
    gradedAt: string | null;
    feedback: string;
    timeSpentMinutes: number;
    ipAddress: string | null;
    userAgent: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface TestStatistics {
    total: number;
    draft: number;
    published: number;
    archived: number;
    byType: {
        assessment: number;
        assignment: number;
        contest: number;
    };
}

export interface TestAnalytics {
    totalAttempts: number;
    submitted: number;
    graded: number;
    averageScore: number;
    highestScore: number;
    lowestScore: number;
    scoreDistribution: {
        '0-20': number;
        '21-40': number;
        '41-60': number;
        '61-80': number;
        '81-100': number;
    };
    averageTimeSpent: number;
}

export interface FacultyAnalytics {
    totalTests: number;
    publishedTests: number;
    totalStudentAttempts: number;
    gradedAttempts: number;
    pendingGrading: number;
    averageTestScore: number;
    recentActivity: Array<{
        studentName: string;
        testTitle: string;
        score: number;
        submittedAt: string;
        status: string;
    }>;
}

// Enhanced question types with new fields
export interface EnhancedMCQQuestion extends McqQuestion {
    marks?: number;
    difficulty?: 'easy' | 'medium' | 'hard';
    tags?: string[];
    explanation?: string;
}

export interface EnhancedCodingQuestion extends CodingQuestion {
    marks?: number;
    difficulty?: 'easy' | 'medium' | 'hard';
    tags?: string[];
    timeLimit?: number;
    memoryLimit?: number;
    constraints?: string;
    inputFormat?: string;
    outputFormat?: string;
    sampleInput?: string;
    sampleOutput?: string;
}

export interface EnhancedAssignmentQuestion {
    question_id: string;
    question_text: string;
    marks?: number;
    difficulty?: 'easy' | 'medium' | 'hard';
    tags?: string[];
    wordLimit?: number | null;
    attachmentRequired?: boolean;
}

// Problem Bank Interface
export interface TestCase {
    input: string;
    output: string;
    explanation?: string;
    isHidden: boolean;
    isSample: boolean;
}

export interface SolutionTemplate {
    language: string;
    code: string;
}

export interface Problem {
    _id: string;
    problemId: string;
    title: string;
    description: string;
    difficulty: 'easy' | 'medium' | 'hard';
    category: string;
    tags: string[];
    timeLimit: number;
    memoryLimit: number;
    constraints?: string;
    inputFormat?: string;
    outputFormat?: string;
    testCases: TestCase[];
    solutionTemplate: SolutionTemplate[];
    hints?: string[];
    editorial?: string;
    status: 'draft' | 'published' | 'archived';
    usageCount: number;
    submissionCount: number;
    acceptedCount: number;
    acceptanceRate: number;
    creatorId: string;
    createdAt: string;
    updatedAt: string;
}

// Analytics Interface
export interface Analytics {
    totalTests: number;
    activeTests: number;
    totalStudents: number;
    averageScore: number;
    averageCompletionTime: number;
    scoreDistribution: {
        '0-20': number;
        '21-40': number;
        '41-60': number;
        '61-80': number;
        '81-100': number;
    };
    testPerformance: Array<{
        testId: string;
        testTitle: string;
        averageScore: number;
        attempts: number;
    }>;
    recentTests?: Array<{
        _id: string;
        title: string;
        type: string;
        status: string;
    }>;
    recentActivity: Array<{
        studentName: string;
        testTitle: string;
        score: number;
        totalMarks: number;
        percentage: number;
        status: string;
        submittedAt: string;
    }>;
    completionRate: number;
    passRate: number;
}

// API Response types
export interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data?: T;
    error?: string;
}

export interface PaginatedResponse<T> {
    success: boolean;
    data: T[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}
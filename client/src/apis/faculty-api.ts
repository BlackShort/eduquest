import axios from 'axios';
import type { Test } from '@/types/types';

const API_URL = 'http://localhost:5000';

// Create axios instance with default config
const facultyApi = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add auth token to requests
facultyApi.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// ============= TEST MANAGEMENT APIs =============

export const createTest = async (testData: Partial<Test>) => {
    const response = await facultyApi.post('/api/faculty/tests', testData);
    return response.data;
};

export const getTests = async (params?: {
    status?: string;
    type?: string;
    subjectId?: string;
    page?: number;
    limit?: number;
    search?: string;
}) => {
    const response = await facultyApi.get('/api/faculty/tests', { params });
    return response.data;
};

export const getTestById = async (testId: string) => {
    const response = await facultyApi.get(`/api/faculty/tests/${testId}`);
    return response.data;
};

export const updateTest = async (testId: string, testData: Partial<Test>) => {
    const response = await facultyApi.put(`/api/faculty/tests/${testId}`, testData);
    return response.data;
};

export const deleteTest = async (testId: string) => {
    const response = await facultyApi.delete(`/api/faculty/tests/${testId}`);
    return response.data;
};

export const publishTest = async (testId: string) => {
    const response = await facultyApi.patch(`/api/faculty/tests/${testId}/publish`);
    return response.data;
};

export const archiveTest = async (testId: string) => {
    const response = await facultyApi.patch(`/api/faculty/tests/${testId}/archive`);
    return response.data;
};

export const duplicateTest = async (testId: string) => {
    const response = await facultyApi.post(`/api/faculty/tests/${testId}/duplicate`);
    return response.data;
};

export const getTestStats = async () => {
    const response = await facultyApi.get('/api/faculty/tests/stats');
    return response.data;
};

// ============= QUESTIONS MANAGEMENT APIs =============

export const getQuestions = async (
    type: 'mcq' | 'coding' | 'assignment',
    params?: {
        page?: number;
        limit?: number;
        search?: string;
        difficulty?: string;
        tags?: string;
        isInProblemBank?: boolean;
        subjectId?: string;
    }
) => {
    const response = await facultyApi.get(`/api/faculty/questions/${type}`, { params });
    return response.data;
};

export const getQuestionById = async (type: 'mcq' | 'coding' | 'assignment', questionId: string) => {
    const response = await facultyApi.get(`/api/faculty/questions/${type}/${questionId}`);
    return response.data;
};

export const createQuestion = async (type: 'mcq' | 'coding' | 'assignment', questionData: Record<string, unknown>) => {
    const response = await facultyApi.post(`/api/faculty/questions/${type}`, questionData);
    return response.data;
};

export const updateQuestion = async (
    type: 'mcq' | 'coding' | 'assignment',
    questionId: string,
    questionData: Record<string, unknown>
) => {
    const response = await facultyApi.put(`/api/faculty/questions/${type}/${questionId}`, questionData);
    return response.data;
};

export const deleteQuestion = async (type: 'mcq' | 'coding' | 'assignment', questionId: string) => {
    const response = await facultyApi.delete(`/api/faculty/questions/${type}/${questionId}`);
    return response.data;
};

export const addQuestionToSet = async (
    type: 'mcq' | 'coding' | 'assignment',
    testId: string,
    questionData: Record<string, unknown>
) => {
    const response = await facultyApi.post(`/api/faculty/questions/${type}/${testId}/questions`, questionData);
    return response.data;
};

export const removeQuestionFromSet = async (
    type: 'mcq' | 'coding' | 'assignment',
    testId: string,
    questionId: string
) => {
    const response = await facultyApi.delete(
        `/api/faculty/questions/${type}/${testId}/questions/${questionId}`
    );
    return response.data;
};

export const bulkImportQuestions = async (type: 'mcq' | 'coding' | 'assignment', data: Record<string, unknown>) => {
    const response = await facultyApi.post(`/api/faculty/questions/${type}/bulk-import`, data);
    return response.data;
};

// ============= SUBMISSIONS & GRADING APIs =============

export const getTestAttempts = async (
    testId: string,
    params?: {
        status?: string;
        page?: number;
        limit?: number;
        search?: string;
    }
) => {
    const response = await facultyApi.get(`/api/faculty/submissions/test/${testId}`, { params });
    return response.data;
};

export const getAttemptById = async (attemptId: string) => {
    const response = await facultyApi.get(`/api/faculty/submissions/${attemptId}`);
    return response.data;
};

export const gradeAttempt = async (attemptId: string, gradingData: {
    score?: {
        obtained: number;
        total: number;
    };
    feedback?: string;
    mcqGrading?: Array<{
        questionId: string;
        isCorrect: boolean;
        marksObtained: number;
    }>;
}) => {
    const response = await facultyApi.put(`/api/faculty/submissions/${attemptId}/grade`, gradingData);
    return response.data;
};

export const getTestAnalytics = async (testId: string) => {
    const response = await facultyApi.get(`/api/faculty/submissions/test/${testId}/analytics`);
    return response.data;
};

export const getFacultyAnalytics = async (startDate?: string, endDate?: string) => {
    const response = await facultyApi.get('/api/faculty/submissions/analytics/overview', {
        params: { startDate, endDate }
    });
    return response.data;
};

export const exportTestResults = async (testId: string, format: 'excel' | 'pdf' = 'excel') => {
    const response = await facultyApi.get(`/api/faculty/submissions/test/${testId}/export`, {
        params: { format },
        responseType: 'blob'
    });
    return response.data;
};

export const exportStudentPerformance = async (startDate: string, endDate: string) => {
    const response = await facultyApi.get('/api/faculty/submissions/export/performance', {
        params: { startDate, endDate },
        responseType: 'blob'
    });
    return response.data;
};

export const exportAnalyticsReport = async (startDate: string, endDate: string) => {
    const response = await facultyApi.get('/api/faculty/submissions/export/analytics', {
        params: { startDate, endDate },
        responseType: 'blob'
    });
    return response.data;
};

// ============= PROBLEM BANK APIs =============

export const createProblem = async (problemData: Record<string, unknown>) => {
    const response = await facultyApi.post('/api/faculty/problems', problemData);
    return response.data;
};

export const getProblems = async (params?: URLSearchParams) => {
    const response = await facultyApi.get('/api/faculty/problems', { 
        params: params ? Object.fromEntries(params) : {} 
    });
    return response.data;
};

export const getProblemById = async (problemId: string) => {
    const response = await facultyApi.get(`/api/faculty/problems/${problemId}`);
    return response.data;
};

export const getProblemByProblemId = async (problemId: string) => {
    const response = await facultyApi.get(`/api/faculty/problems/problemId/${problemId}`);
    return response.data;
};

export const updateProblem = async (problemId: string, problemData: Record<string, unknown>) => {
    const response = await facultyApi.put(`/api/faculty/problems/${problemId}`, problemData);
    return response.data;
};

export const deleteProblem = async (problemId: string) => {
    const response = await facultyApi.delete(`/api/faculty/problems/${problemId}`);
    return response.data;
};

export const publishProblem = async (problemId: string) => {
    const response = await facultyApi.patch(`/api/faculty/problems/${problemId}/publish`);
    return response.data;
};

export const cloneProblem = async (problemId: string) => {
    const response = await facultyApi.post(`/api/faculty/problems/${problemId}/clone`);
    return response.data;
};

export const getProblemStats = async () => {
    const response = await facultyApi.get('/api/faculty/problems/stats');
    return response.data;
};

export const getAllTags = async () => {
    const response = await facultyApi.get('/api/faculty/problems/tags');
    return response.data;
};

export const incrementProblemUsage = async (problemId: string) => {
    const response = await facultyApi.patch(`/api/faculty/problems/${problemId}/increment-usage`);
    return response.data;
};

// ============= CSV UPLOAD APIs (existing endpoints) =============

export const uploadMCQCSV = async (formData: FormData) => {
    const response = await facultyApi.post('/mcq/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
};

export const uploadCodingCSV = async (formData: FormData) => {
    const response = await facultyApi.post('/coding/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
};

export const uploadAssignmentCSV = async (formData: FormData) => {
    const response = await facultyApi.post('/assignment/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
    return response.data;
};
// ============= ASSIGNMENT APIs =============

export const getAssignments = async () => {
    const response = await facultyApi.get('/v1/assignment');
    return response.data;
};

export default facultyApi;

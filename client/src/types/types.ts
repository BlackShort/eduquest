export interface User {
    _id: string;
    username: string;
    email: string;
    role: "user" | "admin";
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
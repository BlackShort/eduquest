
import mongoose from 'mongoose';
import Submission from '../models/submission-model.js';

import { runCodeForQuestion } from '../services/executor-service.js';
import { getTestcasesForQuestion } from '../services/testcase-service.js';
import { checkSubmissionPlagiarism } from '../services/plagiarism-service.js';

export const executeSubmission = async (req, res) => {
    try {
        const {  studentId, questionId, testId, language, code, mode, testCase } = req.body;
        // const studentId = req.headers["x-student-id"];

        // const role = req.headers["x-user-role"];
        if (!studentId || !questionId || !language || !code || !mode) {
            return res.status(400).json({
                message: 'studentId, questionId, testId, language, code and mode are required',
            });
        }

        console.log('Received submission execution request:', {
            studentId,
            questionId,
            testId,
            language,
            mode,
            code, 
            testCase,});
        // const testcases = await getTestcasesForQuestion(questionId, mode);
        const executionResult = await runCodeForQuestion({
            code,
            language,
            testcases: testCase,
        });

        let savedSubmission = null;
        let plagiarismResult = null;

        if (mode === 'submit') {
            savedSubmission = await Submission.create({
                studentId,
                questionId,
                testId,
                language,
                code,
                mode,
                totalTestcases: executionResult.totalTestcases,
                passedTestcases: executionResult.passedTestcases,
                verdict: executionResult.verdict,
                overallTimeMs: executionResult.overallTimeMs,
                testcaseResults: executionResult.testcaseResults,
            });

            plagiarismResult = await checkSubmissionPlagiarism(savedSubmission);

            savedSubmission.plagiarism = plagiarismResult;
            await savedSubmission.save();
        }

        console.log("Request processed successfully:", {
            message: 'Execution completed',
            executionResult,
            submissionId: savedSubmission ? savedSubmission._id : null,
            plagiarism: plagiarismResult,
        })

        return res.status(200).json({
            message: 'Execution completed',
            executionResult,
            submissionId: savedSubmission ? savedSubmission._id : null,
            plagiarism: plagiarismResult,
        });
    } catch (err) {
        console.error('Error in executeSubmission:', err);
        return res.status(500).json({
            message: 'Internal server error',
        });
    }
};

export const getSubmissionById = async (req, res) => {
    try {
        const { submissionId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(submissionId)) {
            return res.status(400).json({ message: 'Invalid submissionId' });
        }

        const submission = await Submission.findById(submissionId);

        if (!submission) {
            return res.status(404).json({ message: 'Submission not found' });
        }

        return res.status(200).json(submission);
    } catch (err) {
        console.error('Error in getSubmissionById:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const getSubmissionsByStudent = async (req, res) => {
    try {
        const { studentId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(studentId)) {
            return res.status(400).json({ message: 'Invalid studentId' });
        }

        const submissions = await Submission.find({ studentId }).sort({ createdAt: -1 });

        return res.status(200).json(submissions);
    } catch (err) {
        console.error('Error in getSubmissionsByStudent:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const getSubmissionsByQuestion = async (req, res) => {
    try {
        const { questionId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(questionId)) {
            return res.status(400).json({ message: 'Invalid questionId' });
        }

        const submissions = await Submission.find({ questionId }).sort({ createdAt: -1 });

        return res.status(200).json(submissions);
    } catch (err) {
        console.error('Error in getSubmissionsByQuestion:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const recheckPlagiarismForSubmission = async (req, res) => {
    try {
        const { submissionId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(submissionId)) {
            return res.status(400).json({ message: 'Invalid submissionId' });
        }

        const submission = await Submission.findById(submissionId);

        if (!submission) {
            return res.status(404).json({ message: 'Submission not found' });
        }

        const plagiarismResult = {
            checked: true,
            maxSimilarity: 0,
            similarSubmissions: [],
        };

        submission.plagiarism = plagiarismResult;
        await submission.save();

        return res.status(200).json({
            message: 'Plagiarism rechecked successfully',
            plagiarism: plagiarismResult,
        });
    } catch (err) {
        console.error('Error in recheckPlagiarismForSubmission:', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

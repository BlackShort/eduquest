
const mongoose = require('mongoose');
const Submission = require('../models/submission.model');

const executorService = require('../services/executor.service');
const testcaseService = require('../services/testcase.service');
const plagiarismService = require('../services/plagiarism.service');

exports.executeSubmission = async (req, res) => {
    try {
        const { studentId, questionId, testId, language, code, mode } = req.body;

        if (!studentId || !questionId || !testId || !language || !code || !mode) {
            return res.status(400).json({
                message: 'studentId, questionId, testId, language, code and mode are required',
            });
        }
        const testcases = await testcaseService.getTestcasesForQuestion(questionId, mode);

        const executionResult = await executorService.runCodeForQuestion({
            code,
            language,
            testcases,
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

            plagiarismResult = await plagiarismService.checkSubmissionPlagiarism(
                savedSubmission
            );

            savedSubmission.plagiarism = plagiarismResult;
            await savedSubmission.save();
        }          
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

exports.getSubmissionById = async (req, res) => {
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

exports.getSubmissionsByStudent = async (req, res) => {
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

exports.getSubmissionsByQuestion = async (req, res) => {
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

exports.recheckPlagiarismForSubmission = async (req, res) => {
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

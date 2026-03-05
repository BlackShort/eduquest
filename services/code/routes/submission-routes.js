import express from 'express';
import {
    executeSubmission,
    getSubmissionById,
    getSubmissionsByStudent,
    getSubmissionsByQuestion,
} from '../controllers/submission-controller.js';

export const submissionRoutes = express.Router();

submissionRoutes.post('/execute', executeSubmission);
submissionRoutes.get('/:submissionId', getSubmissionById);
submissionRoutes.get('/student/:studentId', getSubmissionsByStudent);
submissionRoutes.get('/question/:questionId', getSubmissionsByQuestion);

// Optional: re-check plagiarism for a submission
// submissionRoutes.post(
//     '/:submissionId/recheck-plagiarism',
//     submissionController.recheckPlagiarismForSubmission
// );

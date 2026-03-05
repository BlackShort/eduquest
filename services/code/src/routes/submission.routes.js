import express from 'express';
const router = express.Router();

import {
    executeSubmission,
    getSubmissionById,
    getSubmissionsByStudent,
    getSubmissionsByQuestion,
    recheckPlagiarismForSubmission
} from '../controllers/submission.controller.js';

router.post('/execute', executeSubmission);

router.get('/:submissionId', getSubmissionById);

router.get('/student/:studentId', getSubmissionsByStudent);

router.get('/question/:questionId', getSubmissionsByQuestion);

// Optional: re-check plagiarism for a submission
// router.post(
//     '/:submissionId/recheck-plagiarism',
//     submissionController.recheckPlagiarismForSubmission
// );

export default router;

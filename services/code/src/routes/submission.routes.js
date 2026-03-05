import express from 'express';
const router = express.Router();

import submissionController from '../controllers/submission.controller.js';

router.post('/execute', submissionController.executeSubmission);

router.get('/:submissionId', submissionController.getSubmissionById);

router.get('/student/:studentId', submissionController.getSubmissionsByStudent);

router.get('/question/:questionId', submissionController.getSubmissionsByQuestion);

// Optional: re-check plagiarism for a submission
// router.post(
//     '/:submissionId/recheck-plagiarism',
//     submissionController.recheckPlagiarismForSubmission
// );

export default router;

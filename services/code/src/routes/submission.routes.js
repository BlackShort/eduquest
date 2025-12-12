const express = require('express');
const router = express.Router();

const submissionController = require('../controllers/submission.controller');

router.post('/execute', submissionController.executeSubmission);

router.get('/:submissionId', submissionController.getSubmissionById);

router.get('/student/:studentId', submissionController.getSubmissionsByStudent);

router.get('/question/:questionId', submissionController.getSubmissionsByQuestion);

// Optional: re-check plagiarism for a submission
// router.post(
//     '/:submissionId/recheck-plagiarism',
//     submissionController.recheckPlagiarismForSubmission
// );

module.exports = router;

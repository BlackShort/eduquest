import express from 'express';
const router = express.Router();
import * as submissionsController from '../controllers/submissionsController.js';
import { verifyToken, verifyFaculty } from '../middlewares/auth.js';

// Apply auth middleware to all routes
router.use(verifyToken);
router.use(verifyFaculty);

// Faculty analytics
router.get('/analytics/overview', submissionsController.getFacultyAnalytics);

// Test-specific submissions
router.get('/test/:testId', submissionsController.getTestAttempts);
router.get('/test/:testId/analytics', submissionsController.getTestAnalytics);
router.get('/test/:testId/export', submissionsController.exportTestResults);

// Individual attempt operations
router.get('/:attemptId', submissionsController.getAttemptById);
router.put('/:attemptId/grade', submissionsController.gradeAttempt);

export default router;

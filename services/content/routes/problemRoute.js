import express from 'express';
const router = express.Router();
import * as problemController from '../controllers/problemController.js';
import { verifyToken, verifyFaculty } from '../middlewares/auth.js';

// Apply authentication middleware
router.use(verifyToken);
router.use(verifyFaculty);

// Problem CRUD routes
router.post('/', problemController.createProblem);
router.get('/', problemController.getProblems);
router.get('/stats', problemController.getProblemStats);
router.get('/tags', problemController.getAllTags);
router.get('/:id', problemController.getProblemById);
router.get('/problemId/:problemId', problemController.getProblemByProblemId);
router.put('/:id', problemController.updateProblem);
router.delete('/:id', problemController.deleteProblem);

// Problem actions
router.patch('/:id/publish', problemController.publishProblem);
router.post('/:id/clone', problemController.cloneProblem);
router.patch('/:id/increment-usage', problemController.incrementUsageCount);

export default router;

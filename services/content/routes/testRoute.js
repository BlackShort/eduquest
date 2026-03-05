import express from 'express';
const router = express.Router();
import * as testController from '../controllers/testController.js';
import { verifyToken, verifyFaculty } from '../middlewares/auth.js';

// Apply auth middleware to all routes
router.use(verifyToken);
router.use(verifyFaculty);

// Test CRUD operations
router.post('/', testController.createTest);
router.get('/', testController.getTests);
router.get('/stats', testController.getTestStats);
router.get('/:id', testController.getTestById);
router.put('/:id', testController.updateTest);
router.delete('/:id', testController.deleteTest);

// Test actions
router.patch('/:id/publish', testController.publishTest);
router.patch('/:id/archive', testController.archiveTest);
router.post('/:id/duplicate', testController.duplicateTest);

export default router;

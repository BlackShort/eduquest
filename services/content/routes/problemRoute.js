const express = require('express');
const router = express.Router();
const problemController = require('../controllers/problemController');
const { verifyToken, verifyFaculty } = require('../middlewares/auth');

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

module.exports = router;

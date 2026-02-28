const express = require('express');
const router = express.Router();
const testController = require('../controllers/testController');
const { verifyToken, verifyFaculty } = require('../middlewares/auth');

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

module.exports = router;

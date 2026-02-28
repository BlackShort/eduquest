const express = require('express');
const router = express.Router();
const questionsController = require('../controllers/questionsController');
const { verifyToken, verifyFaculty } = require('../middlewares/auth');

// Apply auth middleware to all routes
router.use(verifyToken);
router.use(verifyFaculty);

// Question CRUD operations (by type: mcq, coding, assignment)
router.get('/:type', questionsController.getQuestions);
router.get('/:type/:id', questionsController.getQuestionById);
router.post('/:type', questionsController.createQuestion);
router.put('/:type/:id', questionsController.updateQuestion);
router.delete('/:type/:id', questionsController.deleteQuestion);

// Individual question operations within a set
router.post('/:type/:id/questions', questionsController.addQuestionToSet);
router.delete('/:type/:id/questions/:questionId', questionsController.removeQuestionFromSet);

// Bulk import (for CSV compatibility)
router.post('/:type/bulk-import', questionsController.bulkImportQuestions);

module.exports = router;

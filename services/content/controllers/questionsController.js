import Mcq from '../models/Mcq.js';
import Coding from '../models/Coding.js';
import Assignment from '../models/Assignment.js';

/**
 * Get model based on question type
 */
const getModelByType = (type) => {
    switch (type) {
        case 'mcq':
            return Mcq;
        case 'coding':
            return Coding;
        case 'assignment':
            return Assignment;
        default:
            throw new Error('Invalid question type');
    }
};

/**
 * Get all questions by type (question bank or test-specific)
 */
export const getQuestions = async (req, res) => {
    try {
        const { type } = req.params;
        const { 
            page = 1, 
            limit = 10, 
            search,
            difficulty,
            tags,
            isInProblemBank,
            subjectId
        } = req.query;

        const Model = getModelByType(type);

        // Build filter
        const filter = { createdBy: req.user.userId };
        
        if (isInProblemBank !== undefined) {
            filter.isInProblemBank = isInProblemBank === 'true';
        }
        
        if (subjectId) {
            filter.subject_id = subjectId;
        }

        if (search) {
            filter['questions.question_text'] = { $regex: search, $options: 'i' };
        }

        // Calculate pagination
        const skip = (page - 1) * limit;

        const questions = await Model.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Model.countDocuments(filter);

        res.status(200).json({
            success: true,
            data: questions,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Error fetching questions:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch questions',
            error: error.message
        });
    }
};

/**
 * Get single question set by test_id
 */
export const getQuestionById = async (req, res) => {
    try {
        const { type, id } = req.params;
        const Model = getModelByType(type);

        const question = await Model.findOne({
            test_id: id,
            createdBy: req.user.userId
        });

        if (!question) {
            return res.status(404).json({
                success: false,
                message: 'Question set not found or access denied'
            });
        }

        res.status(200).json({
            success: true,
            data: question
        });
    } catch (error) {
        console.error('Error fetching question:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch question',
            error: error.message
        });
    }
};

/**
 * Create new question set
 */
export const createQuestion = async (req, res) => {
    try {
        const { type } = req.params;
        const Model = getModelByType(type);

        const questionData = {
            ...req.body,
            createdBy: req.user.userId
        };

        // Ensure num_questions matches actual question count
        if (questionData.questions && questionData.questions.length > 0) {
            questionData.num_questions = questionData.questions.length;
        }

        const question = new Model(questionData);
        await question.save();

        res.status(201).json({
            success: true,
            message: 'Question set created successfully',
            data: question
        });
    } catch (error) {
        console.error('Error creating question:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create question',
            error: error.message
        });
    }
};

/**
 * Update question set
 */
export const updateQuestion = async (req, res) => {
    try {
        const { type, id } = req.params;
        const Model = getModelByType(type);

        const question = await Model.findOne({
            test_id: id,
            createdBy: req.user.userId
        });

        if (!question) {
            return res.status(404).json({
                success: false,
                message: 'Question set not found or access denied'
            });
        }

        // Update fields
        Object.assign(question, req.body);
        
        // Update num_questions if questions array is modified
        if (req.body.questions) {
            question.num_questions = req.body.questions.length;
        }

        await question.save();

        res.status(200).json({
            success: true,
            message: 'Question set updated successfully',
            data: question
        });
    } catch (error) {
        console.error('Error updating question:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update question',
            error: error.message
        });
    }
};

/**
 * Delete question set
 */
export const deleteQuestion = async (req, res) => {
    try {
        const { type, id } = req.params;
        const Model = getModelByType(type);

        const question = await Model.findOneAndDelete({
            test_id: id,
            createdBy: req.user.userId
        });

        if (!question) {
            return res.status(404).json({
                success: false,
                message: 'Question set not found or access denied'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Question set deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting question:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete question',
            error: error.message
        });
    }
};

/**
 * Add individual question to existing question set
 */
export const addQuestionToSet = async (req, res) => {
    try {
        const { type, id } = req.params;
        const Model = getModelByType(type);

        const questionSet = await Model.findOne({
            test_id: id,
            createdBy: req.user.userId
        });

        if (!questionSet) {
            return res.status(404).json({
                success: false,
                message: 'Question set not found or access denied'
            });
        }

        // Add new question
        questionSet.questions.push(req.body);
        questionSet.num_questions = questionSet.questions.length;

        await questionSet.save();

        res.status(200).json({
            success: true,
            message: 'Question added successfully',
            data: questionSet
        });
    } catch (error) {
        console.error('Error adding question:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to add question',
            error: error.message
        });
    }
};

/**
 * Remove individual question from question set
 */
export const removeQuestionFromSet = async (req, res) => {
    try {
        const { type, id, questionId } = req.params;
        const Model = getModelByType(type);

        const questionSet = await Model.findOne({
            test_id: id,
            createdBy: req.user.userId
        });

        if (!questionSet) {
            return res.status(404).json({
                success: false,
                message: 'Question set not found or access denied'
            });
        }

        // Remove question by question_id
        questionSet.questions = questionSet.questions.filter(
            q => q.question_id !== questionId
        );
        questionSet.num_questions = questionSet.questions.length;

        await questionSet.save();

        res.status(200).json({
            success: true,
            message: 'Question removed successfully',
            data: questionSet
        });
    } catch (error) {
        console.error('Error removing question:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to remove question',
            error: error.message
        });
    }
};

/**
 * Bulk import questions (for CSV import compatibility)
 */
export const bulkImportQuestions = async (req, res) => {
    try {
        const { type } = req.params;
        const Model = getModelByType(type);
        const { test_id, questions } = req.body;

        if (!test_id || !questions || !Array.isArray(questions)) {
            return res.status(400).json({
                success: false,
                message: 'test_id and questions array are required'
            });
        }

        // Check if test_id already exists
        let questionSet = await Model.findOne({ test_id });

        if (questionSet) {
            // Append to existing
            questionSet.questions.push(...questions);
            questionSet.num_questions = questionSet.questions.length;
        } else {
            // Create new
            questionSet = new Model({
                test_id,
                subject_id: req.body.subject_id || 'general',
                num_questions: questions.length,
                questions,
                createdBy: req.user.userId,
                isInProblemBank: req.body.isInProblemBank || false
            });
        }

        await questionSet.save();

        res.status(200).json({
            success: true,
            message: 'Questions imported successfully',
            data: questionSet
        });
    } catch (error) {
        console.error('Error importing questions:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to import questions',
            error: error.message
        });
    }
};

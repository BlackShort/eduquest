import Problem from '../models/Problem.js';

/**
 * Create a new problem
 */
export const createProblem = async (req, res) => {
    try {
        const problemData = {
            ...req.body,
            creatorId: req.user.userId
        };

        const problem = new Problem(problemData);
        await problem.save();

        res.status(201).json({
            success: true,
            message: 'Problem created successfully',
            data: problem
        });
    } catch (error) {
        console.error('Error creating problem:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create problem',
            error: error.message
        });
    }
};

/**
 * Get all problems for faculty with filters
 */
export const getProblems = async (req, res) => {
    try {
        const { 
            difficulty,
            tags,
            category,
            status,
            page = 1, 
            limit = 10,
            search 
        } = req.query;

        // Build filter query
        const filter = { creatorId: req.user.userId };
        
        if (difficulty) filter.difficulty = difficulty;
        if (category) filter.category = category;
        if (status) filter.status = status;
        if (tags) {
            const tagArray = tags.split(',');
            filter.tags = { $in: tagArray };
        }
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { problemId: { $regex: search, $options: 'i' } }
            ];
        }

        // Calculate pagination
        const skip = (page - 1) * limit;

        // Execute query with pagination
        const problems = await Problem.find(filter)
            .select('-testCases -solutionTemplate -editorial') // Exclude large fields from list view
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Problem.countDocuments(filter);

        res.status(200).json({
            success: true,
            data: problems,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Error fetching problems:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch problems',
            error: error.message
        });
    }
};

/**
 * Get single problem by ID
 */
export const getProblemById = async (req, res) => {
    try {
        const { id } = req.params;

        const problem = await Problem.findOne({
            _id: id,
            creatorId: req.user.userId
        });

        if (!problem) {
            return res.status(404).json({
                success: false,
                message: 'Problem not found or access denied'
            });
        }

        res.status(200).json({
            success: true,
            data: problem
        });
    } catch (error) {
        console.error('Error fetching problem:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch problem',
            error: error.message
        });
    }
};

/**
 * Get problem by problemId (string identifier)
 */
export const getProblemByProblemId = async (req, res) => {
    try {
        const { problemId } = req.params;

        const problem = await Problem.findOne({
            problemId,
            creatorId: req.user.userId
        });

        if (!problem) {
            return res.status(404).json({
                success: false,
                message: 'Problem not found or access denied'
            });
        }

        res.status(200).json({
            success: true,
            data: problem
        });
    } catch (error) {
        console.error('Error fetching problem:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch problem',
            error: error.message
        });
    }
};

/**
 * Update problem
 */
export const updateProblem = async (req, res) => {
    try {
        const { id } = req.params;

        const problem = await Problem.findOne({
            _id: id,
            creatorId: req.user.userId
        });

        if (!problem) {
            return res.status(404).json({
                success: false,
                message: 'Problem not found or access denied'
            });
        }

        // Update fields
        Object.assign(problem, req.body);
        await problem.save();

        res.status(200).json({
            success: true,
            message: 'Problem updated successfully',
            data: problem
        });
    } catch (error) {
        console.error('Error updating problem:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update problem',
            error: error.message
        });
    }
};

/**
 * Delete problem
 */
export const deleteProblem = async (req, res) => {
    try {
        const { id } = req.params;

        const problem = await Problem.findOneAndDelete({
            _id: id,
            creatorId: req.user.userId
        });

        if (!problem) {
            return res.status(404).json({
                success: false,
                message: 'Problem not found or access denied'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Problem deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting problem:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete problem',
            error: error.message
        });
    }
};

/**
 * Publish problem
 */
export const publishProblem = async (req, res) => {
    try {
        const { id } = req.params;

        const problem = await Problem.findOne({
            _id: id,
            creatorId: req.user.userId
        });

        if (!problem) {
            return res.status(404).json({
                success: false,
                message: 'Problem not found or access denied'
            });
        }

        problem.status = 'published';
        await problem.save();

        res.status(200).json({
            success: true,
            message: 'Problem published successfully',
            data: problem
        });
    } catch (error) {
        console.error('Error publishing problem:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to publish problem',
            error: error.message
        });
    }
};

/**
 * Clone/duplicate problem
 */
export const cloneProblem = async (req, res) => {
    try {
        const { id } = req.params;

        const originalProblem = await Problem.findOne({
            _id: id,
            creatorId: req.user.userId
        });

        if (!originalProblem) {
            return res.status(404).json({
                success: false,
                message: 'Problem not found or access denied'
            });
        }

        // Create a duplicate
        const duplicateData = originalProblem.toObject();
        delete duplicateData._id;
        delete duplicateData.problemId; // Will be auto-generated
        delete duplicateData.createdAt;
        delete duplicateData.updatedAt;
        
        duplicateData.title = `${duplicateData.title} (Copy)`;
        duplicateData.status = 'draft';
        duplicateData.usageCount = 0;
        duplicateData.submissionCount = 0;
        duplicateData.acceptedCount = 0;

        const newProblem = new Problem(duplicateData);
        await newProblem.save();

        res.status(201).json({
            success: true,
            message: 'Problem cloned successfully',
            data: newProblem
        });
    } catch (error) {
        console.error('Error cloning problem:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to clone problem',
            error: error.message
        });
    }
};

/**
 * Get problem statistics
 */
export const getProblemStats = async (req, res) => {
    try {
        const facultyId = req.user.userId;

        const stats = {
            total: await Problem.countDocuments({ creatorId: facultyId }),
            draft: await Problem.countDocuments({ creatorId: facultyId, status: 'draft' }),
            published: await Problem.countDocuments({ creatorId: facultyId, status: 'published' }),
            archived: await Problem.countDocuments({ creatorId: facultyId, status: 'archived' }),
            byDifficulty: {
                easy: await Problem.countDocuments({ creatorId: facultyId, difficulty: 'easy' }),
                medium: await Problem.countDocuments({ creatorId: facultyId, difficulty: 'medium' }),
                hard: await Problem.countDocuments({ creatorId: facultyId, difficulty: 'hard' })
            }
        };

        // Get most used problems
        const mostUsed = await Problem.find({ creatorId: facultyId })
            .sort({ usageCount: -1 })
            .limit(5)
            .select('problemId title usageCount difficulty');

        stats.mostUsed = mostUsed;

        res.status(200).json({
            success: true,
            data: stats
        });
    } catch (error) {
        console.error('Error fetching problem stats:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch problem statistics',
            error: error.message
        });
    }
};

/**
 * Get all tags used in problems
 */
export const getAllTags = async (req, res) => {
    try {
        const facultyId = req.user.userId;

        const problems = await Problem.find({ creatorId: facultyId }).select('tags');
        
        // Extract unique tags
        const tagsSet = new Set();
        problems.forEach(problem => {
            problem.tags.forEach(tag => tagsSet.add(tag));
        });

        const tags = Array.from(tagsSet).sort();

        res.status(200).json({
            success: true,
            data: tags
        });
    } catch (error) {
        console.error('Error fetching tags:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch tags',
            error: error.message
        });
    }
};

/**
 * Increment usage count when problem is added to a test
 */
export const incrementUsageCount = async (req, res) => {
    try {
        const { id } = req.params;

        const problem = await Problem.findOneAndUpdate(
            { _id: id, creatorId: req.user.userId },
            { $inc: { usageCount: 1 } },
            { new: true }
        );

        if (!problem) {
            return res.status(404).json({
                success: false,
                message: 'Problem not found or access denied'
            });
        }

        res.status(200).json({
            success: true,
            data: problem
        });
    } catch (error) {
        console.error('Error incrementing usage count:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update problem',
            error: error.message
        });
    }
};

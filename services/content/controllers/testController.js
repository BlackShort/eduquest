import Test from '../models/Test.js';
import Mcq from '../models/Mcq.js';
import Coding from '../models/Coding.js';
import Assignment from '../models/Assignment.js';

/**
 * Create a new test
 */
export const createTest = async (req, res) => {
    try {
        console.log("USER FROM TOKEN:", req.user);
        console.log("BODY:", req.body);

        const testData = {
            ...req.body,
            creatorId: req.user.userId
        };

        const test = new Test(testData);
        await test.save();

        res.status(201).json({
            success: true,
            message: 'Test created successfully',
            data: test
        });
    } catch (error) {
        console.error('Error creating test:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create test',
            error: error.message
        });
    }
};

/**
 * Get all tests for logged-in faculty with filters
 */
export const getTests = async (req, res) => {
    try {
        const { 
            status, 
            type, 
            subjectId, 
            page = 1, 
            limit = 10,
            search 
        } = req.query;

        // Build filter query
        const filter = { creatorId: req.user.userId };
        
        if (status) filter.status = status;
        if (type) filter.type = type;
        if (subjectId) filter.subjectId = subjectId;
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        // Calculate pagination
        const skip = (page - 1) * limit;

        // Execute query with pagination
        const tests = await Test.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await Test.countDocuments(filter);

        res.status(200).json({
            success: true,
            data: tests,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Error fetching tests:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch tests',
            error: error.message
        });
    }
};

/**
 * Get single test by ID
 */
export const getTestById = async (req, res) => {
    try {
        const { id } = req.params;

        const test = await Test.findOne({
            _id: id,
            creatorId: req.user.userId
        });

        if (!test) {
            return res.status(404).json({
                success: false,
                message: 'Test not found or access denied'
            });
        }

        // Fetch question details if needed
        const testWithQuestions = test.toObject();

        // Prefer per-test edited question snapshots when they exist.
        if (testWithQuestions.customQuestions?.mcq?.length > 0) {
            testWithQuestions.mcqQuestions = testWithQuestions.customQuestions.mcq;
        } else if (test.questionRefs.mcqIds.length > 0) {
            const mcqDocs = await Mcq.find({ 
                test_id: { $in: test.questionRefs.mcqIds } 
            });
            testWithQuestions.mcqQuestions = mcqDocs;
        }

        if (testWithQuestions.customQuestions?.coding?.length > 0) {
            testWithQuestions.codingQuestions = testWithQuestions.customQuestions.coding;
        } else if (test.questionRefs.codingIds.length > 0) {
            const codingDocs = await Coding.find({ 
                test_id: { $in: test.questionRefs.codingIds } 
            });
            testWithQuestions.codingQuestions = codingDocs;
        }

        if (testWithQuestions.customQuestions?.assignment?.length > 0) {
            testWithQuestions.assignmentQuestions = testWithQuestions.customQuestions.assignment;
        } else if (test.questionRefs.assignmentIds.length > 0) {
            const assignmentDocs = await Assignment.find({ 
                test_id: { $in: test.questionRefs.assignmentIds } 
            });
            testWithQuestions.assignmentQuestions = assignmentDocs;
        }

        res.status(200).json({
            success: true,
            data: testWithQuestions
        });
    } catch (error) {
        console.error('Error fetching test:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch test',
            error: error.message
        });
    }
};


export const getPublicTests = async (req, res) => {
    try {
        const now = new Date();

        const tests = await Test.find({
            status: 'published',
            scheduledEnd: { $gte: now } // remove expired
        }).sort({ scheduledStart: 1 });

        res.status(200).json({
            success: true,
            data: tests
        });
    } catch (error) {
        console.error('Error fetching public tests:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch public tests',
            error: error.message
        });
    }
};

const pickSelectedQuestions = (docs, selectedIds) => {
    const selected = new Set(selectedIds);
    const byQuestionId = [];

    docs.forEach((doc) => {
        doc.questions?.forEach((question) => {
            if (selected.has(question.question_id)) {
                byQuestionId.push(question.toObject ? question.toObject() : question);
            }
        });
    });

    if (byQuestionId.length > 0) {
        return byQuestionId;
    }

    // Backward compatibility for older tests that stored parent set ids/test_ids.
    return docs.flatMap((doc) =>
        doc.questions?.map((question) => question.toObject ? question.toObject() : question) || []
    );
};

export const getPublicTestById = async (req, res) => {
    try {
        const { id } = req.params;

        const test = await Test.findOne({
            _id: id,
            status: 'published'
        });

        if (!test) {
            return res.status(404).json({
                success: false,
                message: 'Published test not found'
            });
        }

        const testWithQuestions = test.toObject();
        const mcqIds = test.questionRefs?.mcqIds || [];
        const codingIds = test.questionRefs?.codingIds || [];
        const assignmentIds = test.questionRefs?.assignmentIds || [];

        if (testWithQuestions.customQuestions?.mcq?.length > 0) {
            testWithQuestions.mcqQuestions = testWithQuestions.customQuestions.mcq;
        } else if (mcqIds.length > 0) {
            const mcqDocs = await Mcq.find({
                $or: [
                    { 'questions.question_id': { $in: mcqIds } },
                    { test_id: { $in: mcqIds } },
                    { _id: { $in: mcqIds.filter((value) => value.match(/^[0-9a-fA-F]{24}$/)) } }
                ]
            });

            testWithQuestions.mcqQuestions = pickSelectedQuestions(mcqDocs, mcqIds);
        } else {
            testWithQuestions.mcqQuestions = [];
        }

        if (testWithQuestions.customQuestions?.coding?.length > 0) {
            testWithQuestions.codingQuestions = testWithQuestions.customQuestions.coding;
        } else if (codingIds.length > 0) {
            const codingDocs = await Coding.find({
                $or: [
                    { 'questions.question_id': { $in: codingIds } },
                    { test_id: { $in: codingIds } },
                    { _id: { $in: codingIds.filter((value) => value.match(/^[0-9a-fA-F]{24}$/)) } }
                ]
            });

            testWithQuestions.codingQuestions = pickSelectedQuestions(codingDocs, codingIds);
        } else {
            testWithQuestions.codingQuestions = [];
        }

        if (testWithQuestions.customQuestions?.assignment?.length > 0) {
            testWithQuestions.assignmentQuestions = testWithQuestions.customQuestions.assignment;
        } else if (assignmentIds.length > 0) {
            const assignmentDocs = await Assignment.find({
                $or: [
                    { 'questions.question_id': { $in: assignmentIds } },
                    { test_id: { $in: assignmentIds } },
                    { _id: { $in: assignmentIds.filter((value) => value.match(/^[0-9a-fA-F]{24}$/)) } }
                ]
            });

            testWithQuestions.assignmentQuestions = pickSelectedQuestions(assignmentDocs, assignmentIds);
        } else {
            testWithQuestions.assignmentQuestions = [];
        }

        res.status(200).json({
            success: true,
            data: testWithQuestions
        });
    } catch (error) {
        console.error('Error fetching public test:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch public test',
            error: error.message
        });
    }
};

/**
 * Update test
 */
export const updateTest = async (req, res) => {
    try {
        const { id } = req.params;

        const test = await Test.findOne({
            _id: id,
            creatorId: req.user.userId
        });

        if (!test) {
            return res.status(404).json({
                success: false,
                message: 'Test not found or access denied'
            });
        }

        // Update fields
        Object.assign(test, req.body);
        await test.save();

        res.status(200).json({
            success: true,
            message: 'Test updated successfully',
            data: test
        });
    } catch (error) {
        console.error('Error updating test:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update test',
            error: error.message
        });
    }
};

/**
 * Delete test
 */
export const deleteTest = async (req, res) => {
    try {
        const { id } = req.params;

        const test = await Test.findOneAndDelete({
            _id: id,
            creatorId: req.user.userId
        });

        if (!test) {
            return res.status(404).json({
                success: false,
                message: 'Test not found or access denied'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Test deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting test:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete test',
            error: error.message
        });
    }
};

/**
 * Publish test (change status to published)
 */
export const publishTest = async (req, res) => {
    try {
        const { id } = req.params;

        const test = await Test.findOne({
            _id: id,
            creatorId: req.user.userId
        });

        if (!test) {
            return res.status(404).json({
                success: false,
                message: 'Test not found or access denied'
            });
        }

        test.status = 'published';
        await test.save();

        res.status(200).json({
            success: true,
            message: 'Test published successfully',
            data: test
        });
    } catch (error) {
        console.error('Error publishing test:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to publish test',
            error: error.message
        });
    }
};

/**
 * Archive test
 */
export const archiveTest = async (req, res) => {
    try {
        const { id } = req.params;

        const test = await Test.findOne({
            _id: id,
            creatorId: req.user.userId
        });

        if (!test) {
            return res.status(404).json({
                success: false,
                message: 'Test not found or access denied'
            });
        }

        test.status = 'archived';
        await test.save();

        res.status(200).json({
            success: true,
            message: 'Test archived successfully',
            data: test
        });
    } catch (error) {
        console.error('Error archiving test:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to archive test',
            error: error.message
        });
    }
};

/**
 * Duplicate/Clone test
 */
export const duplicateTest = async (req, res) => {
    try {
        const { id } = req.params;

        const originalTest = await Test.findOne({
            _id: id,
            creatorId: req.user.userId
        });

        if (!originalTest) {
            return res.status(404).json({
                success: false,
                message: 'Test not found or access denied'
            });
        }

        // Create a duplicate
        const duplicateData = originalTest.toObject();
        delete duplicateData._id;
        delete duplicateData.createdAt;
        delete duplicateData.updatedAt;
        
        duplicateData.title = `${duplicateData.title} (Copy)`;
        duplicateData.status = 'draft';

        const newTest = new Test(duplicateData);
        await newTest.save();

        res.status(201).json({
            success: true,
            message: 'Test duplicated successfully',
            data: newTest
        });
    } catch (error) {
        console.error('Error duplicating test:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to duplicate test',
            error: error.message
        });
    }
};

/**
 * Get test statistics
 */
export const getTestStats = async (req, res) => {
    try {
        const facultyId = req.user.userId;

        const stats = {
            total: await Test.countDocuments({ creatorId: facultyId }),
            draft: await Test.countDocuments({ creatorId: facultyId, status: 'draft' }),
            published: await Test.countDocuments({ creatorId: facultyId, status: 'published' }),
            archived: await Test.countDocuments({ creatorId: facultyId, status: 'archived' }),
            byType: {
                assessment: await Test.countDocuments({ creatorId: facultyId, type: 'assessment' }),
                assignment: await Test.countDocuments({ creatorId: facultyId, type: 'assignment' }),
                contest: await Test.countDocuments({ creatorId: facultyId, type: 'contest' })
            }
        };

        res.status(200).json({
            success: true,
            data: stats
        });
    } catch (error) {
        console.error('Error fetching test stats:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch test statistics',
            error: error.message
        });
    }
};

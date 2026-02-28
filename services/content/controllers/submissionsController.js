const StudentAttempt = require('../models/StudentAttempt');
const Test = require('../models/Test');

/**
 * Get all attempts for a specific test (Faculty view)
 */
exports.getTestAttempts = async (req, res) => {
    try {
        const { testId } = req.params;
        const { 
            status, 
            page = 1, 
            limit = 10,
            search 
        } = req.query;

        // Verify test belongs to faculty
        const test = await Test.findOne({
            _id: testId,
            creatorId: req.user.userId
        });

        if (!test) {
            return res.status(404).json({
                success: false,
                message: 'Test not found or access denied'
            });
        }

        // Build filter
        const filter = { testId };
        if (status) filter.status = status;

        // Calculate pagination
        const skip = (page - 1) * limit;

        // Fetch attempts with student details
        const attempts = await StudentAttempt.find(filter)
            .populate('studentId', 'username email')
            .sort({ submittedAt: -1 })
            .skip(skip)
            .limit(parseInt(limit));

        const total = await StudentAttempt.countDocuments(filter);

        res.status(200).json({
            success: true,
            data: attempts,
            pagination: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Error fetching test attempts:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch test attempts',
            error: error.message
        });
    }
};

/**
 * Get single attempt details
 */
exports.getAttemptById = async (req, res) => {
    try {
        const { attemptId } = req.params;

        const attempt = await StudentAttempt.findById(attemptId)
            .populate('studentId', 'username email')
            .populate('testId')
            .populate('gradedBy', 'username');

        if (!attempt) {
            return res.status(404).json({
                success: false,
                message: 'Attempt not found'
            });
        }

        // Verify faculty owns the test
        const test = await Test.findOne({
            _id: attempt.testId._id,
            creatorId: req.user.userId
        });

        if (!test) {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        res.status(200).json({
            success: true,
            data: attempt
        });
    } catch (error) {
        console.error('Error fetching attempt:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch attempt',
            error: error.message
        });
    }
};

/**
 * Grade a student attempt
 */
exports.gradeAttempt = async (req, res) => {
    try {
        const { attemptId } = req.params;
        const { 
            score, 
            feedback,
            mcqGrading 
        } = req.body;

        const attempt = await StudentAttempt.findById(attemptId)
            .populate('testId');

        if (!attempt) {
            return res.status(404).json({
                success: false,
                message: 'Attempt not found'
            });
        }

        // Verify faculty owns the test
        const test = await Test.findOne({
            _id: attempt.testId._id,
            creatorId: req.user.userId
        });

        if (!test) {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }

        // Update MCQ responses if provided
        if (mcqGrading && Array.isArray(mcqGrading)) {
            mcqGrading.forEach(graded => {
                const response = attempt.responses.mcqResponses.find(
                    r => r.questionId === graded.questionId
                );
                if (response) {
                    response.isCorrect = graded.isCorrect;
                    response.marksObtained = graded.marksObtained || 0;
                }
            });
        }

        // Update score
        if (score) {
            attempt.score.obtained = score.obtained;
            attempt.score.total = score.total;
        }

        // Update feedback and status
        attempt.feedback = feedback || attempt.feedback;
        attempt.status = 'graded';
        attempt.gradedBy = req.user.userId;
        attempt.gradedAt = new Date();

        await attempt.save();

        res.status(200).json({
            success: true,
            message: 'Attempt graded successfully',
            data: attempt
        });
    } catch (error) {
        console.error('Error grading attempt:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to grade attempt',
            error: error.message
        });
    }
};

/**
 * Get test analytics
 */
exports.getTestAnalytics = async (req, res) => {
    try {
        const { testId } = req.params;

        // Verify test belongs to faculty
        const test = await Test.findOne({
            _id: testId,
            creatorId: req.user.userId
        });

        if (!test) {
            return res.status(404).json({
                success: false,
                message: 'Test not found or access denied'
            });
        }

        // Get all attempts for this test
        const attempts = await StudentAttempt.find({ testId });

        // Calculate statistics
        const stats = {
            totalAttempts: attempts.length,
            submitted: attempts.filter(a => a.status !== 'in_progress').length,
            graded: attempts.filter(a => a.status === 'graded').length,
            averageScore: 0,
            highestScore: 0,
            lowestScore: 0,
            scoreDistribution: {
                '0-20': 0,
                '21-40': 0,
                '41-60': 0,
                '61-80': 0,
                '81-100': 0
            },
            averageTimeSpent: 0
        };

        // Calculate scores and distribution
        if (stats.graded > 0) {
            const gradedAttempts = attempts.filter(a => a.status === 'graded');
            
            const scores = gradedAttempts.map(a => a.score.percentage);
            stats.averageScore = scores.reduce((a, b) => a + b, 0) / scores.length;
            stats.highestScore = Math.max(...scores);
            stats.lowestScore = Math.min(...scores);

            // Score distribution
            gradedAttempts.forEach(attempt => {
                const percentage = attempt.score.percentage;
                if (percentage <= 20) stats.scoreDistribution['0-20']++;
                else if (percentage <= 40) stats.scoreDistribution['21-40']++;
                else if (percentage <= 60) stats.scoreDistribution['41-60']++;
                else if (percentage <= 80) stats.scoreDistribution['61-80']++;
                else stats.scoreDistribution['81-100']++;
            });

            // Average time spent
            const times = gradedAttempts.map(a => a.timeSpentMinutes || 0);
            stats.averageTimeSpent = times.reduce((a, b) => a + b, 0) / times.length;
        }

        res.status(200).json({
            success: true,
            data: stats
        });
    } catch (error) {
        console.error('Error fetching test analytics:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch test analytics',
            error: error.message
        });
    }
};

/**
 * Get faculty overview analytics
 */
exports.getFacultyAnalytics = async (req, res) => {
    try {
        const facultyId = req.user.userId;

        // Get all tests by faculty
        const tests = await Test.find({ creatorId: facultyId });
        const testIds = tests.map(t => t._id);

        // Get all attempts for faculty's tests
        const attempts = await StudentAttempt.find({ 
            testId: { $in: testIds } 
        });

        const stats = {
            totalTests: tests.length,
            publishedTests: tests.filter(t => t.status === 'published').length,
            totalStudentAttempts: attempts.length,
            gradedAttempts: attempts.filter(a => a.status === 'graded').length,
            pendingGrading: attempts.filter(
                a => a.status === 'submitted' && a.status !== 'graded'
            ).length,
            averageTestScore: 0,
            recentActivity: []
        };

        // Calculate average score across all graded attempts
        const gradedAttempts = attempts.filter(a => a.status === 'graded');
        if (gradedAttempts.length > 0) {
            const totalPercentage = gradedAttempts.reduce(
                (sum, a) => sum + a.score.percentage, 
                0
            );
            stats.averageTestScore = totalPercentage / gradedAttempts.length;
        }

        // Recent activity (last 10 submissions)
        const recentAttempts = await StudentAttempt.find({ 
            testId: { $in: testIds } 
        })
            .populate('studentId', 'username')
            .populate('testId', 'title')
            .sort({ submittedAt: -1 })
            .limit(10);

        stats.recentActivity = recentAttempts.map(a => ({
            studentName: a.studentId?.username,
            testTitle: a.testId?.title,
            score: a.score.percentage,
            submittedAt: a.submittedAt,
            status: a.status
        }));

        res.status(200).json({
            success: true,
            data: stats
        });
    } catch (error) {
        console.error('Error fetching faculty analytics:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch faculty analytics',
            error: error.message
        });
    }
};

/**
 * Export test results (for CSV/PDF generation)
 */
exports.exportTestResults = async (req, res) => {
    try {
        const { testId } = req.params;

        // Verify test belongs to faculty
        const test = await Test.findOne({
            _id: testId,
            creatorId: req.user.userId
        });

        if (!test) {
            return res.status(404).json({
                success: false,
                message: 'Test not found or access denied'
            });
        }

        // Get all attempts
        const attempts = await StudentAttempt.find({ testId })
            .populate('studentId', 'username email')
            .sort({ 'score.percentage': -1 });

        // Format for export
        const exportData = attempts.map((attempt, index) => ({
            rank: index + 1,
            studentName: attempt.studentId?.username || 'N/A',
            studentEmail: attempt.studentId?.email || 'N/A',
            scoreObtained: attempt.score.obtained,
            totalMarks: attempt.score.total,
            percentage: attempt.score.percentage.toFixed(2),
            status: attempt.status,
            submittedAt: attempt.submittedAt,
            timeSpent: attempt.timeSpentMinutes
        }));

        res.status(200).json({
            success: true,
            testDetails: {
                title: test.title,
                type: test.type,
                totalMarks: test.totalMarks
            },
            data: exportData
        });
    } catch (error) {
        console.error('Error exporting test results:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to export test results',
            error: error.message
        });
    }
};

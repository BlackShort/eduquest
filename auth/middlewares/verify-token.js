import jwt from 'jsonwebtoken';
import sessionModel from '../models/session-model.js';
import userModel from '../models/user-model.js';

/**
 * Verify JWT token and validate session
 * This middleware is used by all microservices to verify user authentication
 */
export const verifyToken = async (req, res, next) => {
    try {
        // Get token from headers or cookies
        const token = req.headers.authorization?.split(' ')[1] || req.cookies.accessToken;

        if (!token) {
            return res.status(401).json({ 
                success: false, 
                message: 'No token provided' 
            });
        }

        // Verify JWT signature
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

        // Check if session exists in database and is active
        const session = await sessionModel.findOne({ 
            token, 
            isActive: true,
            expiresAt: { $gt: new Date() }
        });

        if (!session) {
            return res.status(401).json({ 
                success: false, 
                message: 'Session expired or invalid' 
            });
        }

        // Get user details
        const user = await userModel.findById(decoded.userId);

        if (!user || !user.isActive) {
            return res.status(401).json({ 
                success: false, 
                message: 'User not found or inactive' 
            });
        }

        // Update last activity
        await sessionModel.updateOne(
            { _id: session._id },
            { lastActivity: new Date() }
        );

        // Attach user info to request
        req.user = {
            userId: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            sessionId: session._id
        };

        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                success: false, 
                message: 'Token expired' 
            });
        }
        
        return res.status(401).json({ 
            success: false, 
            message: 'Invalid token' 
        });
    }
};

/**
 * Verify user role for role-based access control
 */
export const verifyRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ 
                success: false, 
                message: 'Unauthorized' 
            });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ 
                success: false, 
                message: 'Forbidden - Insufficient permissions' 
            });
        }

        next();
    };
};

/**
 * Optional token verification - doesn't fail if token is missing
 */
export const verifyTokenOptional = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1] || req.cookies.accessToken;

        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
            const session = await sessionModel.findOne({ 
                token, 
                isActive: true 
            });

            if (session) {
                const user = await userModel.findById(decoded.userId);
                if (user) {
                    req.user = {
                        userId: user._id,
                        username: user.username,
                        email: user.email,
                        role: user.role,
                        sessionId: session._id
                    };
                }
            }
        }
    } catch (error) {
        // Silently fail for optional verification
    }

    next();
};

import jwt from 'jsonwebtoken';

/**
 * Middleware to verify JWT token from authorization header
 * Expects token from auth service microservice
 */
export const verifyToken = async (req, res, next) => {
    try {
        // Get token from headers
        const token = req.headers.authorization?.split(' ')[1] || req.cookies?.accessToken;

        if (!token) {
            return res.status(401).json({ 
                success: false, 
                message: 'No authentication token provided' 
            });
        }

        // Verify JWT signature (should match auth service secret)
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

        // Attach user info to request
        req.user = {
            userId: decoded.userId,
            username: decoded.username,
            email: decoded.email,
            role: decoded.role
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
            message: 'Invalid authentication token' 
        });
    }
};

/**
 * Middleware to verify user has faculty role
 * Must be used after verifyToken middleware
 */
export const verifyFaculty = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ 
            success: false, 
            message: 'Authentication required' 
        });
    }

    if (req.user.role !== 'faculty' && req.user.role !== 'admin') {
        return res.status(403).json({ 
            success: false, 
            message: 'Access denied. Faculty privileges required.' 
        });
    }

    next();
};

/**
 * Generic role verification middleware
 */
export const verifyRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ 
                success: false, 
                message: 'Authentication required' 
            });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ 
                success: false, 
                message: `Access denied. Required role: ${allowedRoles.join(' or ')}` 
            });
        }

        next();
    };
};

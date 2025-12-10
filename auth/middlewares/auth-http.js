import axios from 'axios';

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://localhost:4000';

/*
 Verify JWT token via HTTP call to auth service
 This middleware will:
 1. Extract token from headers or cookies
 2. Make HTTP call to auth service /verify-token endpoint
 3. Auth service validates JWT + session in its database
 4. Returns user info if valid
 5. Attach user info to req.user
 */
export const verifyTokenHTTP = async (req, res, next) => {
    try {
        // Get token from headers or cookies
        const token = req.headers.authorization?.split(' ')[1] || req.cookies.accessToken;

        if (!token) {
            return res.status(401).json({ 
                success: false, 
                message: 'No token provided' 
            });
        }

        // Call auth service to verify token
        const response = await axios.post(
            `${AUTH_SERVICE_URL}/api/v1/auth/verify-token`,
            {},
            {
                headers: { 'Authorization': `Bearer ${token}` },
                timeout: 5000 // 5 second timeout
            }
        );

        if (response.data.success) {
            // Token is valid, attach user info to request
            req.user = response.data.user;
            next();
        } else {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid token' 
            });
        }
    } catch (error) {
        // Handle different types of errors
        if (error.response) {
            // Auth service responded with error
            return res.status(error.response.status).json({ 
                success: false, 
                message: error.response.data.message || 'Token verification failed' 
            });
        } else if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
            // Auth service is down
            return res.status(503).json({ 
                success: false, 
                message: 'Authentication service unavailable' 
            });
        } else if (error.code === 'TIMEOUT') {
            // Request timed out
            return res.status(504).json({ 
                success: false, 
                message: 'Authentication service timeout' 
            });
        } else {
            // Other error
            return res.status(500).json({ 
                success: false, 
                message: 'Authentication verification failed' 
            });
        }
    }
};

/*
 * Verify user role for role-based access control
 * Usage:
 * router.get('/admin', verifyToken, verifyRole('admin'), handler);
 * router.post('/teach', verifyToken, verifyRole('faculty', 'admin'), handler);
 */
export const verifyRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ 
                success: false, 
                message: 'Unauthorized - No user info' 
            });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ 
                success: false, 
                message: `Forbidden - Required roles: ${allowedRoles.join(', ')}` 
            });
        }

        next();
    };
};

/*
 * Optional token verification - doesn't fail if token is missing
 * Use this for routes that work better with user context but don't require it.
 * For example: public content that shows personalized recommendations if logged in.
 */
export const verifyTokenOptional = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1] || req.cookies.accessToken;

        if (token) {
            const response = await axios.post(
                `${AUTH_SERVICE_URL}/api/v1/auth/verify-token`,
                {},
                {
                    headers: { 'Authorization': `Bearer ${token}` },
                    timeout: 5000
                }
            );

            if (response.data.success) {
                req.user = response.data.user;
            }
        }
    } catch (error) {
        // Silently fail for optional verification
        // req.user remains undefined
    }

    next();
};

/**
 * Middleware to check if auth service is healthy
 * 
 * Use this in health check endpoints to verify auth service connectivity
 */
export const checkAuthServiceHealth = async (req, res, next) => {
    try {
        await axios.get(`${AUTH_SERVICE_URL}/health`, { timeout: 3000 });
        req.authServiceHealthy = true;
    } catch (error) {
        req.authServiceHealthy = false;
    }
    next();
};
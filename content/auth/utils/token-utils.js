import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRY = process.env.JWT_EXPIRY || '24h';
const REFRESH_TOKEN_EXPIRY = process.env.REFRESH_TOKEN_EXPIRY || '7d';

// Generate JWT access token
export const generateAccessToken = (userId, username, email, role) => {
    return jwt.sign(
        {
            userId,
            username,
            email,
            role,
            type: 'access'
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRY }
    );
};

// Generate refresh token

export const generateRefreshToken = (userId) => {
    return jwt.sign(
        {
            userId,
            type: 'refresh'
        },
        JWT_SECRET,
        { expiresIn: REFRESH_TOKEN_EXPIRY }
    );
};

// Verify token

export const verifyAccessToken = (token) => {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        throw new Error('Invalid or expired token');
    }
};

// Decode token without verification (for debugging)
export const decodeToken = (token) => {
    return jwt.decode(token);
};

// Get token expiration time in milliseconds

export const getTokenExpiry = (expiryString = JWT_EXPIRY) => {
    const units = {
        'h': 3600000,      // hours
        'd': 86400000,     // days
        'm': 60000,        // minutes
        's': 1000          // seconds
    };

    const match = expiryString.match(/^(\d+)([hdms])$/);
    if (!match) return 86400000; // default 24 hours

    const [, value, unit] = match;
    return parseInt(value) * units[unit];
};

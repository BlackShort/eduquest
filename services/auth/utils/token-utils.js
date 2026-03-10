import jwt from 'jsonwebtoken';

// Read secrets lazily (at call time) so dotenv.config() in server.js has already run
const getSecret = () => process.env.JWT_SECRET;
const getExpiry = () => process.env.JWT_EXPIRY || '24h';
const getRefreshExpiry = () => process.env.REFRESH_TOKEN_EXPIRY || '7d';

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
        getSecret(),
        { expiresIn: getExpiry() }
    );
};

// Generate refresh token

export const generateRefreshToken = (userId) => {
    return jwt.sign(
        {
            userId,
            type: 'refresh'
        },
        getSecret(),
        { expiresIn: getRefreshExpiry() }
    );
};

// Verify token

export const verifyAccessToken = (token) => {
    try {
        return jwt.verify(token, getSecret());
    } catch (error) {
        throw new Error('Invalid or expired token');
    }
};

// Decode token without verification (for debugging)
export const decodeToken = (token) => {
    return jwt.decode(token);
};

// Get token expiration time in milliseconds

export const getTokenExpiry = (expiryString = getExpiry()) => {
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

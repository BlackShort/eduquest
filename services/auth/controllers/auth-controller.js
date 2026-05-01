import bcrypt from 'bcrypt';
import userModel from '../models/user-model.js';
import sessionModel from '../models/session-model.js';
import { generateAccessToken, generateRefreshToken, getTokenExpiry, verifyAccessToken } from '../utils/token-utils.js';

const GEHU_EMAIL_REGEX = /^([a-z0-9._%+-]+)\.(\d+)@gehu\.ac\.in$/;

const parseGehuEmail = (email) => {
    const normalizedEmail = String(email || '').trim().toLowerCase();
    const match = normalizedEmail.match(GEHU_EMAIL_REGEX);

    if (!match) {
        return null;
    }

    const [, username, studentId] = match;
    return { normalizedEmail, username, studentId };
};

/*
 * Register a new user
*/
export const register = async (req, res) => {
    try {
        const { email, password, role = 'user' } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email and password are required' 
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 8 characters long'
            });
        }

        const parsedEmail = parseGehuEmail(email);

        if (!parsedEmail) {
            return res.status(400).json({
                success: false,
                message: 'Use GEHU email format: username.studentId@gehu.ac.in'
            });
        }

        const { normalizedEmail, username, studentId } = parsedEmail;

        // Check if user already exists
        const existingUser = await userModel.findOne({ 
            $or: [{ email: normalizedEmail }, { username }, { studentId }]
        });

        if (existingUser) {
            return res.status(409).json({ 
                success: false, 
                message: 'User already exists with this email, username, or student ID' 
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new user
        const newUser = new userModel({
            username,
            studentId,
            email: normalizedEmail,
            password: hashedPassword,
            role,
            isVerified: false,
            isActive: true
        });

        await newUser.save();

        return res.status(201).json({ 
            success: true, 
            message: 'User registered successfully',
            user: {
                id: newUser._id,
                username: newUser.username,
                studentId: newUser.studentId,
                email: newUser.email,
                role: newUser.role
            }
        });

    } catch (error) {
        console.error('Register error:', error);
        return res.status(500).json({ 
            success: false, 
            message: 'Registration failed', 
            error: error.message 
        });
    }
};

/*
 * Login user and create session
*/
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({ 
                success: false, 
                message: 'Email and password are required' 
            });
        }

        // Find user
        const normalizedEmail = String(email).trim().toLowerCase();
        const user = await userModel.findOne({ email: normalizedEmail });

        if (!user) {
            return res.status(404).json({ 
                success: false, 
                message: 'User not found with this email' 
            });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid credentials' 
            });
        }

        // Check if user is active
        if (!user.isActive) {
            return res.status(403).json({ 
                success: false, 
                message: 'User account is deactivated' 
            });
        }

        // Generate tokens
        const accessToken = generateAccessToken(
            user._id,
            user.username,
            user.email,
            user.role
        );
        const refreshToken = generateRefreshToken(user._id);

        // Create session
        const expiryTime = new Date(Date.now() + getTokenExpiry());

        const session = new sessionModel({
            userId: user._id,
            token: accessToken,
            refreshToken: refreshToken,
            userAgent: req.headers['user-agent'],
            ipAddress: req.ip || req.connection.remoteAddress,
            deviceInfo: req.headers['device-info'],
            isActive: true,
            expiresAt: expiryTime
        });

        await session.save();

        // Update last login
        await userModel.updateOne(
            { _id: user._id },
            { lastLogin: new Date() }
        );

        // Set cookies
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: getTokenExpiry()
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: getTokenExpiry('7d')
        });

        return res.status(200).json({ 
            success: true, 
            message: 'Login successful',
            user: {
                id: user._id,
                username: user.username,
                studentId: user.studentId,
                email: user.email,
                role: user.role,
                isVerified: user.isVerified,
                isActive: user.isActive
            },
        });

    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ 
            success: false, 
            message: 'Login failed', 
            error: error.message 
        });
    }
};

/*
 * Refresh access token
*/
export const refreshAccessToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken || req.body.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({ 
                success: false, 
                message: 'Refresh token not provided' 
            });
        }

        // Verify refresh token
        const decoded = verifyAccessToken(refreshToken);

        // Find session
        const session = await sessionModel.findOne({ 
            refreshToken,
            isActive: true
        });

        if (!session) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid refresh token' 
            });
        }

        // Get user
        const user = await userModel.findById(decoded.userId);

        if (!user || !user.isActive) {
            return res.status(401).json({ 
                success: false, 
                message: 'User not found or inactive' 
            });
        }

        // Generate new access token
        const newAccessToken = generateAccessToken(
            user._id,
            user.username,
            user.email,
            user.role
        );

        // Update session
        await sessionModel.updateOne(
            { _id: session._id },
            { token: newAccessToken }
        );

        // Set new cookie
        res.cookie('accessToken', newAccessToken, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: getTokenExpiry()
        });

        return res.status(200).json({ 
            success: true, 
            message: 'Token refreshed successfully',
            accessToken: newAccessToken
        });

    } catch (error) {
        console.error('Token refresh error:', error);
        return res.status(401).json({ 
            success: false, 
            message: 'Token refresh failed', 
            error: error.message 
        });
    }
};

/*
 * Logout user and invalidate session
*/
export const logout = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1] || req.cookies.accessToken;

        if (token) {
            // Deactivate session
            await sessionModel.updateOne(
                { token },
                { isActive: false }
            );
        }

        // Clear cookies — options must match how they were set
        const cookieOptions = {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
        };
        res.clearCookie('accessToken', cookieOptions);
        res.clearCookie('refreshToken', cookieOptions);

        return res.status(200).json({ 
            success: true, 
            message: 'Logout successful' 
        });

    } catch (error) {
        console.error('Logout error:', error);
        return res.status(500).json({ 
            success: false, 
            message: 'Logout failed', 
            error: error.message 
        });
    }
};

/*
 * Get current user info (requires authentication)
*/
export const getCurrentUser = async (req, res) => {
    try {
        const user = await userModel.findById(req.user.userId).select('-password');

        return res.status(200).json({ 
            success: true, 
            user 
        });

    } catch (error) {
        console.error('Get user error:', error);
        return res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch user', 
            error: error.message 
        });
    }
};

/*
 * Get all active sessions for a user
*/
export const getUserSessions = async (req, res) => {
    try {
        const sessions = await sessionModel.find({
            userId: req.user.userId,
            isActive: true
        }).select('-token -refreshToken');

        return res.status(200).json({ 
            success: true, 
            sessions 
        });

    } catch (error) {
        console.error('Get sessions error:', error);
        return res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch sessions', 
            error: error.message 
        });
    }
};

/*
 * Logout from specific session
*/
export const logoutSession = async (req, res) => {
    try {
        const { sessionId } = req.params;

        await sessionModel.updateOne(
            { _id: sessionId, userId: req.user.userId },
            { isActive: false }
        );

        return res.status(200).json({ 
            success: true, 
            message: 'Session terminated successfully' 
        });

    } catch (error) {
        console.error('Logout session error:', error);
        return res.status(500).json({ 
            success: false, 
            message: 'Failed to logout session', 
            error: error.message 
        });
    }
};

/*
 * Logout from all sessions
*/
export const logoutAllSessions = async (req, res) => {
    try {
        await sessionModel.updateMany(
            { userId: req.user.userId },
            { isActive: false }
        );

        const cookieOptions = {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
        };
        res.clearCookie('accessToken', cookieOptions);
        res.clearCookie('refreshToken', cookieOptions);

        return res.status(200).json({ 
            success: true, 
            message: 'All sessions terminated successfully' 
        });

    } catch (error) {
        console.error('Logout all sessions error:', error);
        return res.status(500).json({ 
            success: false, 
            message: 'Failed to logout all sessions', 
            error: error.message 
        });
    }
};

/*
 * Verify token endpoint for other microservices
*/
export const verifyUserToken = async (req, res) => {
    try {
        // Set user identity as response headers so nginx auth_request_set can forward them
        res.set('X-User-Id',   String(req.user.userId));
        res.set('X-User-Role', req.user.role);
        res.set('X-Username',  req.user.username);

        return res.status(200).json({ 
            success: true, 
            message: 'Token is valid',
            user: req.user
        });

    } catch (error) {
        return res.status(401).json({ 
            success: false, 
            message: 'Token verification failed' 
        });
    }
};
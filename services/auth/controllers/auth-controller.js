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

const USERNAME_REGEX = /^[a-zA-Z0-9._]{3,30}$/;

/*
 * Register a new user
*/
export const register = async (req, res) => {
    try {

        const {
            courses,
            semester,
            email,
            role = "user"
        } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            });
        }

        const parsedEmail = parseGehuEmail(email);

        if (!parsedEmail) {
            return res.status(400).json({
                success: false,
                message: "Use GEHU email format: username.studentId@gehu.ac.in"
            });
        }

        const {
            normalizedEmail,
            username,
            studentId
        } = parsedEmail;

        const existingUser = await userModel.findOne({
            $or: [
                { email: normalizedEmail },
                { username },
                { studentId }
            ]
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "User already exists with this email, username, or student ID"
            });
        }

        const generatedPassword = `${username}@123`;

        const hashedPassword = await bcrypt.hash(
            generatedPassword,
            10
        );

        const newUser = new userModel({
            username,
            studentId,
            email: normalizedEmail,
            password: hashedPassword,
            role,
            courses: courses || [],
            semester,
            isVerified: true,
            isActive: true
        });

        await newUser.save();

        return res.status(201).json({
            success: true,
            message: "User registered successfully",

            generatedCredentials: {
                username,
                password: generatedPassword
            },

            user: {
                id: newUser._id,
                username: newUser.username,
                studentId: newUser.studentId,
                email: newUser.email,
                role: newUser.role,
                courses: newUser.courses,
                semester: newUser.semester
            }
        });

    } catch (error) {

        console.error("Register error:", error);

        if (error.code === 11000) {

            return res.status(409).json({
                success: false,
                message: "User already exists"
            });

        }

        return res.status(500).json({
            success: false,
            message: "Registration failed",
            error: error.message
        });

    }
};

export const bulkRegisterUsers = async (req, res) => {
    try {

        const {
            users,
            role = "user"
        } = req.body;

        if (!users || !Array.isArray(users)) {
            return res.status(400).json({
                success: false,
                message: "Users array is required"
            });
        }

        const createdUsers = [];
        const failedUsers = [];

        for (const userData of users) {

            try {

                const {
                    email,
                    courses,
                    semester
                } = userData;

                const parsedEmail = parseGehuEmail(email);

                if (!parsedEmail) {

                    failedUsers.push({
                        email,
                        reason: "Invalid GEHU email format"
                    });

                    continue;

                }

                const {
                    normalizedEmail,
                    username,
                    studentId
                } = parsedEmail;

                const existingUser = await userModel.findOne({
                    $or: [
                        { email: normalizedEmail },
                        { username },
                        { studentId }
                    ]
                });

                if (existingUser) {

                    failedUsers.push({
                        email,
                        reason: "User already exists"
                    });

                    continue;

                }

                const generatedPassword =
                    `${username}@123`;

                const hashedPassword =
                    await bcrypt.hash(
                        generatedPassword,
                        10
                    );

                const newUser = await userModel.create({
                    username,
                    studentId,
                    email: normalizedEmail,
                    password: hashedPassword,
                    role,
                    courses: courses || [],
                    semester,
                    isVerified: true,
                    isActive: true
                });

                createdUsers.push(newUser);

            } catch (error) {

                failedUsers.push({
                    email: userData.email,
                    reason: error.message
                });

            }

        }

        return res.status(201).json({
            success: true,
            message: "Bulk registration completed",
            totalUsers: users.length,
            successCount: createdUsers.length,
            failedCount: failedUsers.length,
            createdUsers,
            failedUsers
        });

    } catch (error) {

        console.error(
            "Bulk register error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Bulk registration failed",
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
            user.role,
            user.courses || [],
            user.semester ?? null
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
                courses: user.courses || [],
                semester: user.semester ?? null,
                isVerified: user.isVerified,
                isActive: user.isActive
            },
            accessToken,
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
            user.role,
            user.courses || [],
            user.semester ?? null
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
        const user = await userModel
            .findById(req.user.userId)
            .select('-password -verificationCode -verificationCodeExpiresAt');

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
        res.set('X-User-Id', String(req.user.userId));
        res.set('X-User-Role', req.user.role);
        res.set('X-Username', req.user.username);
        res.set('X-User-Courses', encodeURIComponent(JSON.stringify(req.user.courses || [])));
        res.set('X-User-Semester', String(req.user.semester ?? ''));

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

/*
 * Update username for current user
*/
export const updateUsername = async (req, res) => {
    try {
        const username = String(req.body.username || '').trim();

        if (!USERNAME_REGEX.test(username)) {
            return res.status(400).json({
                success: false,
                message: 'Username must be 3-30 characters and can contain letters, numbers, dot, and underscore'
            });
        }

        const existingUser = await userModel.findOne({
            username,
            _id: { $ne: req.user.userId }
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'Username is already taken'
            });
        }

        const updatedUser = await userModel
            .findByIdAndUpdate(
                req.user.userId,
                { username },
                { new: true }
            )
            .select('-password -verificationCode -verificationCodeExpiresAt');

        return res.status(200).json({
            success: true,
            message: 'Username updated successfully',
            user: updatedUser
        });
    } catch (error) {
        console.error('Update username error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to update username',
            error: error.message
        });
    }
};

/*
 * Change password for current user
*/
export const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword, confirmPassword } = req.body;

        if (!currentPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'Current password, new password, and confirm password are required'
            });
        }

        if (newPassword.length < 8) {
            return res.status(400).json({
                success: false,
                message: 'New password must be at least 8 characters long'
            });
        }

        if (newPassword !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'New password and confirm password do not match'
            });
        }

        const user = await userModel.findById(req.user.userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);

        if (!isCurrentPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }

        const isSameAsCurrent = await bcrypt.compare(newPassword, user.password);
        if (isSameAsCurrent) {
            return res.status(400).json({
                success: false,
                message: 'New password must be different from current password'
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await userModel.updateOne(
            { _id: req.user.userId },
            { password: hashedPassword }
        );

        await sessionModel.updateMany(
            { userId: req.user.userId, _id: { $ne: req.user.sessionId } },
            { isActive: false }
        );

        return res.status(200).json({
            success: true,
            message: 'Password updated successfully'
        });
    } catch (error) {
        console.error('Change password error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to change password',
            error: error.message
        });
    }
};

/*
 * Request email verification code for current user
*/
export const requestEmailVerification = async (req, res) => {
    try {
        const user = await userModel.findById(req.user.userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        if (user.isVerified) {
            return res.status(400).json({
                success: false,
                message: 'Email is already verified'
            });
        }

        const verificationCode = String(Math.floor(100000 + Math.random() * 900000));
        const verificationCodeExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

        await userModel.updateOne(
            { _id: req.user.userId },
            { verificationCode, verificationCodeExpiresAt }
        );

        const responsePayload = {
            success: true,
            message: 'Verification code generated. Use it to verify your email within 10 minutes.'
        };

        if (process.env.NODE_ENV !== 'production') {
            responsePayload.code = verificationCode;
        }

        return res.status(200).json(responsePayload);
    } catch (error) {
        console.error('Request email verification error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to request email verification',
            error: error.message
        });
    }
};

/*
 * Verify email with code for current user
*/
export const verifyEmailCode = async (req, res) => {
    try {
        const code = String(req.body.code || '').trim();

        if (!/^\d{6}$/.test(code)) {
            return res.status(400).json({
                success: false,
                message: 'Verification code must be a 6-digit number'
            });
        }

        const user = await userModel.findById(req.user.userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        if (user.isVerified) {
            return res.status(400).json({
                success: false,
                message: 'Email is already verified'
            });
        }

        if (!user.verificationCode || !user.verificationCodeExpiresAt) {
            return res.status(400).json({
                success: false,
                message: 'No active verification code. Request a new one.'
            });
        }

        if (new Date(user.verificationCodeExpiresAt).getTime() < Date.now()) {
            return res.status(400).json({
                success: false,
                message: 'Verification code has expired. Request a new one.'
            });
        }

        if (user.verificationCode !== code) {
            return res.status(400).json({
                success: false,
                message: 'Invalid verification code'
            });
        }

        await userModel.updateOne(
            { _id: req.user.userId },
            {
                isVerified: true,
                verificationCode: null,
                verificationCodeExpiresAt: null
            }
        );

        return res.status(200).json({
            success: true,
            message: 'Email verified successfully'
        });
    } catch (error) {
        console.error('Verify email code error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to verify email',
            error: error.message
        });
    }
};

export const getUsersByRole = async (req, res) => {
    try {
        const { role } = req.query;
        const users = await userModel.find({
            role
        });
        res.status(200).json({
            success: true,
            users
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const deleteUser = async (req, res) => {

    try {

        const { id } = req.params;

        await userModel.findByIdAndDelete(id);

        return res.status(200).json({
            success: true,
            message: "User deleted successfully"
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

export const updateUser = async (req, res) => {

    try {

        const { id } = req.params;

        const {
            email,
            courses,
            semester
        } = req.body;

        const updatedUser =
            await userModel.findByIdAndUpdate(
                id,
                {
                    email,
                    courses,
                    semester
                },
                { new: true }
            );

        return res.status(200).json({
            success: true,
            user: updatedUser
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

export const getUserById = async (req, res) => {
    try {
        const user = await userModel
            .findById(req.params.id)
            .select('username studentId email role courses semester isActive');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

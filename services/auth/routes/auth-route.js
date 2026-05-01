import express from 'express';
import {
    register,
    login,
    logout,
    refreshAccessToken,
    getCurrentUser,
    updateUsername,
    changePassword,
    requestEmailVerification,
    verifyEmailCode,
    getUserSessions,
    logoutSession,
    logoutAllSessions,
    verifyUserToken
} from '../controllers/auth-controller.js';
import { verifyToken, verifyRole } from '../middlewares/verify-token.js';

export const authRouter = express.Router();

// Public routes
authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/refresh-token', refreshAccessToken);

// Protected routes
authRouter.post('/logout', verifyToken, logout);
authRouter.post('/logout-all', verifyToken, logoutAllSessions);
authRouter.post('/logout-session/:sessionId', verifyToken, logoutSession);

authRouter.get('/me', verifyToken, getCurrentUser);
authRouter.patch('/me/username', verifyToken, updateUsername);
authRouter.post('/me/change-password', verifyToken, changePassword);
authRouter.post('/me/request-email-verification', verifyToken, requestEmailVerification);
authRouter.post('/me/verify-email', verifyToken, verifyEmailCode);
authRouter.get('/sessions', verifyToken, getUserSessions);

// Token verification endpoint (for microservices)
authRouter.get('/verify-token', verifyToken, verifyUserToken);
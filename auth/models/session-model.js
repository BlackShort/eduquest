import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    token: {
        type: String,
        required: true,
        unique: true
    },
    refreshToken: {
        type: String,
        unique: true,
        sparse: true
    },
    userAgent: {
        type: String
    },
    ipAddress: {
        type: String
    },
    deviceInfo: {
        type: String
    },
    isActive: {
        type: Boolean,
        default: true
    },
    expiresAt: {
        type: Date,
        required: true
    },
    lastActivity: {
        type: Date,
        default: Date.now
    },
    createdAt: {
        type: Date,
        default: Date.now,
        // Auto-delete expired sessions after 7 days
        expires: 604800
    }
});

// Index for faster queries
sessionSchema.index({ userId: 1 });
sessionSchema.index({ token: 1 });
sessionSchema.index({ expiresAt: 1 });

const sessionModel = mongoose.model("Session", sessionSchema);

export default sessionModel;

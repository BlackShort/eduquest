export interface ApiError {
    message: string;
    status?: number;
}

export interface TokenRefreshResponse {
    success: boolean;
    message?: string;
    accessToken?: string;
    error?: string;
}

export interface RefreshQueueItem {
    resolve: (value: string | PromiseLike<string>) => void;
    reject: (reason?: unknown) => void;
}

export class TokenRefreshError extends Error {
    readonly status?: number;
    readonly originalError?: unknown;

    constructor(
        message: string,
        status?: number,
        originalError?: unknown
    ) {
        super(message);
        this.name = 'TokenRefreshError';
        this.status = status;
        this.originalError = originalError;
    }
}

export class SessionExpiredError extends Error {
    constructor(message: string = 'Session expired. Please login again.') {
        super(message);
        this.name = 'SessionExpiredError';
    }
}
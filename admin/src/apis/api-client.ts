import axios, { AxiosError, type InternalAxiosRequestConfig, type AxiosInstance } from "axios";
import type { ApiError, RefreshQueueItem, TokenRefreshResponse } from "@/types/error";
import { TokenRefreshError, SessionExpiredError } from "@/types/error";

// Extended request config with retry flag
interface RetryableConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
}

// Queue management for pending requests during token refresh
class RefreshTokenQueue {
    private queue: RefreshQueueItem[] = [];
    private isRefreshing: boolean = false;

    isRefreshingInProgress(): boolean {
        return this.isRefreshing;
    }

    setRefreshing(value: boolean): void {
        this.isRefreshing = value;
    }

    add(item: RefreshQueueItem): void {
        this.queue.push(item);
    }

    processSuccess(token: string): void {
        this.queue.forEach((item) => {
            item.resolve(token);
        });
        this.clear();
    }

    processError(error: unknown): void {
        this.queue.forEach((item) => {
            item.reject(error);
        });
        this.clear();
    }

    private clear(): void {
        this.queue = [];
    }

    getQueueLength(): number {
        return this.queue.length;
    }
}

// Singleton instance for token refresh queue
const refreshQueue = new RefreshTokenQueue();

// Type guards
const isTokenRefreshResponse = (data: unknown): data is TokenRefreshResponse => {
    return (
        typeof data === 'object' &&
        data !== null &&
        'success' in data &&
        typeof (data as Record<string, unknown>).success === 'boolean'
    );
};

const isAxiosError = (error: unknown): error is AxiosError => {
    return error instanceof AxiosError;
};

const getErrorMessage = (error: unknown): string => {
    if (isAxiosError(error)) {
        const data = error.response?.data;
        if (typeof data === 'object' && data !== null && 'message' in data) {
            return (data as Record<string, unknown>).message as string;
        }
        return error.message;
    }
    if (error instanceof Error) {
        return error.message;
    }
    return 'Unknown error occurred';
};

export const createApi = (baseURL: string): AxiosInstance => {
    const api = axios.create({
        baseURL,
        withCredentials: true,
        headers: {
            "Content-Type": "application/json",
        },
    });

    api.interceptors.response.use(
        (res) => res,
        async (error: unknown): Promise<never> => {
            // Type guard for AxiosError
            if (!isAxiosError(error)) {
                const apiError: ApiError = {
                    message: getErrorMessage(error),
                    status: undefined,
                };
                return Promise.reject(apiError);
            }

            const originalRequest = error.config as RetryableConfig;

            // Don't attempt refresh for verify-token endpoint (it's expected to return 401 when not logged in)
            const isVerifyTokenRequest = originalRequest.url?.includes('/verify-token');

            // Check if this is a 401 Unauthorized error
            if (error.response?.status === 401 && !originalRequest._retry && !isVerifyTokenRequest) {
                try {
                    // If already refreshing, queue this request
                    if (refreshQueue.isRefreshingInProgress()) {
                        return new Promise<unknown>((resolve, reject) => {
                            const queueItem: RefreshQueueItem = { resolve, reject };
                            refreshQueue.add(queueItem);
                        })
                            .then((token) => {
                                if (typeof token === 'string' && originalRequest.headers) {
                                    return api(originalRequest);
                                }
                                throw new SessionExpiredError();
                            });
                    }

                    // Mark as refresh in progress
                    refreshQueue.setRefreshing(true);
                    originalRequest._retry = true;

                    // Attempt to refresh token
                    const response = await axios.post<TokenRefreshResponse>(
                    `${baseURL}/v1/refresh-token`,
                        {},
                        { withCredentials: true }
                    );

                    const refreshData = response.data;

                    // Validate refresh response using type guard
                    if (!isTokenRefreshResponse(refreshData)) {
                        throw new TokenRefreshError(
                            'Invalid refresh token response format',
                            response.status,
                            refreshData
                        );
                    }

                    if (!refreshData.success) {
                        throw new TokenRefreshError(
                            refreshData.message || 'Failed to refresh token',
                            response.status
                        );
                    }

                    if (!refreshData.accessToken) {
                        throw new TokenRefreshError(
                            'No access token in refresh response',
                            response.status
                        );
                    }

                    // Token refresh successful
                    refreshQueue.processSuccess(refreshData.accessToken);

                    // Retry original request with new token
                    return api(originalRequest);

                } catch (refreshError: unknown) {
                    // Token refresh failed
                    const errorMessage = getErrorMessage(refreshError);
                    const refreshTokenError = new TokenRefreshError(
                        errorMessage,
                        isAxiosError(refreshError) ? refreshError.response?.status : undefined,
                        refreshError
                    );

                    refreshQueue.processError(refreshTokenError);

                    // Redirect to login page
                    window.location.href = '/auth/login';

                    return Promise.reject(
                        new SessionExpiredError(
                            'Session expired. Please login again.'
                        )
                    );

                } finally {
                    refreshQueue.setRefreshing(false);
                }
            }

            // Handle other errors
            const errorMessage = getErrorMessage(error);
            const apiError: ApiError = {
                message: errorMessage,
                status: error.response?.status,
            };

            return Promise.reject(apiError);
        }
    );

    return api;
};
import axios, { AxiosError } from 'axios';

const API_URL = import.meta.env.VITE_AUTH_URL ?? 'http://localhost:5001';

// Create axios instance with default config
const authApi = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Unwrap server error messages so callers always get a meaningful string.
authApi.interceptors.response.use(
    (res) => res,
    (error: AxiosError<{ message?: string }>) => {
        const message = error.response?.data?.message ?? error.message ?? 'An unknown error occurred';
        return Promise.reject(new Error(message));
    }
);

export const login = async (email: string, password: string) => {
    const response = await authApi.post('/v1/login', { email, password });
    return response.data;
}

export const register = async (username: string, email: string, password: string) => {
    const response = await authApi.post('/v1/register', { username, email, password });
    return response.data;
}

export const logout = async () => {
    const response = await authApi.post('/v1/logout');
    return response.data;
}
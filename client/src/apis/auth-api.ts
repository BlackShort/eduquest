import { authUrl } from '@/apis/server-api';
import { createApi } from "@/apis/api-client";

const authApi = createApi(authUrl);

export const login = async (email: string, password: string) => {
    const { data } = await authApi.post("/v1/login", { email, password });
    return data;
};

export const register = async (email: string, password: string) => {
    const { data } = await authApi.post("/v1/register", { email, password });
    return data;
};

export const logout = async () => {
    const { data } = await authApi.post("/v1/logout");
    return data;
};

export const verifyToken = async () => {
    const { data } = await authApi.get("/v1/verify-token");
    return data;
};

export const getCurrentUser = async () => {
    const { data } = await authApi.get("/v1/me");
    return data;
};

export const updateUsername = async (username: string) => {
    const { data } = await authApi.patch("/v1/me/username", { username });
    return data;
};

export const changePassword = async (
    currentPassword: string,
    newPassword: string,
    confirmPassword: string
) => {
    const { data } = await authApi.post("/v1/me/change-password", {
        currentPassword,
        newPassword,
        confirmPassword,
    });
    return data;
};

export const requestEmailVerification = async () => {
    const { data } = await authApi.post("/v1/me/request-email-verification");
    return data;
};

export const verifyEmailCode = async (code: string) => {
    const { data } = await authApi.post("/v1/me/verify-email", { code });
    return data;
};

export const refreshAccessToken = async () => {
    const { data } = await authApi.post("/v1/refresh-token");
    return data;
};
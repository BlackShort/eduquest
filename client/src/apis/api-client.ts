import axios, { AxiosError } from "axios";
import type { ApiError } from "@/types/error";

export const createApi = (baseURL: string) => {
    const api = axios.create({
        baseURL,
        withCredentials: true,
        headers: {
            "Content-Type": "application/json",
        },
    });

    api.interceptors.response.use(
        (res) => res,
        (error: AxiosError<{ message?: string }>) => {
            const apiError: ApiError = {
                message:
                    error.response?.data?.message ||
                    error.message ||
                    "Something went wrong",
                status: error.response?.status,
            };
            return Promise.reject(apiError);
        }
    );

    return api;
};
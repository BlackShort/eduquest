import axios, { AxiosError } from "axios";

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
            const message =
                error.response?.data?.message ||
                error.message ||
                "Something went wrong";
            return Promise.reject(new Error(message));
        }
    );

    return api;
};
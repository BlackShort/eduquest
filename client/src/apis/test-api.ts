import { createApi } from "./api-client";

const api = createApi("http://localhost:5002"); // 👈 your backend URL

export const getAllTests = async () => {
  return api.get("/v1/tests/public");
};
import { createApi } from "./api-client";
import { contentUrl } from "@/apis/server-api";

const api = createApi(contentUrl);

export const getAllTests = async () => {
  return api.get("/v1/faculty/tests/public");
};

export const getTestById = async (id: string) => {
  return api.get(`/v1/faculty/tests/public/${id}`);
};

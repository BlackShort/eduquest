import { createApi } from "@/apis/api-client";
import { contentUrl } from "@/apis/server-api";

const assignmentApi = createApi(contentUrl);

export const getAssignmentByIds = async (ids: string[]) => {
  const { data } = await assignmentApi.post("/assignment/bulk", { ids });
  return data;
};
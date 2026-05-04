import { createApi } from "@/apis/api-client";
import { contentUrl } from "@/apis/server-api";

const mcqApi = createApi(contentUrl);

export const getMcqByIds = async (ids: string[]) => {
  const { data } = await mcqApi.post("/mcq/bulk", { ids });
  return data;
};
import { createApi } from "@/apis/api-client";
import { contentUrl } from "@/apis/server-api";

const mcqApi = createApi(contentUrl);

export const getMcqByIds = async (ids: string[]) => {
  const { data } = await mcqApi.post("/v1/mcq/bulk", { ids });
  return data;
};

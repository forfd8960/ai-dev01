import { apiClient, type ApiResponse } from "../lib/api";
import type { Tag } from "../types/tag";

export interface TagQueryParams {
  sort?: "usage_desc" | "name_asc";
}

export async function fetchTags(params?: TagQueryParams): Promise<Tag[]> {
  const response = await apiClient.get("/tags", {
    params: {
      sort: params?.sort,
    },
  });
  const payload = response.data as ApiResponse<Tag[]>;
  return payload.data;
}

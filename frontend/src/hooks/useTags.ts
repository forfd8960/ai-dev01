import { useQuery } from "@tanstack/react-query";

import { fetchTags } from "../services/tagService";

export function useTags() {
  return useQuery({
    queryKey: ["tags"],
    queryFn: () => fetchTags({ sort: "name_asc" }),
    staleTime: 60_000,
  });
}

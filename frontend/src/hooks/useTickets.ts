import { useQuery } from "@tanstack/react-query";
import { shallow } from "zustand/shallow";

import { fetchTickets } from "../services/ticketService";
import type { TicketList } from "../types/ticket";
import { useFilterStore } from "../store/filterStore";

export function useTickets() {
  const filters = useFilterStore(
    (state) => ({
      page: state.page,
      limit: state.limit,
      search: state.search,
      tags: state.selectedTags,
      status: state.status,
      priority: state.priority,
      sort: state.sort,
    }),
    shallow
  );

  return useQuery<TicketList>({
    queryKey: [
      "tickets",
      filters.page,
      filters.limit,
      filters.search,
      filters.tags.join(","),
      filters.status,
      filters.priority,
      filters.sort,
    ],
    queryFn: () =>
      fetchTickets({
        page: filters.page,
        limit: filters.limit,
        search: filters.search,
        tags: filters.tags,
        status: filters.status,
        priority: filters.priority,
        sort: filters.sort,
      }),
    keepPreviousData: true,
  });
}

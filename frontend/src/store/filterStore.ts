import { create } from "zustand";

import type { TicketPriority, TicketStatus } from "../types/ticket";

type StatusFilter = TicketStatus | "all";
type PriorityFilter = TicketPriority | "all";

interface FilterState {
  search: string;
  selectedTags: string[];
  status: StatusFilter;
  priority: PriorityFilter;
  sort: "created_at" | "created_at_asc" | "updated_at" | "updated_at_asc";
  page: number;
  limit: number;
  setSearch(value: string): void;
  toggleTag(tag: string): void;
  clearTags(): void;
  setStatus(value: StatusFilter): void;
  setPriority(value: PriorityFilter): void;
  setSort(value: FilterState["sort"]): void;
  setPage(page: number): void;
  reset(): void;
}

type StoreSetter = (
  partial:
    | FilterState
    | Partial<FilterState>
    | ((state: FilterState) => FilterState | Partial<FilterState>),
  replace?: boolean
) => void;

export const useFilterStore = create<FilterState>((set: StoreSetter) => ({
  search: "",
  selectedTags: [],
  status: "all",
  priority: "all",
  sort: "created_at",
  page: 1,
  limit: 10,
  setSearch: (value: string) =>
    set((state: FilterState) => ({
      search: value,
      page: value !== state.search ? 1 : state.page,
    })),
  toggleTag: (tag: string) =>
    set((state: FilterState) => {
      const exists = state.selectedTags.includes(tag);
      const selectedTags = exists
        ? state.selectedTags.filter((item: string) => item !== tag)
        : [...state.selectedTags, tag];
      return {
        selectedTags,
        page: 1,
      };
    }),
  clearTags: () => set({ selectedTags: [], page: 1 }),
  setStatus: (value: StatusFilter) => set({ status: value, page: 1 }),
  setPriority: (value: PriorityFilter) => set({ priority: value, page: 1 }),
  setSort: (value: FilterState["sort"]) => set({ sort: value, page: 1 }),
  setPage: (page: number) => set({ page: Math.max(1, page) }),
  reset: () =>
    set({
      search: "",
      selectedTags: [],
      status: "all",
      priority: "all",
      sort: "created_at",
      page: 1,
      limit: 10,
    }),
}));

import { useFilterStore } from "../../store/filterStore";
import { Button } from "../ui/button";
import { SearchBar } from "./SearchBar";
import { StatusFilter } from "./StatusFilter";
import { PriorityFilter } from "./PriorityFilter";
import { TagFilter } from "./TagFilter";

const SORT_OPTIONS: Array<{ label: string; value: "created_at" | "created_at_asc" | "updated_at" | "updated_at_asc" }> = [
  { label: "Newest", value: "created_at" },
  { label: "Oldest", value: "created_at_asc" },
  { label: "Recently Updated", value: "updated_at" },
  { label: "Least Recently Updated", value: "updated_at_asc" },
];

export const FilterPanel = () => {
  const sort = useFilterStore((state: any) => state.sort) as string;
  const setSort = useFilterStore((state: any) => state.setSort) as (value: string) => void;
  const reset = useFilterStore((state: any) => state.reset) as () => void;

  return (
    <div className="space-y-6 rounded-lg border bg-card p-4 shadow-sm">
      <SearchBar />
      <div className="space-y-2">
        <label className="text-sm font-semibold text-muted-foreground" htmlFor="sort-order">
          Sort By
        </label>
        <select
          id="sort-order"
          value={sort}
          onChange={(event: any) => setSort(event.target.value)}
          className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
      <StatusFilter />
      <PriorityFilter />
      <TagFilter />
      <Button variant="secondary" className="w-full" onClick={() => reset()}>
        Reset Filters
      </Button>
    </div>
  );
};

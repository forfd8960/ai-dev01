import * as React from "react";
import { Search } from "lucide-react";

import { Input } from "../ui/input";
import { useFilterStore } from "../../store/filterStore";

const DEBOUNCE_DELAY = 400;

export const SearchBar = () => {
  const search = useFilterStore((state) => state.search);
  const setSearch = useFilterStore((state) => state.setSearch);
  const [value, setValue] = React.useState(search);

  React.useEffect(() => {
    setValue(search);
  }, [search]);

  React.useEffect(() => {
    const id = window.setTimeout(() => {
      if (value !== search) {
        setSearch(value.trim());
      }
    }, DEBOUNCE_DELAY);
    return () => window.clearTimeout(id);
  }, [value, setSearch, search]);

  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-muted-foreground" htmlFor="ticket-search">
        Search Tickets
      </label>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
        <Input
          id="ticket-search"
          placeholder="Search by title..."
          className="pl-9"
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
      </div>
    </div>
  );
};

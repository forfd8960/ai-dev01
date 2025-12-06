import { ChevronLeft, ChevronRight } from "lucide-react";

import { useFilterStore } from "../../store/filterStore";
import { Button } from "../ui/button";

interface PaginationProps {
  total: number;
  page: number;
  limit: number;
  isLoading?: boolean;
}

export const Pagination = ({ total, page, limit, isLoading }: PaginationProps) => {
  const setPage = useFilterStore((state: any) => state.setPage) as (value: number) => void;
  const totalPages = Math.max(1, Math.ceil(total / Math.max(limit, 1)));
  const canPrevious = page > 1;
  const canNext = page < totalPages;

  return (
    <div className="flex items-center justify-between border-t pt-4">
      <p className="text-sm text-muted-foreground">
        Page {page} of {totalPages} · {total} tickets
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={!canPrevious || isLoading}
          onClick={() => canPrevious && setPage(page - 1)}
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={!canNext || isLoading}
          onClick={() => canNext && setPage(page + 1)}
        >
          Next
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
};

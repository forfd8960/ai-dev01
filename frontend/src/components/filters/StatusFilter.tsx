import { useFilterStore } from "../../store/filterStore";
import type { TicketStatus } from "../../types/ticket";
import { Button } from "../ui/button";

const STATUS_OPTIONS: Array<{ value: TicketStatus | "all"; label: string }> = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "completed", label: "Completed" },
];

export const StatusFilter = () => {
  const status = useFilterStore((state) => state.status);
  const setStatus = useFilterStore((state) => state.setStatus);

  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold text-muted-foreground">Status</p>
      <div className="flex flex-wrap gap-2">
        {STATUS_OPTIONS.map((option) => (
          <Button
            key={option.value}
            variant={status === option.value ? "default" : "outline"}
            size="sm"
            onClick={() => setStatus(option.value)}
          >
            {option.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

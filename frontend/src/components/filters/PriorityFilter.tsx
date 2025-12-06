import { useFilterStore } from "../../store/filterStore";
import type { TicketPriority } from "../../types/ticket";
import { Button } from "../ui/button";

const PRIORITY_OPTIONS: Array<{ value: TicketPriority | "all"; label: string }> = [
  { value: "all", label: "All" },
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

export const PriorityFilter = () => {
  const priority = useFilterStore((state) => state.priority);
  const setPriority = useFilterStore((state) => state.setPriority);

  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold text-muted-foreground">Priority</p>
      <div className="flex flex-wrap gap-2">
        {PRIORITY_OPTIONS.map((option) => (
          <Button
            key={option.value}
            variant={priority === option.value ? "default" : "outline"}
            size="sm"
            onClick={() => setPriority(option.value)}
          >
            {option.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

import { Loader2 } from "lucide-react";
import type { Ticket, TicketStatus } from "../../types/ticket";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { TicketCard } from "./TicketCard";
import { Pagination } from "./Pagination";

interface TicketListProps {
  tickets: Ticket[];
  total: number;
  page: number;
  limit: number;
  isLoading: boolean;
  isFetching: boolean;
  onEdit(ticket: Ticket): void;
  onDelete(ticket: Ticket): void;
  onToggleStatus(ticket: Ticket, nextStatus: TicketStatus): void;
  onCreateClick(): void;
  statusPendingId?: number | null;
  deletePendingId?: number | null;
}

const PLACEHOLDER_COUNT = 3;

export const TicketList = ({
  tickets,
  total,
  page,
  limit,
  isLoading,
  isFetching,
  onEdit,
  onDelete,
  onToggleStatus,
  onCreateClick,
  statusPendingId,
  deletePendingId,
}: TicketListProps) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 border-b pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Tickets</h2>
          <p className="text-sm text-muted-foreground">Manage your tasks, status, and related tags.</p>
        </div>
        <div className="flex items-center gap-3">
          {isFetching && !isLoading ? (
            <div className="inline-flex items-center gap-2 rounded-md border border-dashed px-3 py-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Refreshing…
            </div>
          ) : null}
          <Button onClick={() => onCreateClick()}>New Ticket</Button>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: PLACEHOLDER_COUNT }).map((_, index) => (
            <Skeleton key={index} className="h-32 w-full" />
          ))}
        </div>
      ) : tickets.length === 0 ? (
        <div className="rounded-lg border border-dashed bg-card p-8 text-center">
          <p className="text-lg font-semibold text-foreground">No tickets found</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Try adjusting filters or creating your first ticket.
          </p>
          <Button className="mt-4" onClick={() => onCreateClick()}>
            Create Ticket
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {tickets.map((ticket) => (
            <div key={ticket.id}>
              <TicketCard
                ticket={ticket}
                onEdit={onEdit}
                onDelete={onDelete}
                onToggleStatus={onToggleStatus}
                isStatusUpdating={statusPendingId === ticket.id}
                isDeleting={deletePendingId === ticket.id}
              />
            </div>
          ))}
        </div>
      )}

      <Pagination total={total} page={page} limit={limit} isLoading={isLoading} />
    </div>
  );
};

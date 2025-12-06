import { CheckCircle2, Circle, Loader2, Pencil, Trash2 } from "lucide-react";

import { formatDateTime, formatRelativeTime } from "../../lib/utils";
import type { Ticket, TicketPriority, TicketStatus } from "../../types/ticket";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

interface TicketCardProps {
  ticket: Ticket;
  onEdit(ticket: Ticket): void;
  onDelete(ticket: Ticket): void;
  onToggleStatus(ticket: Ticket, nextStatus: TicketStatus): void;
  isStatusUpdating?: boolean;
  isDeleting?: boolean;
}

const PRIORITY_LABELS: Record<TicketPriority, { label: string; className: string }> = {
  low: { label: "Low", className: "bg-emerald-50 text-emerald-700" },
  medium: { label: "Medium", className: "bg-amber-50 text-amber-700" },
  high: { label: "High", className: "bg-rose-50 text-rose-700" },
};

export const TicketCard = ({
  ticket,
  onEdit,
  onDelete,
  onToggleStatus,
  isStatusUpdating,
  isDeleting,
}: TicketCardProps) => {
  const StatusIcon = ticket.status === "completed" ? CheckCircle2 : Circle;
  const nextStatus: TicketStatus = ticket.status === "completed" ? "pending" : "completed";

  return (
    <article className="group rounded-lg border bg-card p-5 shadow-sm transition hover:shadow-md">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground"
              onClick={() => onToggleStatus(ticket, nextStatus)}
              disabled={isStatusUpdating}
              aria-label={`Mark as ${nextStatus}`}
            >
              {isStatusUpdating ? (
                <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
              ) : (
                <StatusIcon className="h-5 w-5" aria-hidden="true" />
              )}
            </Button>
            <div>
              <h3 className="text-lg font-semibold text-foreground">{ticket.title}</h3>
              <p className="text-sm text-muted-foreground">
                Updated {formatRelativeTime(ticket.updated_at)} · Created {formatDateTime(ticket.created_at)}
              </p>
            </div>
          </div>
          {ticket.description ? <p className="text-sm text-foreground/80">{ticket.description}</p> : null}
          <div className="flex flex-wrap items-center gap-2">
            <Badge className={PRIORITY_LABELS[ticket.priority].className}>
              {PRIORITY_LABELS[ticket.priority].label}
            </Badge>
            {ticket.tags.map((tag) => (
              <Badge key={tag.id} variant="outline">
                {tag.name}
              </Badge>
            ))}
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => onEdit(ticket)}>
            <Pencil className="mr-2 h-4 w-4" aria-hidden="true" /> Edit
          </Button>
          <Button variant="destructive" size="sm" onClick={() => onDelete(ticket)} disabled={isDeleting}>
            {isDeleting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <Trash2 className="mr-2 h-4 w-4" aria-hidden="true" />
            )}
            Delete
          </Button>
        </div>
      </div>
    </article>
  );
};

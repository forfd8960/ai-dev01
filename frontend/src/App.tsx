import * as React from "react";

import { AppLayout } from "./components/layout/AppLayout";
import { FilterPanel } from "./components/filters/FilterPanel";
import { TicketDialog } from "./components/tickets/TicketDialog";
import { TicketList } from "./components/tickets/TicketList";
import { useTickets } from "./hooks/useTickets";
import { useTags } from "./hooks/useTags";
import { useTicketMutations } from "./hooks/useTicketMutations";
import { useToast } from "./components/ui/toast";
import type { Ticket, TicketFormValues, TicketList as TicketListResponse } from "./types/ticket";

const HEADER = (
  <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
    <div>
      <h1 className="text-xl font-semibold tracking-tight">Ticket Dashboard</h1>
      <p className="text-sm text-muted-foreground">Track work, manage tags, and monitor progress.</p>
    </div>
  </div>
);

export default function App() {
  const ticketsQuery = useTickets();
  const ticketData = ticketsQuery.data as TicketListResponse | undefined;
  const isLoading = ticketsQuery.isLoading;
  const isFetching = ticketsQuery.isFetching;
  const { data: allTags = [] } = useTags();
  const mutations = useTicketMutations();
  const { toast: pushToast } = useToast();

  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editingTicket, setEditingTicket] = React.useState(null as Ticket | null);
  const [statusPendingId, setStatusPendingId] = React.useState(null as number | null);
  const [deletePendingId, setDeletePendingId] = React.useState(null as number | null);

  const openCreateDialog = () => {
    setEditingTicket(null);
    setDialogOpen(true);
  };

  const openEditDialog = (ticket: Ticket) => {
    setEditingTicket(ticket);
    setDialogOpen(true);
  };

  const handleDialogSubmit = async (values: TicketFormValues) => {
    try {
      if (editingTicket) {
        await mutations.updateTicketMutation.mutateAsync({
          ticketId: editingTicket.id,
          payload: {
            title: values.title,
            description: values.description,
            priority: values.priority,
          },
        });

        const existingIds = editingTicket.tags.map((tag: any) => tag.id);
        const selectedIds = values.tagIds;

        const toAddIds = selectedIds.filter((id: number) => !existingIds.includes(id));
        const toRemoveIds = existingIds.filter((id: number) => !selectedIds.includes(id));

        if (toAddIds.length > 0 || values.newTagNames.length > 0) {
          await mutations.addTagsMutation.mutateAsync({
            ticketId: editingTicket.id,
            tagIds: toAddIds,
            tagNames: values.newTagNames,
          });
        }

        for (const tagId of toRemoveIds) {
          await mutations.removeTagMutation.mutateAsync({ ticketId: editingTicket.id, tagId });
        }

        pushToast({
          title: "Ticket updated",
          description: "Changes saved successfully.",
          variant: "success",
        });
      } else {
        const created = await mutations.createTicketMutation.mutateAsync({
          title: values.title,
          description: values.description,
          priority: values.priority,
        });

        if (values.tagIds.length > 0 || values.newTagNames.length > 0) {
          await mutations.addTagsMutation.mutateAsync({
            ticketId: created.id,
            tagIds: values.tagIds,
            tagNames: values.newTagNames,
          });
        }

        pushToast({
          title: "Ticket created",
          description: "The ticket is now available in the list.",
          variant: "success",
        });
      }
    } catch (error: any) {
      pushToast({
        title: "Action failed",
        description: error?.message ?? "Unable to complete request.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleToggleStatus = async (ticket: Ticket, nextStatus: Ticket["status"]) => {
    try {
      setStatusPendingId(ticket.id);
      await mutations.updateStatusMutation.mutateAsync({ ticketId: ticket.id, status: nextStatus });
      pushToast({
        title: "Status updated",
        description: `Ticket marked as ${nextStatus}.`,
        variant: "success",
      });
    } catch (error: any) {
      pushToast({
        title: "Failed to update status",
        description: error?.message ?? "Please try again.",
        variant: "destructive",
      });
    } finally {
      setStatusPendingId(null);
    }
  };

  const handleDelete = async (ticket: Ticket) => {
    if (!window.confirm(`Delete ticket "${ticket.title}"?`)) {
      return;
    }
    try {
      setDeletePendingId(ticket.id);
      await mutations.deleteTicketMutation.mutateAsync(ticket.id);
      pushToast({
        title: "Ticket removed",
        description: "The ticket has been deleted.",
        variant: "success",
      });
    } catch (error: any) {
      pushToast({
        title: "Failed to delete",
        description: error?.message ?? "Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeletePendingId(null);
    }
  };

  return (
    <AppLayout header={HEADER} sidebar={<FilterPanel />}>
      <TicketList
        tickets={ticketData?.items ?? []}
        total={ticketData?.total ?? 0}
        page={ticketData?.page ?? 1}
        limit={ticketData?.limit ?? 10}
        isLoading={isLoading}
        isFetching={isFetching}
        onEdit={openEditDialog}
        onDelete={handleDelete}
        onToggleStatus={(ticket, nextStatus) => handleToggleStatus(ticket, nextStatus)}
        onCreateClick={openCreateDialog}
        statusPendingId={statusPendingId}
        deletePendingId={deletePendingId}
      />
      <TicketDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initialData={editingTicket}
        availableTags={allTags}
        onSubmit={handleDialogSubmit}
        isSubmitting={mutations.createTicketMutation.isPending || mutations.updateTicketMutation.isPending}
      />
    </AppLayout>
  );
}

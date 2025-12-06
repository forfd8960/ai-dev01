import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  addTagsToTicket,
  createTicket,
  deleteTicket,
  deleteTicketsBatch,
  removeTagFromTicket,
  updateTicket,
  updateTicketStatus,
} from "../services/ticketService";
import type { TicketPayload, TicketStatus } from "../types/ticket";

export function useTicketMutations() {
  const queryClient = useQueryClient();

  const invalidateTickets = () => queryClient.invalidateQueries({ queryKey: ["tickets"] });
  const invalidateTags = () => queryClient.invalidateQueries({ queryKey: ["tags"] });

  const createTicketMutation = useMutation({
    mutationFn: (payload: TicketPayload) => createTicket(payload),
    onSuccess: () => {
      invalidateTickets();
      invalidateTags();
    },
  });

  const updateTicketMutation = useMutation({
    mutationFn: ({ ticketId, payload }: { ticketId: number; payload: Partial<TicketPayload> }) =>
      updateTicket(ticketId, payload),
    onSuccess: () => invalidateTickets(),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ ticketId, status }: { ticketId: number; status: TicketStatus }) =>
      updateTicketStatus(ticketId, status),
    onSuccess: () => invalidateTickets(),
  });

  const deleteTicketMutation = useMutation({
    mutationFn: (ticketId: number) => deleteTicket(ticketId),
    onSuccess: () => {
      invalidateTickets();
      invalidateTags();
    },
  });

  const deleteBatchMutation = useMutation({
    mutationFn: (ids: number[]) => deleteTicketsBatch(ids),
    onSuccess: () => {
      invalidateTickets();
      invalidateTags();
    },
  });

  const addTagsMutation = useMutation({
    mutationFn: addTagsToTicket,
    onSuccess: () => {
      invalidateTickets();
      invalidateTags();
    },
  });

  const removeTagMutation = useMutation({
    mutationFn: ({ ticketId, tagId }: { ticketId: number; tagId: number }) =>
      removeTagFromTicket(ticketId, tagId),
    onSuccess: () => {
      invalidateTickets();
      invalidateTags();
    },
  });

  return {
    createTicketMutation,
    updateTicketMutation,
    updateStatusMutation,
    deleteTicketMutation,
    deleteBatchMutation,
    addTagsMutation,
    removeTagMutation,
  };
}

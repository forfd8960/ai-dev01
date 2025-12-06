import { apiClient, type ApiResponse } from "../lib/api";
import type { Ticket, TicketFormValues, TicketList, TicketPayload, TicketPriority, TicketStatus } from "../types/ticket";

export interface TicketQueryParams {
  page: number;
  limit: number;
  search?: string;
  tags?: string[];
  status?: TicketStatus | "all";
  priority?: TicketPriority | "all";
  sort?: string;
}

export async function fetchTickets(params: TicketQueryParams): Promise<TicketList> {
  const { page, limit, search, tags, status, priority, sort } = params;
  const response = await apiClient.get("/tickets", {
    params: {
      page,
      limit,
      search: search || undefined,
      tags: tags && tags.length > 0 ? tags.join(",") : undefined,
      status: status && status !== "all" ? status : undefined,
      priority: priority && priority !== "all" ? priority : undefined,
      sort: sort || undefined,
    },
  });
  const payload = response.data as ApiResponse<TicketList>;
  return payload.data;
}

export async function createTicket(payload: TicketPayload): Promise<Ticket> {
  const response = await apiClient.post("/tickets", payload);
  const body = response.data as ApiResponse<Ticket>;
  return body.data;
}

export async function updateTicket(ticketId: number, payload: Partial<TicketPayload>): Promise<Ticket> {
  const response = await apiClient.put(`/tickets/${ticketId}`, payload);
  const body = response.data as ApiResponse<Ticket>;
  return body.data;
}

export async function updateTicketStatus(ticketId: number, status: TicketStatus): Promise<Ticket> {
  const response = await apiClient.patch(`/tickets/${ticketId}/status`, { status });
  const body = response.data as ApiResponse<Ticket>;
  return body.data;
}

export async function deleteTicket(ticketId: number): Promise<void> {
  await apiClient.delete(`/tickets/${ticketId}`);
}

export async function deleteTicketsBatch(ids: number[]): Promise<number> {
  const response = await apiClient.delete("/tickets/batch", {
    data: { ids },
  });
  const body = response.data as ApiResponse<{ deleted: number }>;
  return body.data.deleted;
}

export interface TicketTagPayload {
  ticketId: number;
  tagIds?: number[];
  tagNames?: string[];
}

export async function addTagsToTicket(payload: TicketTagPayload): Promise<void> {
  const { ticketId, tagIds, tagNames } = payload;
  await apiClient.post(`/tickets/${ticketId}/tags`, {
    tag_ids: tagIds && tagIds.length > 0 ? tagIds : undefined,
    tag_names: tagNames && tagNames.length > 0 ? tagNames : undefined,
  });
}

export async function removeTagFromTicket(ticketId: number, tagId: number): Promise<void> {
  await apiClient.delete(`/tickets/${ticketId}/tags/${tagId}`);
}

export type TicketMutationInput = TicketFormValues;

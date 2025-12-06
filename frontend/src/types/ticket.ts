import type { Tag } from "./tag";

export type TicketPriority = "low" | "medium" | "high";
export type TicketStatus = "pending" | "completed";

export interface Ticket {
  id: number;
  title: string;
  description?: string | null;
  priority: TicketPriority;
  status: TicketStatus;
  created_at: string;
  updated_at: string;
  tags: Tag[];
}

export interface TicketList {
  items: Ticket[];
  total: number;
  page: number;
  limit: number;
}

export interface TicketPayload {
  title: string;
  description?: string | null;
  priority: TicketPriority;
}

export interface TicketFormValues extends TicketPayload {
  tagIds: number[];
  newTagNames: string[];
}

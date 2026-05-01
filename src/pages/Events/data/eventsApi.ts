import { httpClient } from "@/lib/api/httpClient";
import type { Event } from "../types";

export type ListEventsParams = {
  page?: number;
  size?: number;
  search?: string;
  status?: string;
  category?: string;
};

export type AdminEventCardItemDto = {
  eventId: string;
  title: string;
  description: string;
  location: string;
  startDate: string;
  endDate?: string | null;
  imageUrl?: string | null;
  category?: string | null;
  workflowStatus?: string | null;
  uiStatus?: string | null;
  organizerId?: string | null;
  organizerName?: string | null;
  hostName?: string | null;
  currentAttendees?: number | null;
  maxAttendees?: number | null;
  occupancyPercent?: number | null;
  recurring?: boolean | null;
  createdAt?: string | null;
  canApprove?: boolean | null;
  canReject?: boolean | null;
};

export type ListEventsResponse = {
  events: AdminEventCardItemDto[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
  summary?: {
    totalCount: number;
    pendingCount: number;
    approvedCount: number;
    ongoingCount: number;
    completedCount: number;
    rejectedCount: number;
  };
  pendingApproval?: {
    pendingCount: number;
    topPendingEvent?: AdminEventCardItemDto | null;
  };
};

export type AdminCreateEventPayload = {
  organizerId?: string;
  title: string;
  description: string;
  location: string;
  startDate?: string;
  endDate?: string;
  imageUrl?: string;
  hostName?: string;
  price?: number;
  maxAttendees?: number;
  category?: string;
  hostRole?: string;
  contactPhone?: string;
  latitude?: number;
  longitude?: number;
  date?: string;
  time?: string;
  duration?: number;
  durationUnit?: "HOUR" | "DAY";
  tags?: string[] | string;
  recurringEvent?: boolean;
};

export const eventsApi = {
  listEvents(params?: ListEventsParams) {
    return httpClient.get<ListEventsResponse>("/v1/admin/events", { params });
  },

  createEvent(payload: AdminCreateEventPayload) {
    return httpClient.post<{ eventId: string; message?: string }>(
      "/v1/admin/events",
      payload,
    );
  },

  notifyResidents(eventId: string) {
    return httpClient.post(`/v1/admin/events/${eventId}/notify-residents`);
  },

  deleteEvent(eventId: string) {
    return httpClient.delete(`/v1/admin/events/${eventId}`);
  },

  updateEvent(eventId: string, payload: Partial<Event>) {
    return httpClient.patch(`/v1/admin/events/${eventId}`, payload);
  },

  rejectEvent(eventId: string) {
    return httpClient.patch(`/v1/admin/events/${eventId}/reject`);
  },

  completeEvent(eventId: string) {
    return httpClient.patch(`/v1/admin/events/${eventId}/complete`);
  },

  approveEvent(eventId: string) {
    return httpClient.patch(`/v1/admin/events/${eventId}/approve`);
  },

  getEventDetails(eventId: string) {
    return httpClient.get<Event>(`/v1/admin/events/${eventId}/details`);
  },

  exportAttendees(eventId: string) {
    return httpClient.get(`/v1/admin/events/${eventId}/attendees/export`, {
      responseType: "blob",
    });
  },

  listStatuses() {
    return httpClient.get<string[]>("/v1/admin/events/statuses");
  },

  listCategories() {
    return httpClient.get<string[]>("/v1/admin/events/categories");
  },
};

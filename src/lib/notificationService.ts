// src/lib/notificationService.ts

import { apiFetch } from "./authService";

const BASE_URL = "/v1/notifications";

// ─── Types ───────────────────────────────────────────────────────────────────

export type NotificationStatus = "PENDING" | "SENT" | "FAILED" | "READ";
export type NotificationChannel = "PUSH" | "EMAIL" | "SMS";
export type NotificationType =
  | "MAINTENANCE_UPDATE"
  | "PAYMENT_REMINDER"
  | "EVENT_REMINDER"
  | "ANNOUNCEMENT"
  | "GENERAL";

export interface NotificationAPI {
  id: string;
  recipientId: string;
  title: string;
  body: string;
  type: NotificationType;
  referenceId: string;
  channel: NotificationChannel;
  status: NotificationStatus;
  sentAt: string;
  readAt: string | null;
  failureReason: string | null;
  isUrgent: boolean;
}

export interface SendNotificationDTO {
  recipientId: string;
  title: string;
  body: string;
  type: NotificationType;
  referenceId: string;
  channel: NotificationChannel;
}

// ─── API calls ───────────────────────────────────────────────────────────────

// GET /v1/notifications?recipientId=...&status=...
export async function fetchNotifications(params?: {
  recipientId?: string;
  status?: NotificationStatus;
}): Promise<NotificationAPI[]> {
  const query = new URLSearchParams();
  if (params?.recipientId) query.set("recipientId", params.recipientId);
  if (params?.status)      query.set("status", params.status);

  const url = query.toString() ? `${BASE_URL}?${query}` : BASE_URL;
  const res = await apiFetch(url);
  if (!res.ok) throw new Error(`Failed to fetch notifications (${res.status})`);
  return res.json();
}

// POST /v1/notifications/send
export async function sendNotification(dto: SendNotificationDTO): Promise<string> {
  const res = await apiFetch(`${BASE_URL}/send`, {
    method: "POST",
    body: JSON.stringify(dto),
  });
  if (!res.ok) throw new Error(`Failed to send notification (${res.status})`);
  return res.json();
}

// PATCH /v1/notifications/{id}/read
export async function markAsRead(id: string): Promise<void> {
  const res = await apiFetch(`${BASE_URL}/${id}/read`, { method: "PATCH" });
  if (!res.ok) throw new Error(`Failed to mark as read (${res.status})`);
}

// PATCH /v1/notifications/read-all
export async function markAllAsRead(): Promise<void> {
  const res = await apiFetch(`${BASE_URL}/read-all`, { method: "PATCH" });
  if (!res.ok) throw new Error(`Failed to mark all as read (${res.status})`);
}
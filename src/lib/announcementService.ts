// src/lib/announcementService.ts

import { apiFetch } from "./authService";

const BASE_URL = "/v1/announcements";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface AnnouncementAPI {
  id: string;
  authorId: string;
  title: string;
  content: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  isActive: boolean;
  expiresAt: string;
}

export interface CreateAnnouncementDTO {
  authorId: string;
  title: string;
  content: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  expiresAt: string;
}

// ─── API calls ───────────────────────────────────────────────────────────────

export async function fetchAnnouncements(): Promise<AnnouncementAPI[]> {
  const res = await apiFetch(BASE_URL);
  if (!res.ok) throw new Error(`Failed to fetch announcements (${res.status})`);
  return res.json();
}

export async function createAnnouncement(data: CreateAnnouncementDTO): Promise<string> {
  const res = await apiFetch(BASE_URL, {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Failed to create announcement (${res.status})`);
  return res.json();
}

export async function deactivateAnnouncement(id: string, requestingUserId: string): Promise<void> {
  const res = await apiFetch(`${BASE_URL}/${id}/deactivate`, {
    method: "PATCH",
    body: JSON.stringify({ requestingUserId }),
  });
  if (!res.ok) throw new Error(`Failed to deactivate announcement (${res.status})`);
}
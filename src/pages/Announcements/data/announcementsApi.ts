import { httpClient } from "@/lib/api/httpClient";

export type AnnouncementPriority = "LOW" | "NORMAL" | "URGENT";

export type AnnouncementResponseDto = {
  id: string;
  authorId: string;
  title: string;
  content: string;
  priority: AnnouncementPriority;
  isActive: boolean;
  expiresAt?: string | null;
};

export type CreateAnnouncementPayload = {
  title: string;
  content: string;
  priority: AnnouncementPriority;
  expiresAt?: string | null;
};

export const announcementsApi = {
  listActive() {
    return httpClient.get<AnnouncementResponseDto[]>("/v1/announcements");
  },

  createAnnouncement(payload: CreateAnnouncementPayload) {
    return httpClient.post<string>("/v1/announcements", payload);
  },

  deactivateAnnouncement(announcementId: string) {
    return httpClient.patch(
      `/v1/announcements/${announcementId}/deactivate`,
      null,
    );
  },
};

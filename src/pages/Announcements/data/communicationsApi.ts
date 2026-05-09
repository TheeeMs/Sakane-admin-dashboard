import { httpClient } from "@/lib/api/httpClient";

export type CommunicationTabKey =
  | "PUSH_NOTIFICATIONS"
  | "NEWS_ANNOUNCEMENTS"
  | "SYSTEM_NOTIFICATIONS";

export type CommunicationStatusKey =
  | "ALL"
  | "INSTANT_SENT"
  | "SCHEDULED"
  | "SENT"
  | "DRAFT";

export type CommunicationTabCounter = {
  key: string;
  label: string;
  count: number;
  badgeText: string;
};

export type CommunicationStatusCounter = {
  key: string;
  label: string;
  count: number;
};

export type CommunicationCardItemDto = {
  itemId: string;
  source: string;
  title: string;
  message: string;
  status: string;
  priority: string;
  recipientCount: number;
  readCount: number;
  readPercent: number;
  sentAt?: string | null;
  sentBy?: string | null;
  canView: boolean;
  canEdit: boolean;
  canDelete: boolean;
  viewUrl?: string | null;
  editUrl?: string | null;
  deleteUrl?: string | null;
};

export type AnnouncementPriority = "LOW" | "NORMAL" | "HIGH";

export type AdminCommunicationsCenterResponse = {
  selectedTab: string;
  selectedStatus: string;
  tabs: CommunicationTabCounter[];
  statuses: CommunicationStatusCounter[];
  totalItems: number;
  items: CommunicationCardItemDto[];
};

export type CreatePushNotificationPayload = {
  adminId?: string;
  recipientIds?: string[];
  sendToAll?: boolean;
  title: string;
  message: string;
  priority?: string;
  scheduleAt?: string | null;
};

export type CreateAnnouncementPayload = {
  authorId?: string;
  title: string;
  content: string;
  priority?: string;
  expiresAt?: string | null;
};

export const communicationsApi = {
  getCenter(params?: {
    tab?: CommunicationTabKey | string;
    status?: CommunicationStatusKey | string;
    search?: string;
  }) {
    return httpClient.get<AdminCommunicationsCenterResponse>(
      "/v1/admin/communications/center",
      { params },
    );
  },

  createPushNotification(payload: CreatePushNotificationPayload) {
    return httpClient.post<{
      campaignId: string;
      notificationsCreated: number;
      deliveryState: string;
      sentBy: string;
    }>("/v1/admin/communications/notifications", payload);
  },

  getNotificationItem(itemId: string, tab?: CommunicationTabKey | string) {
    return httpClient.get<CommunicationCardItemDto>(
      `/v1/admin/communications/notifications/${itemId}`,
      { params: { tab } },
    );
  },

  updateNotificationItem(
    itemId: string,
    payload: {
      title?: string;
      message?: string;
      priority?: string;
      sendNow?: boolean;
    },
    tab?: CommunicationTabKey | string,
  ) {
    return httpClient.patch(
      `/v1/admin/communications/notifications/${itemId}`,
      payload,
      { params: { tab } },
    );
  },

  deleteNotificationItem(itemId: string, tab?: CommunicationTabKey | string) {
    return httpClient.delete(
      `/v1/admin/communications/notifications/${itemId}`,
      {
        params: { tab },
      },
    );
  },

  createAnnouncement(payload: CreateAnnouncementPayload) {
    return httpClient.post<string>(
      "/v1/admin/communications/announcements",
      payload,
    );
  },

  updateAnnouncementItem(
    announcementId: string,
    payload: {
      title?: string;
      content?: string;
      priority?: string;
      expiresAt?: string | null;
      active?: boolean;
    },
  ) {
    return httpClient.patch(
      `/v1/admin/communications/announcements/${announcementId}`,
      payload,
    );
  },

  deleteAnnouncementItem(announcementId: string) {
    return httpClient.delete(
      `/v1/admin/communications/announcements/${announcementId}`,
    );
  },
};

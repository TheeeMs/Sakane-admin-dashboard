import { httpClient } from "@/lib/api/httpClient";

export type ListFeedbackParams = {
  tab?: string;
  search?: string;
  status?: string;
  category?: string;
  page?: number;
  size?: number;
};

export type AdminFeedbackCardItemDto = {
  feedbackId: string;
  authorId?: string | null;
  authorName?: string | null;
  unitNumber?: string | null;
  title?: string | null;
  content?: string | null;
  type?: string | null;
  isPublic?: boolean | null;
  isAnonymous?: boolean | null;
  uiStatus?: string | null;
  uiStatusLabel?: string | null;
  workflowStatus?: string | null;
  upvotes?: number | null;
  downvotes?: number | null;
  voteCount?: number | null;
  category?: string | null;
  location?: string | null;
  adminResponse?: string | null;
  imageUrl?: string | null;
  viewCount?: number | null;
  createdAt?: string | null;
};

export type AdminFeedbackDashboardResponse = {
  items: AdminFeedbackCardItemDto[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
  summary?: {
    publicSuggestionsCount: number;
    privateFeedbackCount: number;
    totalSuggestions: number;
    pendingReviewCount: number;
    totalVotes: number;
    popularCount: number;
    popularThreshold: number;
  };
  tabs?: {
    publicSuggestions: number;
    privateFeedback: number;
  };
};

export type AdminFeedbackDetailsResponse = {
  feedback: AdminFeedbackCardItemDto;
  canRespond: boolean;
  canDelete: boolean;
  statusOptions: string[];
};

export type AdminCreateFeedbackPayload = {
  authorId?: string;
  title: string;
  content: string;
  type?: string;
  isPublic?: boolean;
  category?: string;
  location?: string;
  isAnonymous?: boolean;
  imageUrl?: string;
};

export type AdminRespondFeedbackPayload = {
  response: string;
  newStatus?: string;
};

export type AdminUpdateFeedbackStatusPayload = {
  newStatus: string;
};

export const feedbackApi = {
  listFeedback(params?: ListFeedbackParams) {
    return httpClient.get<AdminFeedbackDashboardResponse>(
      "/v1/admin/feedback",
      {
        params,
      },
    );
  },

  createFeedback(payload: AdminCreateFeedbackPayload) {
    return httpClient.post<string>("/v1/admin/feedback", payload);
  },

  respondToFeedback(feedbackId: string, payload: AdminRespondFeedbackPayload) {
    return httpClient.patch(
      `/v1/admin/feedback/${feedbackId}/respond`,
      payload,
    );
  },

  updateFeedbackStatus(
    feedbackId: string,
    payload: AdminUpdateFeedbackStatusPayload,
  ) {
    return httpClient.patch(`/v1/admin/feedback/${feedbackId}/status`, payload);
  },

  deleteFeedback(feedbackId: string) {
    return httpClient.delete(`/v1/admin/feedback/${feedbackId}`);
  },

  getFeedbackDetails(feedbackId: string) {
    return httpClient.get<AdminFeedbackDetailsResponse>(
      `/v1/admin/feedback/${feedbackId}/details`,
    );
  },

  listStatuses() {
    return httpClient.get<string[]>("/v1/admin/feedback/statuses");
  },

  listCategories() {
    return httpClient.get<string[]>("/v1/admin/feedback/categories");
  },
};

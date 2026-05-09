import { httpClient } from "@/lib/api/httpClient";

export type ListMissingFoundReportsParams = {
  search?: string;
  type?: string;
  status?: string;
  category?: string;
  page?: number;
  size?: number;
};

export type MissingFoundActionUrls = {
  view?: string | null;
  edit?: string | null;
  delete?: string | null;
  updateStatus?: string | null;
  markMatched?: string | null;
  markResolved?: string | null;
  notifyUser?: string | null;
};

export type MissingFoundReportItemDto = {
  id: string;
  reporterId?: string | null;
  reportType?: string | null;
  reportTypeLabel?: string | null;
  category?: string | null;
  categoryLabel?: string | null;
  title?: string | null;
  description?: string | null;
  detailedDescription?: string | null;
  location?: string | null;
  lastSeenLocation?: string | null;
  reporterName?: string | null;
  reportedByName?: string | null;
  reporterUnitLabel?: string | null;
  reportedByUnit?: string | null;
  status?: string | null;
  statusLabel?: string | null;
  contactNumber?: string | null;
  eventTime?: string | null;
  resolvedAt?: string | null;
  createdAt?: string | null;
  actionUrls?: MissingFoundActionUrls | null;
};

export type MissingFoundReportsPage = {
  reports: MissingFoundReportItemDto[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
  totalCount: number;
  missingCount: number;
  foundCount: number;
  openCount: number;
  matchedCount: number;
  resolvedCount: number;
};

export type MissingFoundReportDetailsDto = {
  id: string;
  reporterId?: string | null;
  reportType?: string | null;
  reportTypeLabel?: string | null;
  category?: string | null;
  categoryLabel?: string | null;
  title?: string | null;
  description?: string | null;
  detailedDescription?: string | null;
  location?: string | null;
  lastSeenLocation?: string | null;
  reporterName?: string | null;
  reportedByName?: string | null;
  reporterUnitLabel?: string | null;
  reportedByUnit?: string | null;
  status?: string | null;
  statusLabel?: string | null;
  eventTime?: string | null;
  reportDate?: string | null;
  resolvedAt?: string | null;
  photoUrls?: string[] | null;
  photos?: string[] | null;
  contactNumber?: string | null;
  statusOptions?: string[] | null;
  actionUrls?: MissingFoundActionUrls | null;
};

export type MissingFoundSummary = {
  totalCount: number;
  missingCount: number;
  foundCount: number;
  openCount: number;
  matchedCount: number;
  resolvedCount: number;
};

export type MissingFoundResidentOptionItem = {
  residentId: string;
  fullName?: string | null;
  phoneNumber?: string | null;
  unitNumber?: string | null;
  buildingName?: string | null;
  unitLabel?: string | null;
  displayLabel?: string | null;
};

export type MissingFoundResidentOptionsPage = {
  residents: MissingFoundResidentOptionItem[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
};

export type CreateMissingFoundReportPayload = {
  reporterId: string;
  type: string;
  category: string;
  title: string;
  description: string;
  location: string;
  eventTime?: string;
  photoUrls?: string[];
  contactNumber: string;
};

export type UpdateMissingFoundReportPayload = {
  type?: string;
  category?: string;
  title?: string;
  description?: string;
  location?: string;
  eventTime?: string;
  photoUrls?: string[];
  contactNumber?: string;
};

export type UpdateMissingFoundStatusPayload = {
  status?: string;
  newStatus?: string;
};

export type NotifyUserPayload = {
  title?: string;
  message?: string;
  channel?: string;
};

export type NotifyUserResult = {
  reportId: string;
  reporterId: string;
  reportStatus: string;
  title: string;
  message: string;
  channel: string;
  notificationId: string;
};

export const missingFoundApi = {
  listReports(params?: ListMissingFoundReportsParams) {
    return httpClient.get<MissingFoundReportsPage>(
      "/v1/admin/missing-found/reports",
      { params },
    );
  },

  getSummary(params?: Omit<ListMissingFoundReportsParams, "page" | "size">) {
    return httpClient.get<MissingFoundSummary>(
      "/v1/admin/missing-found/summary",
      {
        params,
      },
    );
  },

  getReport(reportId: string) {
    return httpClient.get<MissingFoundReportDetailsDto>(
      `/v1/admin/missing-found/reports/${reportId}`,
    );
  },

  getReportDetails(reportId: string) {
    return httpClient.get<MissingFoundReportDetailsDto>(
      `/v1/admin/missing-found/reports/${reportId}/details`,
    );
  },

  createReport(payload: CreateMissingFoundReportPayload) {
    return httpClient.post<string>("/v1/admin/missing-found/reports", payload);
  },

  updateReport(reportId: string, payload: UpdateMissingFoundReportPayload) {
    return httpClient.patch(
      `/v1/admin/missing-found/reports/${reportId}`,
      payload,
    );
  },

  updateStatus(reportId: string, payload: UpdateMissingFoundStatusPayload) {
    return httpClient.patch(
      `/v1/admin/missing-found/reports/${reportId}/status`,
      payload,
    );
  },

  markResolved(reportId: string) {
    return httpClient.patch(
      `/v1/admin/missing-found/reports/${reportId}/mark-resolved`,
    );
  },

  markMatched(reportId: string) {
    return httpClient.patch(
      `/v1/admin/missing-found/reports/${reportId}/mark-matched`,
    );
  },

  notifyUser(reportId: string, payload?: NotifyUserPayload) {
    return httpClient.post<NotifyUserResult>(
      `/v1/admin/missing-found/reports/${reportId}/notify-user`,
      payload ?? null,
    );
  },

  deleteReport(reportId: string) {
    return httpClient.delete(`/v1/admin/missing-found/reports/${reportId}`);
  },

  listTypes() {
    return httpClient.get<string[]>("/v1/admin/missing-found/types");
  },

  listStatuses() {
    return httpClient.get<string[]>("/v1/admin/missing-found/statuses");
  },

  listCategories() {
    return httpClient.get<string[]>("/v1/admin/missing-found/categories");
  },

  listResidentOptions(params?: {
    search?: string;
    page?: number;
    size?: number;
  }) {
    return httpClient.get<MissingFoundResidentOptionsPage>(
      "/v1/admin/missing-found/residents/options",
      { params },
    );
  },
};

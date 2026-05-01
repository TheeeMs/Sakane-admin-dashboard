import axiosInstance from "@/api/axiosInstance";
import type {
  ApiReport,
  ApiReportsResponse,
  CreateReportPayload,
  UpdateReportPayload,
  SummaryResponse,
  NotifyUserPayload,
  NotifyUserResponse,
  ReportsListParams,
} from "../types";

const BASE = "/v1/admin/missing-found";

/* ──────────────────────────────────────────────
 *  Reports CRUD
 * ──────────────────────────────────────────── */

export async function fetchReports(
  params: ReportsListParams = {}
): Promise<ApiReportsResponse> {
  const { data } = await axiosInstance.get<ApiReportsResponse | ApiReport[]>(
    `${BASE}/reports`,
    { params }
  );

  // الـ API ممكن يرجع array مباشرة أو object فيه content/reports
  if (Array.isArray(data)) {
    return { reports: data, totalElements: data.length };
  }
  return data;
}

export async function fetchReportById(reportId: string): Promise<ApiReport> {
  const { data } = await axiosInstance.get<ApiReport>(
    `${BASE}/reports/${reportId}`
  );
  return data;
}

export async function fetchReportDetails(reportId: string): Promise<ApiReport> {
  const { data } = await axiosInstance.get<ApiReport>(
    `${BASE}/reports/${reportId}/details`
  );
  return data;
}

export async function createReport(
  payload: CreateReportPayload
): Promise<string> {
  const { data } = await axiosInstance.post<string>(
    `${BASE}/reports`,
    payload
  );
  return data;
}

export async function updateReport(
  reportId: string,
  payload: UpdateReportPayload
): Promise<void> {
  await axiosInstance.patch(`${BASE}/reports/${reportId}`, payload);
}

export async function deleteReport(reportId: string): Promise<void> {
  await axiosInstance.delete(`${BASE}/reports/${reportId}`);
}

/* ──────────────────────────────────────────────
 *  Status actions
 * ──────────────────────────────────────────── */

export async function updateReportStatus(
  reportId: string,
  newStatus: string,
  currentStatus?: string
): Promise<void> {
  await axiosInstance.patch(`${BASE}/reports/${reportId}/status`, {
    status: currentStatus ?? newStatus,
    newStatus,
  });
}

export async function markReportResolved(reportId: string): Promise<void> {
  await axiosInstance.patch(`${BASE}/reports/${reportId}/mark-resolved`);
}

export async function markReportMatched(reportId: string): Promise<void> {
  await axiosInstance.patch(`${BASE}/reports/${reportId}/mark-matched`);
}

export async function notifyUser(
  reportId: string,
  payload: NotifyUserPayload
): Promise<NotifyUserResponse> {
  const { data } = await axiosInstance.post<NotifyUserResponse>(
    `${BASE}/reports/${reportId}/notify-user`,
    payload
  );
  return data;
}

/* ──────────────────────────────────────────────
 *  Lookups & summary
 * ──────────────────────────────────────────── */

export async function fetchSummary(
  params: Omit<ReportsListParams, "page" | "size"> = {}
): Promise<SummaryResponse> {
  const { data } = await axiosInstance.get<SummaryResponse>(
    `${BASE}/summary`,
    { params }
  );
  return data;
}

export async function fetchTypes(): Promise<string[]> {
  const { data } = await axiosInstance.get<string[]>(`${BASE}/types`);
  return data;
}

export async function fetchStatuses(): Promise<string[]> {
  const { data } = await axiosInstance.get<string[]>(`${BASE}/statuses`);
  return data;
}

export async function fetchCategories(): Promise<string[]> {
  const { data } = await axiosInstance.get<string[]>(`${BASE}/categories`);
  return data;
}

export async function fetchResidentsOptions(params: {
  search?: string;
  page?: number;
  size?: number;
} = {}): Promise<{
  residents: Array<{
    residentId: string;
    fullName: string;
    phoneNumber: string;
    unitNumber: string;
    buildingName: string;
    unitLabel: string;
    displayLabel: string;
  }>;
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}> {
  const { data } = await axiosInstance.get(`${BASE}/residents/options`, {
    params,
  });
  return data;
}

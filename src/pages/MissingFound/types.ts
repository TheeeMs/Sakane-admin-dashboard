/* ──────────────────────────────────────────────
 *  UI-side types (what the components consume)
 * ──────────────────────────────────────────── */

export type ReportType = "Missing" | "Found";
export type ReportStatus = "Open" | "Matched" | "Resolved" | "Closed";
export type ReportCategory = "Item" | "Pet" | "Person" | "Vehicle";

export interface Report {
  id: string;
  type: ReportType;
  category: ReportCategory;
  title: string;
  shortDesc: string;
  location: string;
  reportedBy: string;
  unit: string;
  status: ReportStatus;
  date: string;
  contact: string;
  fullDesc: string;
  photo: string | null;
}

/* ──────────────────────────────────────────────
 *  API-side types (raw shape from the backend)
 * ──────────────────────────────────────────── */

export interface ApiReport {
  id: string;
  reporterId?: string;
  reportType: string;
  reportTypeLabel?: string;
  category: string;
  categoryLabel?: string;
  title: string;
  description?: string;
  detailedDescription?: string;
  location?: string;
  lastSeenLocation?: string;
  reporterName?: string;
  reportedByName?: string;
  reporterUnitLabel?: string;
  reportedByUnit?: string;
  status: string;
  statusLabel?: string;
  contactNumber?: string;
  eventTime?: string;
  reportDate?: string;
  resolvedAt?: string | null;
  createdAt?: string;
  photoUrls?: string[];
  photos?: string[];
  actionUrls?: {
    view?: string;
    edit?: string;
    delete?: string;
    updateStatus?: string;
    markMatched?: string;
    markResolved?: string;
    notifyUser?: string;
  };
}

export interface ApiReportsResponse {
  reports?: ApiReport[];
  content?: ApiReport[];
  page?: number;
  size?: number;
  totalElements?: number;
  totalPages?: number;
  hasNext?: boolean;
  hasPrevious?: boolean;
}

export interface ReportsListParams {
  search?: string;
  type?: string;
  status?: string;
  category?: string;
  page?: number;
  size?: number;
}

export interface CreateReportPayload {
  reporterId?: string;
  reportOnBehalfOf?: string;
  residentId?: string;
  type?: string;
  reportType: string;
  category?: string;
  itemCategory?: string;
  title: string;
  description?: string;
  detailedDescription: string;
  location?: string;
  lastSeenLocation: string;
  eventTime?: string;
  lastSeenAt?: string;
  photoUrls?: string[];
  photos?: string[];
  contactNumber: string;
}

export type UpdateReportPayload = Partial<Omit<CreateReportPayload,
  "reporterId" | "reportOnBehalfOf" | "residentId">>;

export interface SummaryResponse {
  totalCount: number;
  missingCount: number;
  foundCount: number;
  openCount: number;
  matchedCount: number;
  resolvedCount: number;
}

export interface NotifyUserPayload {
  title: string;
  message: string;
  channel: string;
}

export interface NotifyUserResponse {
  reportId: string;
  reporterId: string;
  reportStatus: string;
  title: string;
  message: string;
  channel: string;
  notificationId: string;
}

/* ──────────────────────────────────────────────
 *  Mappers between API and UI shapes
 * ──────────────────────────────────────────── */

export const TYPE_TO_API: Record<ReportType, string> = {
  Missing: "MISSING",
  Found: "FOUND",
};

export const STATUS_TO_API: Record<ReportStatus, string> = {
  Open: "OPEN",
  Matched: "MATCHED",
  Resolved: "RESOLVED",
  Closed: "CLOSED",
};

export const CATEGORY_TO_API: Record<ReportCategory, string> = {
  Item: "ITEM",
  Pet: "PET",
  Person: "PERSON",
  Vehicle: "VEHICLE",
};

export function normalizeType(value: string | undefined): ReportType {
  const v = (value ?? "").toUpperCase();
  if (v === "FOUND") return "Found";
  return "Missing";
}

export function normalizeStatus(value: string | undefined): ReportStatus {
  const v = (value ?? "").toUpperCase();
  if (v === "MATCHED") return "Matched";
  if (v === "RESOLVED") return "Resolved";
  if (v === "CLOSED") return "Closed";
  return "Open";
}

export function normalizeCategory(value: string | undefined): ReportCategory {
  const v = (value ?? "").toLowerCase();
  if (v === "pet") return "Pet";
  if (v === "person") return "Person";
  if (v === "vehicle") return "Vehicle";
  return "Item";
}

function formatDate(iso?: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/** Convert raw API report → UI-friendly Report */
export function mapApiReport(api: ApiReport): Report {
  const description = api.description ?? api.detailedDescription ?? "";
  return {
    id: api.id,
    type: normalizeType(api.reportType),
    category: normalizeCategory(api.category),
    title: api.title ?? "",
    shortDesc: description.slice(0, 30),
    location: api.lastSeenLocation || api.location || "",
    reportedBy: api.reporterName || api.reportedByName || "",
    unit: api.reporterUnitLabel || api.reportedByUnit || "",
    status: normalizeStatus(api.status),
    date: formatDate(api.eventTime || api.reportDate || api.createdAt),
    contact: api.contactNumber ?? "",
    fullDesc: api.detailedDescription || api.description || "",
    photo: api.photoUrls?.[0] || api.photos?.[0] || null,
  };
}

/** Convert UI Report data (from create/edit form) → API payload */
export function toCreatePayload(
  ui: Omit<Report, "id">,
  context?: { reporterId?: string; residentId?: string }
): CreateReportPayload {
  const reporterId = context?.reporterId;
  const residentId = context?.residentId ?? reporterId;

  return {
    ...(reporterId ? { reporterId } : {}),
    ...(reporterId ? { reportOnBehalfOf: reporterId } : {}),
    ...(residentId ? { residentId } : {}),
    reportType: TYPE_TO_API[ui.type],
    type: TYPE_TO_API[ui.type],
    category: CATEGORY_TO_API[ui.category],
    itemCategory: CATEGORY_TO_API[ui.category],
    title: ui.title,
    description: ui.fullDesc,
    detailedDescription: ui.fullDesc,
    location: ui.location,
    lastSeenLocation: ui.location,
    contactNumber: ui.contact,
    eventTime: new Date().toISOString(),
    lastSeenAt: new Date().toISOString(),
    photoUrls: ui.photo ? [ui.photo] : [],
    photos: ui.photo ? [ui.photo] : [],
  };
}

export function toUpdatePayload(
  ui: Omit<Report, "id">
): UpdateReportPayload {
  return {
    reportType: TYPE_TO_API[ui.type],
    type: TYPE_TO_API[ui.type],
    category: CATEGORY_TO_API[ui.category],
    itemCategory: CATEGORY_TO_API[ui.category],
    title: ui.title,
    description: ui.fullDesc,
    detailedDescription: ui.fullDesc,
    location: ui.location,
    lastSeenLocation: ui.location,
    contactNumber: ui.contact,
    photoUrls: ui.photo ? [ui.photo] : [],
    photos: ui.photo ? [ui.photo] : [],
  };
}

import { httpClient } from "@/lib/api/httpClient";

// ─── Enums matching backend ───────────────────────────────────────────────────
export type MaintenanceTab = "ALL" | "PENDING" | "IN_PROGRESS" | "COMPLETED";
export type MaintenanceSortBy = "NEWEST" | "OLDEST";
export type MaintenancePriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";
export type MaintenanceStatus =
  | "SUBMITTED"
  | "ASSIGNED"
  | "IN_PROGRESS"
  | "RESOLVED"
  | "CANCELLED";

// ─── Response DTOs ────────────────────────────────────────────────────────────
export interface MaintenanceCommandCenterItem {
  id: string;
  displayId: string;
  type: "PUBLIC" | "PRIVATE";
  priority: string;   // "LOW" | "MEDIUM" | "HIGH" – already mapped by backend
  issue: string;
  category: string;
  location: string;
  requestedAt: string;
  status: string;     // "UNASSIGNED" | "ASSIGNED" | "COMPLETED" | "CLOSED"
  workflowStatus: string;
  technicianId: string | null;
}

export interface MaintenanceListResponseDto {
  items: MaintenanceCommandCenterItem[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
  totalCount: number;
  pendingCount: number;
  inProgressCount: number;
  completedCount: number;
}

export interface MaintenanceCardDto {
  requestId: string;
  issueTitle: string;
  requestType: string;
  priority: string;
  status: string;
  workflowStatus: string;
  description: string;
  location: string;
  photos: string[];
  requester: {
    residentId: string;
    fullName: string;
    initials: string;
    phone: string;
    email: string;
    unitNumber: string | null;
    buildingName: string | null;
  };
  assignment: {
    technicianId: string | null;
    technicianName: string | null;
    technicianPhone: string | null;
  };
  completion: {
    completed: boolean;
    completedAt: string | null;
    resolution: string | null;
    totalCost: number | null;
    completedByName: string | null;
    receiptDownloadUrl: string;
  };
  timeline: {
    eventType: string;
    title: string;
    details: string | null;
    occurredAt: string;
  }[];
  submittedAt: string;
  resolvedAt: string | null;
}

export interface TechnicianOptionDto {
  technicianId: string;
  fullName: string;
  phone: string;
  isAvailable: boolean;
  specializations: string[];
  rating: number | null;
}

// ─── API ──────────────────────────────────────────────────────────────────────
export const maintenanceApi = {
  /** List all maintenance requests (admin command center) */
  listRequests(params?: {
    tab?: MaintenanceTab;
    area?: string;
    type?: "PRIVATE" | "PUBLIC";
    sortBy?: MaintenanceSortBy;
    page?: number;
    size?: number;
  }) {
    return httpClient.get<MaintenanceListResponseDto>(
      "/v1/admin/maintenance/requests",
      { params }
    );
  },

  /** Get detailed card for a single request */
  getCard(requestId: string) {
    return httpClient.get<MaintenanceCardDto>(
      `/v1/admin/maintenance/requests/${requestId}/card`
    );
  },

  /** Mark a request as viewed by admin */
  markViewed(requestId: string, actorId: string) {
    return httpClient.post(
      `/v1/admin/maintenance/requests/${requestId}/viewed`,
      { actorId }
    );
  },

  /** Get available technicians */
  listTechnicians(availableOnly = false) {
    return httpClient.get<TechnicianOptionDto[]>(
      "/v1/admin/maintenance/technicians",
      { params: { availableOnly } }
    );
  },

  /** Update priority of a request */
  setPriority(requestId: string, priority: MaintenancePriority, actorId: string) {
    return httpClient.patch(
      `/v1/admin/maintenance/requests/${requestId}/priority`,
      { priority, actorId }
    );
  },

  /** Assign a technician to a request */
  assignTechnician(
    requestId: string,
    payload: { technicianId: string; actorId: string; assignmentNote?: string }
  ) {
    return httpClient.post(
      `/v1/admin/maintenance/requests/${requestId}/assign`,
      payload
    );
  },

  /** Get area filter options */
  listAreas() {
    return httpClient.get<string[]>("/v1/admin/maintenance/areas");
  },

  /** Get type/category filter options */
  listTypes() {
    return httpClient.get<string[]>("/v1/admin/maintenance/types");
  },
};

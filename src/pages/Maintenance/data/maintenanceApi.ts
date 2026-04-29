import { httpClient } from "@/lib/api/httpClient";

// ─── Enums matching backend ───────────────────────────────────────────────────
export type MaintenanceTab = "ALL" | "PENDING" | "IN_PROGRESS" | "COMPLETED";
export type MaintenanceSortBy = "NEWEST" | "OLDEST" | "PRIORITY";
export type MaintenancePriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";
export type MaintenanceStatus =
  | "SUBMITTED"
  | "ASSIGNED"
  | "IN_PROGRESS"
  | "RESOLVED"
  | "CANCELLED";

// ─── Response DTOs ────────────────────────────────────────────────────────────
export interface MaintenanceRequestItemDto {
  id: string;
  requestId: string;
  title: string;
  locationLabel: string;
  category: string;
  priority: MaintenancePriority;
  status: MaintenanceStatus;
  isPublic: boolean;
  createdAt: string;
  residentName?: string;
  residentUnit?: string;
}

export interface MaintenanceListResponseDto {
  requests: MaintenanceRequestItemDto[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface MaintenanceCardDto {
  id: string;
  requestId: string;
  title: string;
  description: string;
  locationLabel: string;
  category: string;
  priority: MaintenancePriority;
  status: MaintenanceStatus;
  isPublic: boolean;
  createdAt: string;
  photoUrls: string[];
  resident: {
    residentId: string;
    fullName: string;
    unitLabel: string;
    phoneNumber: string;
    email: string;
  };
  assignedTechnician?: {
    technicianId: string;
    fullName: string;
  };
  timeline: {
    label: string;
    time: string;
  }[];
}

export interface TechnicianOptionDto {
  technicianId: string;
  fullName: string;
  available: boolean;
  specializations: string[];
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

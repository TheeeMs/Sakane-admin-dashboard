import { httpClient } from "@/lib/api/httpClient";

export type AdminQrAccessTab =
  | "ALL"
  | "GUEST"
  | "DELIVERY"
  | "SERVICE"
  | "FAMILY"
  | "OTHER";

export type AdminQrAccessStatus = "ACTIVE" | "USED" | "EXPIRED" | "REVOKED";

export type AdminQrAccessItemDto = {
  accessCodeId: string;
  qrCode: string;
  visitorName: string;
  visitorPhone: string | null;
  visitorSubtitle: string;
  visitorType: string;
  hostResidentId: string;
  hostResidentName: string;
  unitNumber: string | null;
  createdAt: string;
  validUntil: string;
  status: string;
};

export type AdminQrAccessSummaryDto = {
  totalCount: number;
  guestCount: number;
  deliveryCount: number;
  serviceCount: number;
  familyCount: number;
  otherCount: number;
  todayGuestCount: number;
  todayDeliveryCount: number;
  activeQrCodes: number;
};

export type AdminQrAccessPageDto = {
  items: AdminQrAccessItemDto[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
  summary: AdminQrAccessSummaryDto;
  tabs: Array<{ tab: string; count: number }>;
};

export type ResidentQrCodeItemDto = {
  accessCodeId: string;
  qrCode: string;
  visitorName: string;
  visitorPhone: string | null;
  visitorSubtitle: string;
  visitorType: string;
  createdAt: string;
  validUntil: string;
  status: string;
};

export type ResidentQrCodesResponseDto = {
  resident: {
    residentId: string;
    fullName: string;
    initials: string;
    unitNumber: string | null;
    buildingName: string | null;
    phoneNumber: string | null;
  };
  codes: ResidentQrCodeItemDto[];
  summary: {
    totalCount: number;
    activeCount: number;
    usedCount: number;
    expiredCount: number;
    revokedCount: number;
  };
};

export type AdminQrCodeDetailsDto = {
  accessCodeId: string;
  qrCode: string;
  qrData: string;
  visitorName: string;
  visitorPhone: string | null;
  visitorType: string;
  visitorSubtitle: string;
  hostResidentName: string;
  unitNumber: string | null;
  status: string;
  createdAt: string;
  validUntil: string;
  singleUse: boolean;
  downloadUrl: string;
  deleteUrl: string;
  history: Array<{
    title: string;
    occurredAt: string;
    actor: string;
    details: string | null;
  }>;
};

export const gateApi = {
  listTypes() {
    return httpClient.get<string[]>("/v1/admin/access/types");
  },

  listStatuses() {
    return httpClient.get<string[]>("/v1/admin/access/statuses");
  },

  listCodes(params?: {
    tab?: AdminQrAccessTab;
    search?: string;
    status?: AdminQrAccessStatus;
    page?: number;
    size?: number;
  }) {
    return httpClient.get<AdminQrAccessPageDto>("/v1/admin/access/codes", {
      params,
    });
  },

  listResidentCodes(
    residentId: string,
    params?: {
      tab?: AdminQrAccessTab;
      status?: AdminQrAccessStatus;
      page?: number;
      size?: number;
    },
  ) {
    return httpClient.get<ResidentQrCodesResponseDto>(
      `/v1/admin/access/residents/${residentId}/codes`,
      { params },
    );
  },

  getCodeDetails(accessCodeId: string) {
    return httpClient.get<AdminQrCodeDetailsDto>(
      `/v1/admin/access/codes/${accessCodeId}/details`,
    );
  },

  downloadCode(accessCodeId: string) {
    return httpClient.get<Blob>(
      `/v1/admin/access/codes/${accessCodeId}/download`,
      {
        responseType: "blob",
      },
    );
  },

  deleteCode(accessCodeId: string) {
    return httpClient.delete(`/v1/admin/access/codes/${accessCodeId}`);
  },
};

import { httpClient } from "@/lib/api/httpClient";

export type ListResidentsParams = {
  search?: string;
  page?: number;
  size?: number;
};

export type AdminResidentDirectoryItem = {
  residentId: string;
  fullName?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  buildingName?: string | null;
  unitNumber?: string | null;
};

export type AdminResidentDirectoryPage = {
  residents: AdminResidentDirectoryItem[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
};

export const residentsApi = {
  listResidents(params?: ListResidentsParams) {
    return httpClient.get<AdminResidentDirectoryPage>("/v1/admin/residents", {
      params,
    });
  },
};

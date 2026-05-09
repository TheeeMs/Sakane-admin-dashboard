import { httpClient } from "@/lib/api/httpClient";

export type AdminEmployeeRoleFilter =
  | "ALL"
  | "SUPER_ADMIN"
  | "ADMIN"
  | "TECHNICIAN"
  | "SECURITY_STAFF";

export type AdminEmployeeStatusFilter =
  | "ALL"
  | "ACTIVE"
  | "INACTIVE"
  | "SUSPENDED";

export type AdminEmployeeItemDto = {
  employeeId: string;
  fullName: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  role: string;
  roleLabel: string;
  department: string | null;
  status: string;
  statusLabel: string;
  lastActiveAt: string | null;
  hireDate: string | null;
  superAdmin: boolean;
  active: boolean;
  phoneVerified: boolean;
  loginMethod: string | null;
  specializations: string[];
  technicianAvailable: boolean | null;
  actions: {
    viewUrl: string;
    editUrl: string;
    updateStatusUrl: string;
    resetPasswordUrl: string;
    deactivateUrl: string;
  };
};

export type AdminEmployeesDashboardResponseDto = {
  employees: AdminEmployeeItemDto[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
  summary: {
    superAdminsCount: number;
    adminsCount: number;
    techniciansCount: number;
    securityStaffCount: number;
    activeEmployeesCount: number;
    totalEmployeesCount: number;
    activeEmployeesLabel: string;
  };
};

export type CreateEmployeePayload = {
  fullName: string;
  phoneNumber: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: Exclude<AdminEmployeeRoleFilter, "ALL">;
  hireDate: string;
  department: string;
  isSuperAdmin?: boolean;
  isActive?: boolean;
};

export type UpdateEmployeePayload = {
  fullName?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  role?: Exclude<AdminEmployeeRoleFilter, "ALL">;
  hireDate?: string;
  department?: string;
  isSuperAdmin?: boolean;
  isActive?: boolean;
};

export const employeesApi = {
  listEmployees(params?: {
    search?: string;
    role?: AdminEmployeeRoleFilter;
    status?: AdminEmployeeStatusFilter;
    page?: number;
    size?: number;
  }) {
    return httpClient.get<AdminEmployeesDashboardResponseDto>(
      "/v1/admin/employees",
      { params },
    );
  },

  getEmployee(employeeId: string) {
    return httpClient.get<AdminEmployeeItemDto>(
      `/v1/admin/employees/${employeeId}`,
    );
  },

  listRoles() {
    return httpClient.get<string[]>("/v1/admin/employees/roles");
  },

  listStatuses() {
    return httpClient.get<string[]>("/v1/admin/employees/statuses");
  },

  createEmployee(payload: CreateEmployeePayload) {
    return httpClient.post<{ employeeId: string; message: string }>(
      "/v1/admin/employees",
      payload,
    );
  },

  updateEmployee(employeeId: string, payload: UpdateEmployeePayload) {
    return httpClient.patch(`/v1/admin/employees/${employeeId}`, payload);
  },

  deleteEmployee(employeeId: string) {
    return httpClient.delete(`/v1/admin/employees/${employeeId}`);
  },

  updateEmployeeStatus(
    employeeId: string,
    payload: {
      isActive?: boolean;
      status?: "ACTIVE" | "INACTIVE" | "SUSPENDED";
    },
  ) {
    return httpClient.patch(
      `/v1/admin/employees/${employeeId}/status`,
      payload,
    );
  },
};

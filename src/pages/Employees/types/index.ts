export type EmployeeRole = "super-admin" | "admin" | "technician" | "security";
export type EmployeeStatus = "active" | "inactive" | "suspended";

export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: EmployeeRole;
  department: string;
  status: EmployeeStatus;
  lastActive: string;
  hireDate?: string;
  avatar?: string;
  initials: string;
}

export interface EmployeeStatistics {
  superAdmins: number;
  admins: number;
  technicians: number;
  securityStaff: number;
  activeEmployees: number;
  totalEmployees: number;
}

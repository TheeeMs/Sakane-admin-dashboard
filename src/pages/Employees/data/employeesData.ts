import type { Employee, EmployeeStatistics } from "../types";

export function calculateEmployeeStatistics(
  employees: Employee[],
): EmployeeStatistics {
  return {
    superAdmins: employees.filter((e) => e.role === "super-admin").length,
    admins: employees.filter((e) => e.role === "admin").length,
    technicians: employees.filter((e) => e.role === "technician").length,
    securityStaff: employees.filter((e) => e.role === "security").length,
    activeEmployees: employees.filter((e) => e.status === "active").length,
    totalEmployees: employees.length,
  };
}

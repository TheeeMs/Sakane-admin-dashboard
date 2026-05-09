import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Crown, Shield, Users, Wrench, UserCheck, Plus } from "lucide-react";
import { PrimaryButton, StatCard } from "@/components/shared";
import {
  EmployeeTable,
  EmployeeDetailsModal,
  AddEmployeeModal,
  EditEmployeeModal,
} from "./components";
import { calculateEmployeeStatistics } from "./data/employeesData";
import {
  employeesApi,
  type AdminEmployeeItemDto,
  type CreateEmployeePayload,
} from "./data/employeesApi";
import type { Employee, EmployeeRole, EmployeeStatus } from "./types";
import type { EditEmployeeValues } from "./components/EditEmployeeModal";

const getApiErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const responseData = error.response?.data as
      | { message?: string; detail?: string; title?: string; error?: string }
      | undefined;

    const responseMessage =
      responseData?.message ??
      responseData?.detail ??
      responseData?.title ??
      responseData?.error ??
      error.response?.statusText;

    if (responseMessage) {
      return responseMessage;
    }
  }

  return error instanceof Error ? error.message : "Something went wrong";
};

const mapEmployeeRole = (role: string, isSuperAdmin: boolean): EmployeeRole => {
  if (isSuperAdmin || role === "SUPER_ADMIN") {
    return "super-admin";
  }

  switch (role) {
    case "ADMIN":
      return "admin";
    case "TECHNICIAN":
      return "technician";
    case "SECURITY_STAFF":
    case "SECURITY_GUARD":
      return "security";
    default:
      return "admin";
  }
};

const mapEmployeeStatus = (status: string): EmployeeStatus => {
  switch (status) {
    case "INACTIVE":
      return "inactive";
    case "SUSPENDED":
      return "suspended";
    default:
      return "active";
  }
};

const mapCreateRole = (role: EmployeeRole): CreateEmployeePayload["role"] => {
  switch (role) {
    case "super-admin":
      return "ADMIN";
    case "admin":
      return "ADMIN";
    case "technician":
      return "TECHNICIAN";
    case "security":
      return "SECURITY_STAFF";
  }
};

const isSuperAdminRole = (role: EmployeeRole): boolean =>
  role === "super-admin";

const toEmployee = (dto: AdminEmployeeItemDto): Employee => {
  const initials = dto.fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  return {
    id: dto.employeeId,
    name: dto.fullName,
    email: dto.email,
    phone: dto.phoneNumber,
    role: mapEmployeeRole(dto.role, dto.superAdmin),
    department: dto.department ?? "-",
    status: mapEmployeeStatus(dto.status),
    lastActive: dto.lastActiveAt ?? new Date().toISOString(),
    hireDate: dto.hireDate ?? undefined,
    initials: initials || "EM",
  };
};

export function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null,
  );
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const statistics = useMemo(
    () => calculateEmployeeStatistics(employees),
    [employees],
  );

  const loadEmployees = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await employeesApi.listEmployees({
        role: "ALL",
        status: "ACTIVE",
        size: 100,
      });
      setEmployees(response.data.employees.map(toEmployee));
    } catch (loadError) {
      setError(getApiErrorMessage(loadError));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadEmployees();
  }, []);

  // Handlers
  const handleAddEmployee = () => {
    setIsAddModalOpen(true);
  };

  const handleEmployeeClick = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsDetailsModalOpen(true);
  };

  const handleEditEmployee = (employee: Employee) => {
    setIsDetailsModalOpen(false);
    setEditingEmployee(employee);
    setIsEditModalOpen(true);
  };

  const handleDeleteEmployee = async (employee: Employee) => {
    const shouldDelete = window.confirm(
      `Delete ${employee.name}? This action will deactivate the employee account.`,
    );

    if (!shouldDelete) {
      return;
    }

    try {
      await employeesApi.deleteEmployee(employee.id);
      setEmployees((prev) => prev.filter((item) => item.id !== employee.id));

      if (selectedEmployee?.id === employee.id) {
        handleCloseDetailsModal();
      }
    } catch (deleteError) {
      setError(getApiErrorMessage(deleteError));
    }
  };

  const handleManagePermissions = (employee: Employee) => {
    console.log("Manage permissions for:", employee);
    // TODO: Open permissions modal
  };

  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedEmployee(null);
  };

  const mapStatusForApi = (status: EmployeeStatus) => {
    switch (status) {
      case "active":
        return "ACTIVE" as const;
      case "inactive":
        return "INACTIVE" as const;
      case "suspended":
        return "SUSPENDED" as const;
    }
  };

  const handleUpdateEmployee = async (
    employeeId: string,
    values: EditEmployeeValues,
  ) => {
    setIsSubmitting(true);
    setError(null);

    try {
      await employeesApi.updateEmployee(employeeId, {
        fullName: values.fullName.trim(),
        phoneNumber: values.phone.trim(),
        email: values.email.trim(),
        role: mapCreateRole(values.role),
        isSuperAdmin: isSuperAdminRole(values.role),
        hireDate: values.hireDate,
        department: values.department.trim(),
        isActive: values.status === "active",
      });

      await employeesApi.updateEmployeeStatus(employeeId, {
        status: mapStatusForApi(values.status),
        isActive: values.status === "active",
      });

      const updatedEmployee = await employeesApi.getEmployee(employeeId);
      const mapped = toEmployee(updatedEmployee.data);

      setEmployees((prev) =>
        prev.map((employee) =>
          employee.id === employeeId ? mapped : employee,
        ),
      );

      if (selectedEmployee?.id === employeeId) {
        setSelectedEmployee(mapped);
      }

      setEditingEmployee(null);
      setIsEditModalOpen(false);
    } catch (updateError) {
      throw new Error(getApiErrorMessage(updateError));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateEmployee = async (values: {
    fullName: string;
    email: string;
    phone: string;
    role: EmployeeRole;
    department: string;
    hireDate: string;
    password: string;
    confirmPassword: string;
  }) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const created = await employeesApi.createEmployee({
        fullName: values.fullName.trim(),
        phoneNumber: values.phone.trim(),
        email: values.email.trim(),
        password: values.password,
        confirmPassword: values.confirmPassword,
        role: mapCreateRole(values.role),
        isSuperAdmin: isSuperAdminRole(values.role),
        hireDate: values.hireDate,
        department: values.department.trim(),
        isActive: true,
      });

      const createdEmployee = await employeesApi.getEmployee(
        created.data.employeeId,
      );
      setEmployees((prev) => [toEmployee(createdEmployee.data), ...prev]);
      setIsAddModalOpen(false);
    } catch (createError) {
      throw new Error(getApiErrorMessage(createError));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Employee Management
          </h1>
          <p className="text-gray-600 mt-1">
            Manage staff accounts and permissions
          </p>
        </div>
        <PrimaryButton onClick={handleAddEmployee} icon={Plus}>
          Add Employee
        </PrimaryButton>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-6">
        <StatCard
          icon={Crown}
          label="Super Admins"
          value={statistics.superAdmins}
          iconBg="bg-purple-100"
          iconColor="text-purple-600"
          gradient="bg-gradient-to-br from-purple-50 to-transparent"
          borderColor="border-purple-200"
        />
        <StatCard
          icon={Shield}
          label="Admins"
          value={statistics.admins}
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
          gradient="bg-gradient-to-br from-blue-50 to-transparent"
          borderColor="border-blue-200"
        />
        <StatCard
          icon={Wrench}
          label="Technicians"
          value={statistics.technicians}
          iconBg="bg-orange-100"
          iconColor="text-orange-600"
          gradient="bg-gradient-to-br from-orange-50 to-transparent"
          borderColor="border-orange-200"
        />
        <StatCard
          icon={Users}
          label="Security Staff"
          value={statistics.securityStaff}
          iconBg="bg-green-100"
          iconColor="text-green-600"
          gradient="bg-gradient-to-br from-green-50 to-transparent"
          borderColor="border-green-200"
        />
        <StatCard
          icon={UserCheck}
          label="Active Employees"
          value={`${statistics.activeEmployees}/${statistics.totalEmployees}`}
          iconBg="bg-cyan-100"
          iconColor="text-cyan-600"
          gradient="bg-gradient-to-br from-cyan-50 to-transparent"
          borderColor="border-cyan-200"
        />
      </div>

      {/* Employee Table */}
      {isLoading ? (
        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center text-gray-600">
          Loading employees...
        </div>
      ) : (
        <EmployeeTable
          employees={employees}
          onEmployeeClick={handleEmployeeClick}
          onEdit={handleEditEmployee}
          onDelete={handleDeleteEmployee}
        />
      )}

      <AddEmployeeModal
        isOpen={isAddModalOpen}
        isSubmitting={isSubmitting}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleCreateEmployee}
      />

      <EditEmployeeModal
        isOpen={isEditModalOpen}
        employee={editingEmployee}
        isSubmitting={isSubmitting}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingEmployee(null);
        }}
        onSubmit={handleUpdateEmployee}
      />

      {/* Employee Details Modal */}
      <EmployeeDetailsModal
        employee={selectedEmployee}
        isOpen={isDetailsModalOpen}
        onClose={handleCloseDetailsModal}
        onEdit={handleEditEmployee}
        onManagePermissions={handleManagePermissions}
      />
    </div>
  );
}

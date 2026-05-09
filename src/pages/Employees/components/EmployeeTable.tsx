import { GenericTable } from "@/components/shared/GenericTable";
import { RoleBadge } from "./shared/RoleBadge";
import { StatusBadge } from "./shared/StatusBadge";
import { Mail, Phone } from "lucide-react";
import { formatDate } from "@/lib";
import type { Employee } from "../types";

interface EmployeeTableProps {
  employees: Employee[];
  onEmployeeClick?: (employee: Employee) => void;
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
}

export function EmployeeTable({
  employees,
  onEmployeeClick,
  onEdit,
  onDelete,
}: EmployeeTableProps) {
  return (
    <GenericTable<Employee>
      data={employees}
      onRowClick={onEmployeeClick}
      searchKeys={["name", "email", "phone"]}
      searchPlaceholder="Search by name, email, or phone..."
      filters={[
        {
          key: "role",
          label: "All Roles",
          options: [
            { value: "super-admin", label: "Super Admin" },
            { value: "admin", label: "Admin" },
            { value: "technician", label: "Technician" },
            { value: "security", label: "Security Staff" },
          ],
        },
        {
          key: "status",
          label: "All Status",
          options: [
            { value: "active", label: "Active" },
            { value: "inactive", label: "Inactive" },
            { value: "suspended", label: "Suspended" },
          ],
        },
      ]}
      columns={[
        {
          key: "name",
          header: "Employee",
          render: (emp) => (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-teal-600 flex items-center justify-center text-white font-semibold">
                {emp.initials}
              </div>
              <p className="font-semibold text-gray-900">{emp.name}</p>
            </div>
          ),
        },
        {
          key: "email",
          header: "Contact",
          render: (emp) => (
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="w-4 h-4" /> {emp.email}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="w-4 h-4" /> {emp.phone}
              </div>
            </div>
          ),
        },
        {
          key: "role",
          header: "Role",
          render: (emp) => <RoleBadge role={emp.role} />,
        },
        { key: "department", header: "Department" },
        {
          key: "status",
          header: "Status",
          render: (emp) => <StatusBadge status={emp.status} />,
        },
        {
          key: "lastActive",
          header: "Last Active",
          render: (emp) => formatDate(emp.lastActive),
        },
        {
          key: "actions",
          header: "Actions",
          render: (emp) => (
            <div className="flex gap-2">
              <button
                onClick={(event) => {
                  event.stopPropagation();
                  onEdit(emp);
                }}
                className="p-2 rounded-lg hover:bg-teal-50 text-teal-600 transition-colors"
                title="Edit"
              >
                Edit
              </button>
              <button
                onClick={(event) => {
                  event.stopPropagation();
                  onDelete(emp);
                }}
                className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                title="Delete"
              >
                Delete
              </button>
            </div>
          ),
        },
      ]}
    />
  );
}

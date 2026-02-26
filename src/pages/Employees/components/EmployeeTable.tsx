import { useState, useMemo } from "react";
import { Search, Edit, Trash2, Mail, Phone } from "lucide-react";
import { Select } from "@/components/shared";
import { formatDate } from "@/lib";
import type { Employee, EmployeeRole, EmployeeStatus } from "../types";
import { RoleBadge } from "./shared/RoleBadge";
import { StatusBadge } from "./shared/StatusBadge";

interface EmployeeTableProps {
  employees: Employee[];
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
}

export function EmployeeTable({
  employees,
  onEdit,
  onDelete,
}: EmployeeTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<EmployeeRole | "all">("all");
  const [statusFilter, setStatusFilter] = useState<EmployeeStatus | "all">(
    "all",
  );

  // Filter employees
  const filteredEmployees = useMemo(() => {
    return employees.filter((employee) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = employee.name.toLowerCase().includes(query);
        const matchesEmail = employee.email.toLowerCase().includes(query);
        const matchesPhone = employee.phone.toLowerCase().includes(query);
        if (!matchesName && !matchesEmail && !matchesPhone) return false;
      }

      // Role filter
      if (roleFilter !== "all" && employee.role !== roleFilter) return false;

      // Status filter
      if (statusFilter !== "all" && employee.status !== statusFilter)
        return false;

      return true;
    });
  }, [employees, searchQuery, roleFilter, statusFilter]);

  const hasFilters =
    searchQuery || roleFilter !== "all" || statusFilter !== "all";

  const clearFilters = () => {
    setSearchQuery("");
    setRoleFilter("all");
    setStatusFilter("all");
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex gap-4 mb-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>

          {/* Role Filter */}
          <Select
            label=""
            value={roleFilter}
            onChange={(e) =>
              setRoleFilter(e.target.value as EmployeeRole | "all")
            }
            options={[
              { value: "all", label: "All Roles" },
              { value: "super-admin", label: "Super Admin" },
              { value: "admin", label: "Admin" },
              { value: "technician", label: "Technician" },
              { value: "security", label: "Security Staff" },
            ]}
          />

          {/* Status Filter */}
          <Select
            label=""
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as EmployeeStatus | "all")
            }
            options={[
              { value: "all", label: "All Status" },
              { value: "active", label: "Active" },
              { value: "inactive", label: "Inactive" },
              { value: "suspended", label: "Suspended" },
            ]}
          />
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>
            Showing {filteredEmployees.length} of {employees.length} employees
          </span>
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="text-teal-600 hover:text-teal-700 font-medium"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Employee
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Contact
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Role
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Department
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Last Active
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((employee) => (
                  <tr
                    key={employee.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    {/* Employee */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-teal-600 flex items-center justify-center text-white font-semibold">
                          {employee.initials}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {employee.name}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail className="w-4 h-4" />
                          {employee.email}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="w-4 h-4" />
                          {employee.phone}
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="px-6 py-4">
                      <RoleBadge role={employee.role} />
                    </td>

                    {/* Department */}
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-900">
                        {employee.department}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <StatusBadge status={employee.status} />
                    </td>

                    {/* Last Active */}
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">
                        {formatDate(employee.lastActive)}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => onEdit(employee)}
                          className="p-2 rounded-lg hover:bg-teal-50 text-teal-600 transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDelete(employee)}
                          className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <p className="text-gray-500 text-lg">No employees found</p>
                    {hasFilters && (
                      <button
                        onClick={clearFilters}
                        className="mt-4 text-teal-600 hover:text-teal-700 font-medium"
                      >
                        Clear filters
                      </button>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

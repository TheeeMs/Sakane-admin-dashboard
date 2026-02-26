import { useState } from "react";
import { Crown, Shield, Users, Wrench, UserCheck, Plus } from "lucide-react";
import { PrimaryButton, StatCard } from "@/components/shared";
import { EmployeeTable } from "./components";
import {
  employeesData,
  calculateEmployeeStatistics,
} from "./data/employeesData";
import type { Employee } from "./types";

export function EmployeesPage() {
  const [employees] = useState<Employee[]>(employeesData);

  // Calculate statistics
  const statistics = calculateEmployeeStatistics(employees);

  // Handlers
  const handleAddEmployee = () => {
    console.log("Add new employee");
    // TODO: Open add employee modal
  };

  const handleEditEmployee = (employee: Employee) => {
    console.log("Edit employee:", employee);
    // TODO: Open edit employee modal
  };

  const handleDeleteEmployee = (employee: Employee) => {
    console.log("Delete employee:", employee);
    // TODO: Show confirmation and delete
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
      <EmployeeTable
        employees={employees}
        onEdit={handleEditEmployee}
        onDelete={handleDeleteEmployee}
      />
    </div>
  );
}

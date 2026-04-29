import type { Employee } from "../types";
import { Modal, IconBadge, PrimaryButton } from "@/components/shared";
import { StatusBadge } from "./shared/StatusBadge";
import { RoleBadge } from "./shared/RoleBadge";
import {
  Mail,
  Phone,
  Briefcase,
  Calendar,
  Shield,
  Info,
  Edit,
  Key,
} from "lucide-react";
import { formatDate } from "@/lib";

interface EmployeeDetailsModalProps {
  employee: Employee | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (employee: Employee) => void;
  onManagePermissions: (employee: Employee) => void;
}

export function EmployeeDetailsModal({
  employee,
  isOpen,
  onClose,
  onEdit,
  onManagePermissions,
}: EmployeeDetailsModalProps) {
  if (!employee) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Employee Details"
      size="md"
      footer={
        <div className="grid grid-cols-[1fr_1fr_auto] gap-3">
          <PrimaryButton onClick={() => onEdit(employee)} icon={Edit}>
            Edit Employee
          </PrimaryButton>
          <button
            onClick={() => onManagePermissions(employee)}
            className="px-6 py-3 border-2 border-purple-600 text-purple-600 rounded-lg font-medium hover:bg-purple-50 transition-colors flex items-center justify-center gap-2"
          >
            <Key className="w-5 h-5" />
            Manage Permissions
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors whitespace-nowrap"
          >
            Close
          </button>
        </div>
      }
    >
      {/* Header Section */}
      <div className="flex items-start gap-4 mb-6">
        {/* Avatar */}
        <div className="w-16 h-16 rounded-full bg-teal-600 flex items-center justify-center flex-shrink-0">
          <span className="text-white text-xl font-bold">
            {employee.initials}
          </span>
        </div>

        {/* Name and Badges */}
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {employee.name}
          </h3>
          <div className="flex items-center gap-2">
            <RoleBadge role={employee.role} />
            <StatusBadge status={employee.status} />
          </div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">
          Contact Information
        </h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Mail className="w-5 h-5 text-gray-500 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-500 mb-0.5">Email</p>
              <p className="text-sm text-gray-900 font-medium">
                {employee.email}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Phone className="w-5 h-5 text-gray-500 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-500 mb-0.5">Phone</p>
              <p className="text-sm text-gray-900 font-medium">
                {employee.phone}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Employment Details */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">
          Employment Details
        </h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Briefcase className="w-5 h-5 text-gray-500 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-500 mb-0.5">Department</p>
              <p className="text-sm text-gray-900 font-medium">
                {employee.department || "Not assigned"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Calendar className="w-5 h-5 text-gray-500 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-500 mb-0.5">Hire Date</p>
              <p className="text-sm text-gray-900 font-medium">
                {employee.hireDate
                  ? formatDate(employee.hireDate)
                  : "Not specified"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Access Permissions */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">
          Access Permissions
        </h4>
        <IconBadge
          icon={Shield}
          label={
            employee.role === "super-admin"
              ? "Full System Access"
              : employee.role === "admin"
                ? "Admin Access"
                : employee.role === "technician"
                  ? "Maintenance Access"
                  : "Security Access"
          }
          bgColor="bg-purple-100"
          iconColor="text-purple-600"
          borderColor="border-purple-200"
        />
      </div>

      {/* Last Active Info Box */}
      <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm text-blue-900">
            <span className="font-medium">Last active:</span>{" "}
            {formatDate(employee.lastActive)} at{" "}
            {new Date(employee.lastActive).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })}
          </p>
        </div>
      </div>
    </Modal>
  );
}

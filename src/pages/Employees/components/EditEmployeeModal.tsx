import { useEffect, useState, type FormEvent } from "react";
import { Modal, Input, Select, PrimaryButton } from "@/components/shared";
import type { Employee, EmployeeRole, EmployeeStatus } from "../types";

export type EditEmployeeValues = {
  fullName: string;
  email: string;
  phone: string;
  role: EmployeeRole;
  department: string;
  hireDate: string;
  status: EmployeeStatus;
};

interface EditEmployeeModalProps {
  isOpen: boolean;
  employee: Employee | null;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (employeeId: string, values: EditEmployeeValues) => Promise<void>;
}

const ROLE_OPTIONS: Array<{ value: EmployeeRole; label: string }> = [
  { value: "super-admin", label: "Super Admin" },
  { value: "admin", label: "Admin" },
  { value: "technician", label: "Technician" },
  { value: "security", label: "Security Staff" },
];

const STATUS_OPTIONS: Array<{ value: EmployeeStatus; label: string }> = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "suspended", label: "Suspended" },
];

const EMPTY_VALUES: EditEmployeeValues = {
  fullName: "",
  email: "",
  phone: "",
  role: "admin",
  department: "",
  hireDate: "",
  status: "active",
};

const toDateInput = (value?: string): string => {
  if (!value) {
    return "";
  }

  return value.split("T")[0] || "";
};

export function EditEmployeeModal({
  isOpen,
  employee,
  isSubmitting,
  onClose,
  onSubmit,
}: EditEmployeeModalProps) {
  const [values, setValues] = useState<EditEmployeeValues>(EMPTY_VALUES);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !employee) {
      return;
    }

    setValues({
      fullName: employee.name,
      email: employee.email,
      phone: employee.phone,
      role: employee.role,
      department: employee.department === "-" ? "" : employee.department,
      hireDate: toDateInput(employee.hireDate),
      status: employee.status,
    });
    setError(null);
  }, [isOpen, employee]);

  const setField = <K extends keyof EditEmployeeValues>(
    key: K,
    value: EditEmployeeValues[K],
  ) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!employee) {
      setError("Employee is missing.");
      return;
    }

    try {
      await onSubmit(employee.id, values);
      onClose();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Failed to update employee",
      );
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Employee" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Full Name"
            value={values.fullName}
            onChange={(e) => setField("fullName", e.target.value)}
            placeholder="Enter full name"
            required
          />
          <Input
            label="Email"
            type="email"
            value={values.email}
            onChange={(e) => setField("email", e.target.value)}
            placeholder="name@sakany.app"
            required
          />
          <Input
            label="Phone"
            value={values.phone}
            onChange={(e) => setField("phone", e.target.value)}
            placeholder="+2010..."
            required
          />
          <Select
            label="Role"
            value={values.role}
            onChange={(e) => setField("role", e.target.value as EmployeeRole)}
            options={ROLE_OPTIONS}
            required
          />
          <Input
            label="Department"
            value={values.department}
            onChange={(e) => setField("department", e.target.value)}
            placeholder="Operations"
            required
          />
          <Input
            label="Hire Date"
            type="date"
            value={values.hireDate}
            onChange={(e) => setField("hireDate", e.target.value)}
            required
          />
          <div className="md:col-span-2">
            <Select
              label="Status"
              value={values.status}
              onChange={(e) =>
                setField("status", e.target.value as EmployeeStatus)
              }
              options={STATUS_OPTIONS}
              required
            />
          </div>
        </div>

        {error && (
          <div className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
            {error}
          </div>
        )}

        <div className="pt-2 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <PrimaryButton
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2.5"
          >
            {isSubmitting ? "Saving..." : "Save Changes"}
          </PrimaryButton>
        </div>
      </form>
    </Modal>
  );
}

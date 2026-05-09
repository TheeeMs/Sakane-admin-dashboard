import { useEffect, useState, type FormEvent } from "react";
import { Modal, Input, Select, PrimaryButton } from "@/components/shared";
import type { EmployeeRole } from "../types";

type FormValues = {
  fullName: string;
  email: string;
  phone: string;
  role: EmployeeRole;
  department: string;
  hireDate: string;
  password: string;
  confirmPassword: string;
};

interface AddEmployeeModalProps {
  isOpen: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (values: FormValues) => Promise<void>;
}

const INITIAL_VALUES: FormValues = {
  fullName: "",
  email: "",
  phone: "",
  role: "admin",
  department: "",
  hireDate: "",
  password: "",
  confirmPassword: "",
};

const ROLE_OPTIONS: Array<{ value: EmployeeRole; label: string }> = [
  { value: "super-admin", label: "Super Admin" },
  { value: "admin", label: "Admin" },
  { value: "technician", label: "Technician" },
  { value: "security", label: "Security Staff" },
];

export function AddEmployeeModal({
  isOpen,
  isSubmitting,
  onClose,
  onSubmit,
}: AddEmployeeModalProps) {
  const [values, setValues] = useState<FormValues>(INITIAL_VALUES);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setValues(INITIAL_VALUES);
      setError(null);
    }
  }, [isOpen]);

  const setField = <K extends keyof FormValues>(
    key: K,
    value: FormValues[K],
  ) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (values.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (values.password !== values.confirmPassword) {
      setError("Password and confirm password must match.");
      return;
    }

    try {
      await onSubmit(values);
      onClose();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Failed to create employee",
      );
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Employee" size="md">
      <form
        id="add-employee-form"
        onSubmit={handleSubmit}
        className="space-y-4"
      >
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
          <Input
            label="Password"
            type="password"
            value={values.password}
            onChange={(e) => setField("password", e.target.value)}
            placeholder="At least 8 characters"
            required
          />
          <Input
            label="Confirm Password"
            type="password"
            value={values.confirmPassword}
            onChange={(e) => setField("confirmPassword", e.target.value)}
            placeholder="Repeat password"
            required
          />
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
            {isSubmitting ? "Creating..." : "Create Employee"}
          </PrimaryButton>
        </div>
      </form>
    </Modal>
  );
}

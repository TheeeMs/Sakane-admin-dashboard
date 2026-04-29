import type { EmployeeRole } from "../../types";
import { Badge } from "@/components/shared";

interface RoleBadgeProps {
  role: EmployeeRole;
}

export function RoleBadge({ role }: RoleBadgeProps) {
  const roleConfig = {
    "super-admin": {
      variant: "purple" as const,
      label: "Super Admin",
    },
    admin: {
      variant: "info" as const,
      label: "Admin",
    },
    technician: {
      variant: "warning" as const,
      label: "Technician",
    },
    security: {
      variant: "success" as const,
      label: "Security Staff",
    },
  };

  const config = roleConfig[role];

  return <Badge variant={config.variant} label={config.label} />;
}

import type { EmployeeStatus } from "../../types";
import { Badge } from "@/components/shared";

interface StatusBadgeProps {
  status: EmployeeStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const statusConfig = {
    active: {
      variant: "success" as const,
      label: "Active",
    },
    inactive: {
      variant: "default" as const,
      label: "Inactive",
    },
    suspended: {
      variant: "error" as const,
      label: "Suspended",
    },
  };

  const config = statusConfig[status];

  return <Badge variant={config.variant} label={config.label} />;
}

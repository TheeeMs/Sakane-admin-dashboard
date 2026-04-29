import { Badge } from "@/components/shared";
import type { FeedbackStatus } from "../../types";

interface StatusBadgeProps {
  status: FeedbackStatus;
  isAnonymous?: boolean;
}

export function FeedbackStatusBadge({
  status,
  isAnonymous = false,
}: StatusBadgeProps) {
  const statusConfig = {
    pending: {
      variant: "warning" as const,
      label: "Pending",
    },
    "under-review": {
      variant: "info" as const,
      label: "Under Review",
    },
    resolved: {
      variant: "success" as const,
      label: "Resolved",
    },
    rejected: {
      variant: "error" as const,
      label: "Rejected",
    },
  };

  const config = statusConfig[status];

  return (
    <div className="flex gap-2">
      <Badge variant={config.variant} label={config.label} />
      {isAnonymous && <Badge variant="purple" label="Anonymous to Users" />}
    </div>
  );
}

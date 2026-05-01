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
  const normalized = status?.toUpperCase();
  const statusConfig = {
    PENDING: {
      variant: "warning" as const,
      label: "Pending",
    },
    UNDER_REVIEW: {
      variant: "info" as const,
      label: "Under Review",
    },
    RESOLVED: {
      variant: "success" as const,
      label: "Resolved",
    },
    ARCHIVED: {
      variant: "default" as const,
      label: "Archived",
    },
  } as const;

  const config =
    statusConfig[normalized as keyof typeof statusConfig] ??
    statusConfig.PENDING;

  return (
    <div className="flex gap-2">
      <Badge variant={config.variant} label={config.label} />
      {isAnonymous && <Badge variant="purple" label="Anonymous to Users" />}
    </div>
  );
}

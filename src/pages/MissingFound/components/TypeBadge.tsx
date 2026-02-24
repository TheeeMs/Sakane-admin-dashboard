import type { ReportType } from "../types";

interface TypeBadgeProps { type: ReportType; }

export default function TypeBadge({ type }: TypeBadgeProps) {
  const isMissing = type === "Missing";
  return (
    <span style={{
      display: "inline-block",
      padding: "4px 14px",
      borderRadius: 9999,
      fontSize: 12,
      fontWeight: 600,
      border: `1.5px solid ${isMissing ? "#fca5a5" : "#6ee7b7"}`,
      color: isMissing ? "#ef4444" : "#059669",
      background: isMissing ? "#fef2f2" : "#ecfdf5",
      whiteSpace: "nowrap",
    }}>
      {type}
    </span>
  );
}
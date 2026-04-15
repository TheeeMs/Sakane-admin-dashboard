import type { ReportStatus } from "../types";

interface StatusBadgeProps { status: ReportStatus; }

type StatusStyle = { bg: string; color: string; border: string };

const STATUS_STYLES: Record<ReportStatus, StatusStyle> = {
  Open:     { bg: "#eff6ff", color: "#3b82f6", border: "#bfdbfe" },
  Matched:  { bg: "#fffbeb", color: "#d97706", border: "#fde68a" },
  Resolved: { bg: "#f0fdf4", color: "#16a34a", border: "#bbf7d0" },
  Closed:   { bg: "#f9fafb", color: "#6b7280", border: "#e5e7eb" },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const s = STATUS_STYLES[status] ?? STATUS_STYLES.Closed;
  return (
    <span style={{
      display: "inline-block",
      padding: "4px 14px",
      borderRadius: 9999,
      fontSize: 12,
      fontWeight: 600,
      border: `1.5px solid ${s.border}`,
      color: s.color,
      background: s.bg,
      whiteSpace: "nowrap",
    }}>
      {status}
    </span>
  );
}
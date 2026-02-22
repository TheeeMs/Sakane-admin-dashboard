import type { Priority, Status } from "../../types";
import { priorityConfig, statusConfig } from "../../data/systemData";

export function PriorityBadge({ priority }: { priority: Priority }) {
  const cfg = priorityConfig[priority];
  return <span style={{ padding: "2px 10px", borderRadius: 999, fontSize: 11, fontWeight: 700, background: cfg.bg, color: cfg.text, border: `1px solid ${cfg.border}` }}>{priority}</span>;
}

export function StatusBadge({ status }: { status: Status }) {
  const cfg = statusConfig[status];
  return <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 10px", borderRadius: 999, fontSize: 11, fontWeight: 600, background: cfg.bg, color: cfg.text, border: "1px solid currentColor", opacity: 0.9 }}><span style={{ fontSize: 10 }}>{cfg.icon}</span>{status}</span>;
}
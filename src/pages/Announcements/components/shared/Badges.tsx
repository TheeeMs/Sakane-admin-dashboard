import type { Priority, Status } from "../../types";

const priorityStyles: Record<Priority, string> = {
  HIGH: "bg-red-50 text-red-600 border-red-200",
  NORMAL: "bg-blue-50 text-blue-600 border-blue-200",
  LOW: "bg-gray-50 text-gray-600 border-gray-200",
};

const statusStyles: Record<Status, { className: string; icon: string }> = {
  Sent: { className: "bg-emerald-50 text-emerald-600 border-emerald-200", icon: "✓" },
  Draft: { className: "bg-amber-50 text-amber-600 border-amber-200", icon: "✎" },
  Scheduled: { className: "bg-blue-50 text-blue-600 border-blue-200", icon: "⏱" },
};

export function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${priorityStyles[priority]}`}
    >
      {priority}
    </span>
  );
}

export function StatusBadge({ status }: { status: Status }) {
  const cfg = statusStyles[status];
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${cfg.className}`}
    >
      <span className="text-[10px]">{cfg.icon}</span>
      {status}
    </span>
  );
}

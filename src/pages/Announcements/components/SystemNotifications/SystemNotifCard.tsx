import { useState } from "react";
import {
  Bell,
  Settings,
  Calendar as CalendarLucide,
  Lock,
  Edit3,
  BarChart3,
  Trash2,
} from "lucide-react";
import type { PushNotification, NotifCategory } from "../../types";
import { Toggle } from "./Toggle";

/* ──────────────────────────────────────────────
 *  Helpers — derive presentation values from API data
 * ──────────────────────────────────────────── */
const categoryStyles: Record<NotifCategory, { bg: string; text: string }> = {
  Payment: { bg: "bg-violet-50", text: "text-violet-700" },
  Maintenance: { bg: "bg-pink-50", text: "text-pink-700" },
  Event: { bg: "bg-blue-50", text: "text-blue-700" },
  Security: { bg: "bg-emerald-50", text: "text-emerald-700" },
};

const categoryIconBg: Record<NotifCategory, { bg: string; text: string }> = {
  Payment: { bg: "bg-violet-50", text: "text-violet-600" },
  Maintenance: { bg: "bg-pink-50", text: "text-pink-600" },
  Event: { bg: "bg-blue-50", text: "text-blue-600" },
  Security: { bg: "bg-emerald-50", text: "text-emerald-600" },
};

function deriveCategory(title: string): NotifCategory {
  const lowered = title.toLowerCase();
  if (
    lowered.includes("maintenance") ||
    lowered.includes("ticket") ||
    lowered.includes("repair")
  )
    return "Maintenance";
  if (
    lowered.includes("event") ||
    lowered.includes("meeting") ||
    lowered.includes("registration")
  )
    return "Event";
  if (
    lowered.includes("guest") ||
    lowered.includes("access") ||
    lowered.includes("security") ||
    lowered.includes("code")
  )
    return "Security";
  return "Payment";
}

function CategoryIcon({ category }: { category: NotifCategory }) {
  const cls = "w-4 h-4";
  switch (category) {
    case "Maintenance":
      return <Settings className={cls} />;
    case "Event":
      return <CalendarLucide className={cls} />;
    case "Security":
      return <Lock className={cls} />;
    case "Payment":
    default:
      return <Bell className={cls} />;
  }
}

function deriveTrigger(notif: PushNotification): string {
  if (notif.scheduledAt) return notif.scheduledAt.replace(/^Scheduled\s+/i, "");
  if (notif.status === "Draft") return "Draft — not yet triggered";
  return "When event occurs";
}

function deriveLastSent(notif: PushNotification): string {
  if (notif.sentAt) return notif.sentAt.replace(/^Sent\s+/i, "");
  return "—";
}

function successRateColor(rate: number): string {
  if (rate >= 98) return "text-emerald-600";
  if (rate >= 95) return "text-amber-600";
  return "text-red-600";
}

/* ──────────────────────────────────────────────
 *  Stat cell
 * ──────────────────────────────────────────── */
function StatCell({
  label,
  value,
  valueClassName,
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) {
  return (
    <div>
      <p className="m-0 text-[11px] font-medium text-gray-400 mb-0.5">
        {label}
      </p>
      <p
        className={`m-0 text-[13px] font-semibold text-gray-900 ${
          valueClassName ?? ""
        }`}
      >
        {value}
      </p>
    </div>
  );
}

/* ──────────────────────────────────────────────
 *  Card
 * ──────────────────────────────────────────── */
interface SystemNotifCardProps {
  notif: PushNotification;
  onToggle?: (notif: PushNotification, nextEnabled: boolean) => void;
  onEdit?: (notif: PushNotification) => void;
  onAnalytics?: (notif: PushNotification) => void;
  onDelete?: (id: string) => void;
}

export function SystemNotifCard({
  notif,
  onToggle,
  onEdit,
  onAnalytics,
  onDelete,
}: SystemNotifCardProps) {
  const enabled = notif.status === "Sent";
  const category = deriveCategory(notif.title);
  const catBadge = categoryStyles[category];
  const catIcon = categoryIconBg[category];
  const [hovered, setHovered] = useState(false);

  const totalSent = notif.recipients ?? 0;
  const successRate = notif.readPercent ?? 0;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`bg-white border rounded-xl px-5 py-4 transition-all ${
        hovered
          ? "border-[#00A389]/30 shadow-md shadow-[#00A389]/5"
          : "border-gray-100"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        {/* Left: icon + content */}
        <div className="flex gap-3.5 flex-1 min-w-0">
          {/* Icon bubble */}
          <div
            className={`w-10 h-10 rounded-xl ${
              enabled ? catIcon.bg : "bg-gray-100"
            } ${
              enabled ? catIcon.text : "text-gray-400"
            } flex items-center justify-center flex-shrink-0`}
          >
            <CategoryIcon category={category} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Title row */}
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <h3 className="m-0 font-bold text-gray-900 text-[15px]">
                {notif.title}
              </h3>
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                  enabled
                    ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                    : "bg-gray-50 text-gray-500 border border-gray-200"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    enabled ? "bg-emerald-500" : "bg-gray-400"
                  }`}
                />
                {enabled ? "Enabled" : "Disabled"}
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${catBadge.bg} ${catBadge.text}`}
              >
                {category}
              </span>
            </div>

            {/* Template message */}
            <div className="bg-gray-50 border border-gray-100 rounded-lg px-3 py-2 mb-3">
              <p className="m-0 text-[12.5px] text-gray-700 font-mono leading-relaxed line-clamp-2">
                {notif.description || "—"}
              </p>
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <StatCell
                label="Trigger Condition"
                value={deriveTrigger(notif)}
              />
              <StatCell
                label="Total Sent"
                value={totalSent.toLocaleString()}
              />
              <StatCell
                label="Success Rate"
                value={`${successRate}%`}
                valueClassName={successRateColor(successRate)}
              />
              <StatCell label="Last Sent" value={deriveLastSent(notif)} />
            </div>
          </div>
        </div>

        {/* Right: toggle + actions */}
        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          <Toggle
            enabled={enabled}
            onChange={() => onToggle?.(notif, !enabled)}
            disabled={!onToggle}
          />
          <div className="flex flex-col gap-1 mt-1">
            {onEdit && (
              <button
                type="button"
                onClick={() => onEdit(notif)}
                title="Edit"
                className="w-8 h-8 rounded-lg text-gray-400 hover:bg-[#00A389]/10 hover:text-[#00A389] flex items-center justify-center transition"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            )}
            {onAnalytics && (
              <button
                type="button"
                onClick={() => onAnalytics(notif)}
                title="Analytics"
                className="w-8 h-8 rounded-lg text-gray-400 hover:bg-violet-50 hover:text-violet-600 flex items-center justify-center transition"
              >
                <BarChart3 className="w-4 h-4" />
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                onClick={() => onDelete(notif.id)}
                title="Delete"
                className="w-8 h-8 rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-600 flex items-center justify-center transition"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

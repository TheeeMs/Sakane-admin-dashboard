import { useState } from "react";
import { Calendar, Inbox, Search, Zap } from "lucide-react";
import type { PushNotification, SubTab } from "../../types";
import { NotificationCard } from "./NotificationCard";

interface Props {
  items: PushNotification[];
  onDelete: (id: string) => void;
  search: string;
  onSearchChange: (value: string) => void;
  statusOptions: Array<{ value: string; label: string; count?: number }>;
  statusValue: string;
  onStatusChange: (value: string) => void;
  onView?: (notif: PushNotification) => void;
}

export function PushNotifications({
  items,
  onDelete,
  search,
  onSearchChange,
  statusOptions,
  statusValue,
  onStatusChange,
  onView,
}: Props) {
  const [activeSubTab, setActiveSubTab] = useState<SubTab>(
    statusValue === "SCHEDULED" ? "scheduled" : "instant",
  );

  const filtered = items.filter(
    (n) =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.description.toLowerCase().includes(search.toLowerCase()),
  );

  const scheduledOption = statusOptions.find(
    (option) => option.value === "SCHEDULED",
  );
  const scheduledCount = scheduledOption?.count ?? 0;

  return (
    <div>
      {/* Sub-tabs */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {(["instant", "scheduled"] as SubTab[]).map((s) => {
          const active = activeSubTab === s;
          const Icon = s === "instant" ? Zap : Calendar;
          return (
            <button
              key={s}
              onClick={() => {
                setActiveSubTab(s);
                onStatusChange(s === "instant" ? "INSTANT_SENT" : "SCHEDULED");
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                active
                  ? "bg-[#00A389] text-white shadow-sm shadow-[#00A389]/25"
                  : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              <Icon className="w-4 h-4" />
              {s === "instant" ? "Instant & Sent" : `Scheduled (${scheduledCount})`}
            </button>
          );
        })}
      </div>

      {/* Filters row */}
      <div className="flex flex-col md:flex-row gap-3 mb-5">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search notifications..."
            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-3 py-2.5 text-sm text-gray-800 outline-none focus:border-[#00A389] focus:ring-2 focus:ring-[#00A389]/15 transition-all"
          />
        </div>
        {/* Status select */}
        <select
          value={statusValue}
          onChange={(e) => onStatusChange(e.target.value)}
          className="md:w-56 bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-800 outline-none focus:border-[#00A389] focus:ring-2 focus:ring-[#00A389]/15 transition-all"
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
              {option.count !== undefined ? ` (${option.count})` : ""}
            </option>
          ))}
        </select>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-3">
            <Inbox className="w-6 h-6 text-gray-400" />
          </div>
          <p className="text-sm font-medium text-gray-600">
            No notifications found
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Try adjusting your search or filter
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((n) => (
            <NotificationCard
              key={n.id}
              notif={n}
              onDelete={onDelete}
              onView={onView}
            />
          ))}
        </div>
      )}
    </div>
  );
}

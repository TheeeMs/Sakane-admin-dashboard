import { Inbox, RefreshCw, Search, Zap } from "lucide-react";
import type { PushNotification } from "../../types";
import { NotificationCard } from "../PushNotifications/NotificationCard";

interface SystemNotificationsProps {
  items: PushNotification[];
  onDelete: (id: string) => void;
  onRefresh: () => void;
  search: string;
  onSearchChange: (value: string) => void;
  statusOptions: Array<{ value: string; label: string; count?: number }>;
  statusValue: string;
  onStatusChange: (value: string) => void;
  onView?: (notif: PushNotification) => void;
}

export function SystemNotifications({
  items,
  onDelete,
  onRefresh,
  search,
  onSearchChange,
  statusOptions,
  statusValue,
  onStatusChange,
  onView,
}: SystemNotificationsProps) {
  const filtered = items.filter(
    (n) =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.description.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div>
      {/* Info banner */}
      <div className="flex items-start gap-3 p-4 mb-5 rounded-xl bg-violet-50 border border-violet-200">
        <div className="w-9 h-9 rounded-lg bg-violet-100 flex items-center justify-center text-violet-600 flex-shrink-0">
          <Zap className="w-4 h-4" />
        </div>
        <div>
          <p className="m-0 font-bold text-sm text-violet-700">
            Automated System Notifications
          </p>
          <p className="m-0 mt-0.5 text-[13px] text-violet-600/90">
            These notifications are triggered automatically by system events.
          </p>
        </div>
      </div>

      {/* Filters row */}
      <div className="flex flex-col md:flex-row gap-3 mb-5">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search system notifications..."
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
        {/* Refresh */}
        <button
          onClick={onRefresh}
          title="Refresh"
          className="flex items-center justify-center gap-2 md:w-auto px-4 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-sm font-semibold text-gray-700 transition"
        >
          <RefreshCw className="w-4 h-4" />
          <span className="md:hidden">Refresh</span>
        </button>
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

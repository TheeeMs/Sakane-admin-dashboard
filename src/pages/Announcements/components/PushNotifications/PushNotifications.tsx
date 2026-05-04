import { useEffect, useMemo, useState } from "react";
import { Calendar, Inbox, Search, Zap } from "lucide-react";
import type { PushNotification, SubTab } from "../../types";
import { NotificationCard } from "./NotificationCard";
import { registerPushIds, unregisterPushId } from "./pushRegistry";
// Side-effect import: installs the request interceptor that pins every
// shared-endpoint POST to ?tab=PUSH_NOTIFICATIONS, so the parent's
// create flow can never deliver into the System tab.
import "./pushApi";

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

  /* Register every id we see on the Push tab so the System tab can
   * filter them out. This guarantees a record never appears in both
   * tabs at once, regardless of how the backend tags it. */
  const itemIds = useMemo(
    () => items.map((n) => n.id).filter((id): id is string => Boolean(id)),
    [items],
  );

  useEffect(() => {
    if (itemIds.length > 0) registerPushIds(itemIds);
  }, [itemIds]);

  const filtered = items.filter(
    (n) =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.description.toLowerCase().includes(search.toLowerCase()),
  );

  const scheduledOption = statusOptions.find(
    (option) => option.value === "SCHEDULED",
  );
  const scheduledCount = scheduledOption?.count ?? 0;

  /* When the user deletes a push item, drop it from the registry too so
   * the same id doesn't get permanently filtered if it ever comes back
   * in a different context. */
  const handleDelete = (id: string) => {
    unregisterPushId(id);
    onDelete(id);
  };

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
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search notifications..."
            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-3 py-2.5 text-sm text-gray-800 outline-none focus:border-[#00A389] focus:ring-2 focus:ring-[#00A389]/15 transition-all"
          />
        </div>
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
              onDelete={handleDelete}
              onView={onView}
            />
          ))}
        </div>
      )}
    </div>
  );
}

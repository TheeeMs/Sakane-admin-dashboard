import { useMemo, useState } from "react";
import { Calendar, ChevronLeft, ChevronRight, Inbox, Search, Zap } from "lucide-react";
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

const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/** Best-effort parse of the display string we receive on `scheduledAt`
 * (e.g. "Scheduled May 11, 03:30 PM"). Returns a Date or null. */
function parseScheduledLabel(label?: string): Date | null {
  if (!label) return null;
  const cleaned = label.replace(/^Scheduled\s+/i, "").trim();
  const yearGuess = `${cleaned}, ${new Date().getFullYear()}`;
  const tryParse = (s: string) => {
    const t = Date.parse(s);
    return Number.isNaN(t) ? null : new Date(t);
  };
  return tryParse(cleaned) || tryParse(yearGuess);
}

/** UI-only calendar used in the Scheduled sub-tab. */
function ScheduledCalendar({ items }: { items: PushNotification[] }) {
  const today = new Date();
  const [cursor, setCursor] = useState({
    year: today.getFullYear(),
    month: today.getMonth(),
  });

  /** Map of "YYYY-M-D" -> count of scheduled items on that day */
  const dotsByDay = useMemo(() => {
    const map = new Map<string, number>();
    for (const n of items) {
      const d =
        parseScheduledLabel(n.scheduledAt) || parseScheduledLabel(n.sentAt);
      if (!d) continue;
      const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      map.set(key, (map.get(key) ?? 0) + 1);
    }
    return map;
  }, [items]);

  const firstOfMonth = new Date(cursor.year, cursor.month, 1);
  const daysInMonth = new Date(cursor.year, cursor.month + 1, 0).getDate();
  const leadingBlanks = firstOfMonth.getDay(); // 0 = Sun
  const totalCells = Math.ceil((leadingBlanks + daysInMonth) / 7) * 7;

  const cells: Array<{ day: number | null; date: Date | null }> = [];
  for (let i = 0; i < totalCells; i++) {
    const dayNumber = i - leadingBlanks + 1;
    if (dayNumber < 1 || dayNumber > daysInMonth) {
      cells.push({ day: null, date: null });
    } else {
      cells.push({
        day: dayNumber,
        date: new Date(cursor.year, cursor.month, dayNumber),
      });
    }
  }

  const goPrev = () =>
    setCursor((c) =>
      c.month === 0
        ? { year: c.year - 1, month: 11 }
        : { year: c.year, month: c.month - 1 },
    );
  const goNext = () =>
    setCursor((c) =>
      c.month === 11
        ? { year: c.year + 1, month: 0 }
        : { year: c.year, month: c.month + 1 },
    );

  const isToday = (d: Date | null) =>
    !!d &&
    d.getFullYear() === today.getFullYear() &&
    d.getMonth() === today.getMonth() &&
    d.getDate() === today.getDate();

  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
      {/* Month header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <h3 className="m-0 text-base font-bold text-gray-900">
          {MONTH_NAMES[cursor.month]} {cursor.year}
        </h3>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={goPrev}
            title="Previous month"
            className="w-8 h-8 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-700 flex items-center justify-center transition"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={goNext}
            title="Next month"
            className="w-8 h-8 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-700 flex items-center justify-center transition"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Day-of-week header */}
      <div className="grid grid-cols-7 border-b border-gray-100 bg-gray-50/40">
        {WEEK_DAYS.map((d) => (
          <div
            key={d}
            className="px-3 py-2.5 text-[12px] font-semibold text-gray-500 text-center"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Date cells */}
      <div className="grid grid-cols-7">
        {cells.map((cell, idx) => {
          const dayKey = cell.date
            ? `${cell.date.getFullYear()}-${cell.date.getMonth()}-${cell.date.getDate()}`
            : null;
          const count = dayKey ? dotsByDay.get(dayKey) ?? 0 : 0;
          const todayCell = isToday(cell.date);
          return (
            <div
              key={idx}
              className={
                "min-h-[96px] border-b border-r border-gray-100 px-2.5 py-2 last:border-r-0 " +
                (todayCell ? "bg-[#00A389]/5" : "")
              }
            >
              {cell.day !== null && (
                <div className="flex flex-col gap-1">
                  <span
                    className={
                      "inline-flex items-center justify-center text-[12px] font-semibold " +
                      (todayCell
                        ? "w-6 h-6 rounded-full bg-[#00A389] text-white"
                        : "text-gray-700")
                    }
                  >
                    {cell.day}
                  </span>
                  {count > 0 && (
                    <span className="mt-1 inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold w-fit">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                      {count}
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
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

      {activeSubTab === "scheduled" ? (
        <ScheduledCalendar items={items} />
      ) : (
        <>
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
                  onDelete={onDelete}
                  onView={onView}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

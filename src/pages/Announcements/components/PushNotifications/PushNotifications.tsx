import { useState } from "react";
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

  const currentList = items;
  const filtered = currentList.filter(
    (n) =>
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.description.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
        {(["instant", "scheduled"] as SubTab[]).map((s) => {
          const active = activeSubTab === s;
          const scheduledOption = statusOptions.find(
            (option) => option.value === "SCHEDULED",
          );
          const scheduledCount = scheduledOption?.count ?? 0;
          return (
            <button
              key={s}
              onClick={() => {
                setActiveSubTab(s);
                onStatusChange(s === "instant" ? "INSTANT_SENT" : "SCHEDULED");
              }}
              style={{
                padding: "8px 18px",
                borderRadius: 8,
                border: "1px solid",
                borderColor: active ? "#0d9488" : "#e5e7eb",
                background: active ? "#0d9488" : "#fff",
                color: active ? "#fff" : "#374151",
                fontWeight: 600,
                fontSize: 13,
                cursor: "pointer",
              }}
            >
              {s === "instant"
                ? "⚡ Instant & Sent"
                : `📅 Scheduled (${scheduledCount})`}
            </button>
          );
        })}
      </div>
      <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
        <select
          value={statusValue}
          onChange={(e) => onStatusChange(e.target.value)}
          style={{
            flex: 1,
            padding: "9px 12px",
            border: "1px solid #e5e7eb",
            borderRadius: 10,
            fontSize: 13,
            background: "#fafafa",
          }}
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
              {option.count !== undefined ? ` (${option.count})` : ""}
            </option>
          ))}
        </select>
      </div>
      <div style={{ position: "relative", marginBottom: 18 }}>
        <span
          style={{
            position: "absolute",
            left: 14,
            top: "50%",
            transform: "translateY(-50%)",
            color: "#9ca3af",
            pointerEvents: "none",
          }}
        >
          🔍
        </span>
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search notifications..."
          style={{
            width: "100%",
            boxSizing: "border-box",
            padding: "11px 14px 11px 40px",
            border: "1px solid #e5e7eb",
            borderRadius: 10,
            fontSize: 14,
            background: "#fafafa",
            outline: "none",
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = "#0d9488")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "#e5e7eb")}
        />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {filtered.length === 0 ? (
          <div
            style={{ textAlign: "center", color: "#9ca3af", padding: "40px 0" }}
          >
            No notifications found.
          </div>
        ) : (
          filtered.map((n) => (
            <NotificationCard
              key={n.id}
              notif={n}
              onDelete={onDelete}
              onView={onView}
            />
          ))
        )}
      </div>
    </div>
  );
}

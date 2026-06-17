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
      {/* Sub-tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
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
                padding: "8px 16px",
                borderRadius: 999,
                border: "1.5px solid",
                borderColor: active ? "#0d9488" : "#e5e7eb",
                background: active ? "#0d9488" : "#fff",
                color: active ? "#fff" : "#6b7280",
                fontWeight: 600,
                fontSize: 13,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 6,
                transition: "all 0.15s",
              }}
            >
              {s === "instant" ? (
                <>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                  </svg>
                  Instant &amp; Sent
                </>
              ) : (
                <>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  Scheduled ({scheduledCount})
                </>
              )}
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div style={{ position: "relative", marginBottom: 16 }}>
        <span
          style={{
            position: "absolute",
            left: 12,
            top: "50%",
            transform: "translateY(-50%)",
            color: "#9ca3af",
            pointerEvents: "none",
            display: "flex",
            alignItems: "center",
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        </span>
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search notifications..."
          style={{
            width: "100%",
            boxSizing: "border-box",
            padding: "10px 14px 10px 36px",
            border: "1.5px solid #e5e7eb",
            borderRadius: 8,
            fontSize: 13.5,
            background: "#fff",
            outline: "none",
            color: "#374151",
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = "#0d9488")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "#e5e7eb")}
        />
      </div>

      {/* Cards */}
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

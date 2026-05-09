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
      <div
        style={{
          background: "#f5f3ff",
          border: "1px solid #ddd6fe",
          borderRadius: 10,
          padding: "12px 16px",
          marginBottom: 20,
          display: "flex",
          gap: 10,
        }}
      >
        <span style={{ color: "#7c3aed", fontSize: 17, flexShrink: 0 }}>
          ⚡
        </span>
        <div>
          <p
            style={{
              margin: 0,
              fontWeight: 700,
              fontSize: 13.5,
              color: "#7c3aed",
            }}
          >
            Automated System Notifications
          </p>
          <p style={{ margin: "3px 0 0", fontSize: 13, color: "#6d28d9" }}>
            These notifications are triggered automatically by system events.
          </p>
        </div>
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
        <button
          onClick={onRefresh}
          style={{
            padding: "9px 12px",
            borderRadius: 10,
            border: "1px solid #e5e7eb",
            background: "#fff",
            fontSize: 13,
            cursor: "pointer",
          }}
        >
          Refresh
        </button>
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
          placeholder="Search system notifications..."
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
          onFocus={(e) => (e.currentTarget.style.borderColor = "#7c3aed")}
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

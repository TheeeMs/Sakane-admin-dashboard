import { useState } from "react";
import type { PushNotification } from "../../types";
import { PriorityBadge, StatusBadge } from "../shared/Badges";

function EyeBtn({ onClick }: { onClick: () => void }) {
  const [h, setH] = useState(false);
  return (
    <button
      title="View"
      onClick={onClick}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        background: h ? "#f0fdf4" : "transparent",
        border: "none",
        borderRadius: 6,
        width: 30,
        height: 30,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: h ? "#0d9488" : "#9ca3af",
        transition: "all 0.15s",
      }}
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
      </svg>
    </button>
  );
}

function TrashBtn({ onClick }: { onClick: () => void }) {
  const [h, setH] = useState(false);
  return (
    <button
      title="Delete"
      onClick={onClick}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        background: h ? "#fef2f2" : "transparent",
        border: "none",
        borderRadius: 6,
        width: 30,
        height: 30,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: h ? "#dc2626" : "#9ca3af",
        transition: "all 0.15s",
      }}
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
      </svg>
    </button>
  );
}

export function NotificationCard({
  notif,
  onDelete,
  onView,
}: {
  notif: PushNotification;
  onDelete: (id: string) => void;
  onView?: (notif: PushNotification) => void;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#fff",
        border: "1px solid",
        borderColor: hovered ? "#d1fae5" : "#e5e7eb",
        borderRadius: 10,
        padding: "16px 18px",
        transition: "all 0.18s",
        boxShadow: hovered ? "0 2px 12px rgba(13,148,136,0.08)" : "none",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
        }}
      >
        {/* Left content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              flexWrap: "wrap",
              marginBottom: 6,
            }}
          >
            <span style={{ fontWeight: 600, fontSize: 14, color: "#111827" }}>
              {notif.title}
            </span>
            <StatusBadge status={notif.status} />
            <PriorityBadge priority={notif.priority} />
          </div>
          <p
            style={{
              color: "#6b7280",
              fontSize: 13,
              margin: "0 0 10px",
              lineHeight: 1.55,
            }}
          >
            {notif.description}
          </p>
          <div
            style={{
              display: "flex",
              gap: 16,
              flexWrap: "wrap",
              fontSize: 12,
              color: "#9ca3af",
              alignItems: "center",
            }}
          >
            {notif.recipients !== undefined && (
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
                {notif.recipients} recipients
              </span>
            )}
            {notif.readPercent !== undefined && (
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                </svg>
                {notif.readCount} read ({notif.readPercent}%)
              </span>
            )}
            {notif.sentAt && (
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                </svg>
                {notif.sentAt}
              </span>
            )}
            {notif.scheduledAt && (
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                {notif.scheduledAt}
              </span>
            )}
            {notif.sentBy && <span>By {notif.sentBy}</span>}
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display: "flex", gap: 4, marginLeft: 12, flexShrink: 0 }}>
          {onView && (
            <EyeBtn onClick={() => onView(notif)} />
          )}
          <TrashBtn onClick={() => onDelete(notif.id)} />
        </div>
      </div>
    </div>
  );
}

// src/pages/Announcements/components/PushNotifications/NotificationCard.tsx

import { useState } from "react";
import type { NotificationAPI } from "@/lib/notificationService";

// ─── Config ───────────────────────────────────────────────────────────────────

const statusConfig: Record<string, { bg: string; text: string; border: string; icon: string }> = {
  SENT:    { bg: "#f0fdf4", text: "#15803d", border: "#bbf7d0", icon: "✓" },
  PENDING: { bg: "#fffbeb", text: "#92400e", border: "#fde68a", icon: "⏳" },
  FAILED:  { bg: "#fef2f2", text: "#991b1b", border: "#fecaca", icon: "✗" },
  READ:    { bg: "#f0f9ff", text: "#0369a1", border: "#bae6fd", icon: "👁" },
};

const priorityConfig: Record<string, { bg: string; text: string; border: string }> = {
  HIGH:   { bg: "#fff7ed", text: "#c2410c", border: "#fed7aa" },
  MEDIUM: { bg: "#fefce8", text: "#854d0e", border: "#fef08a" },
  LOW:    { bg: "#f0fdf4", text: "#166534", border: "#bbf7d0" },
};

const typeLabels: Record<string, string> = {
  MAINTENANCE_UPDATE: "Maintenance",
  PAYMENT_REMINDER:   "Payment",
  PAYMENT_DUE:        "Payment Due",
  EVENT_REMINDER:     "Event",
  ANNOUNCEMENT:       "Announcement",
  ALERT:              "Alert",
  GENERAL:            "General",
};

// ─── Details Modal ────────────────────────────────────────────────────────────

function DetailsModal({ notif, onClose }: { notif: NotificationAPI; onClose: () => void }) {
  const statusCfg = statusConfig[notif.status] ?? statusConfig["PENDING"];

  const sentDate = notif.sentAt
    ? new Date(notif.sentAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })
    : "—";

  const readDate = notif.readAt
    ? new Date(notif.readAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })
    : null;

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, backdropFilter: "blur(4px)" }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: "#fff", borderRadius: 20, padding: "28px 32px", width: "100%", maxWidth: 520, boxShadow: "0 24px 64px rgba(0,0,0,0.2)", maxHeight: "90vh", overflowY: "auto" }}>

        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#111827" }}>Notification Details</h2>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: "50%", border: "none", background: "#f3f4f6", cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", color: "#6b7280" }}>✕</button>
        </div>

        <hr style={{ border: "none", borderTop: "1px solid #f3f4f6", margin: "0 0 20px" }} />

        {/* Title + badges */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 10 }}>
            <span style={{ fontWeight: 700, fontSize: 16, color: "#111827" }}>{notif.title}</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 10px", borderRadius: 999, fontSize: 12, fontWeight: 600, background: statusCfg.bg, color: statusCfg.text, border: `1px solid ${statusCfg.border}` }}>
              {statusCfg.icon} {notif.status}
            </span>
            {notif.isUrgent && (
              <span style={{ padding: "3px 10px", borderRadius: 999, fontSize: 12, fontWeight: 700, background: "#fff7ed", color: "#c2410c", border: "1px solid #fed7aa" }}>HIGH</span>
            )}
          </div>
          <p style={{ margin: 0, fontSize: 14, color: "#6b7280", lineHeight: 1.6 }}>{notif.body}</p>
        </div>

        {/* Stats cards - like Figma */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
          <div style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 12, padding: "16px" }}>
            <p style={{ margin: "0 0 8px", fontSize: 12, color: "#9ca3af", fontWeight: 500 }}>Recipients</p>
            <p style={{ margin: 0, fontSize: 28, fontWeight: 800, color: "#111827" }}>—</p>
          </div>
          <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 12, padding: "16px" }}>
            <p style={{ margin: "0 0 8px", fontSize: 12, color: "#9ca3af", fontWeight: 500 }}>Read Count</p>
            <p style={{ margin: "0 0 4px", fontSize: 28, fontWeight: 800, color: "#111827" }}>
              {readDate ? "1" : "0"}
            </p>
            {readDate && <p style={{ margin: 0, fontSize: 12, color: "#16a34a", fontWeight: 600 }}>✓ Read on {readDate}</p>}
          </div>
        </div>

        {/* Meta rows */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
          {[
            { label: "Created By", value: "—" },
            { label: "Created At", value: sentDate },
            { label: "Sent At",    value: sentDate, color: "#0d9488" },
          ].map((row) => (
            <div key={row.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 14 }}>
              <span style={{ color: "#6b7280" }}>{row.label}</span>
              <span style={{ fontWeight: 600, color: (row as { color?: string }).color ?? "#111827" }}>{row.value}</span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{ padding: "10px 24px", border: "1.5px solid #e5e7eb", borderRadius: 10, background: "#fff", color: "#374151", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>Close</button>
          <button style={{ padding: "10px 24px", border: "none", borderRadius: 10, background: "linear-gradient(135deg,#0d9488,#14b8a6)", color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
            ✏ Edit
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Notification Card ────────────────────────────────────────────────────────

interface Props {
  notif: NotificationAPI;
  onMarkRead: (id: string) => void;
  onDelete: (id: string) => void;
}

export function NotificationCard({ notif, onMarkRead, onDelete }: Props) {
  const [hovered,     setHovered]     = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const statusCfg  = statusConfig[notif.status]  ?? statusConfig["PENDING"];
  const priorityCfg = notif.isUrgent ? priorityConfig["HIGH"] : priorityConfig["LOW"];

  const sentDate = notif.sentAt
    ? new Date(notif.sentAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })
    : null;

  const typeLabel = typeLabels[notif.type] ?? notif.type.replace(/_/g, " ");

  return (
    <>
      {showDetails && <DetailsModal notif={notif} onClose={() => setShowDetails(false)} />}

      {/* Delete Confirm */}
      {showConfirm && (
        <div onClick={() => setShowConfirm(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, backdropFilter: "blur(4px)" }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: "#fff", borderRadius: 16, padding: 28, width: "100%", maxWidth: 380, boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
            <div style={{ fontSize: 28, marginBottom: 12 }}>🗑️</div>
            <h3 style={{ margin: "0 0 8px", fontSize: 17, fontWeight: 800, color: "#111827" }}>Delete Notification</h3>
            <p style={{ margin: "0 0 6px", fontSize: 14, color: "#6b7280" }}>Are you sure you want to delete:</p>
            <p style={{ margin: "0 0 16px", fontSize: 14, fontWeight: 600, color: "#111827", background: "#f9fafb", padding: "8px 12px", borderRadius: 8, border: "1px solid #e5e7eb" }}>"{notif.title}"</p>
            <p style={{ margin: "0 0 20px", fontSize: 13, color: "#9ca3af" }}>This will only remove it from your view.</p>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button onClick={() => setShowConfirm(false)} style={{ padding: "9px 20px", border: "1px solid #e5e7eb", borderRadius: 8, background: "#fff", color: "#374151", fontWeight: 600, cursor: "pointer" }}>Cancel</button>
              <button onClick={() => { onDelete(notif.id); setShowConfirm(false); }} style={{ padding: "9px 20px", border: "none", borderRadius: 8, background: "#dc2626", color: "#fff", fontWeight: 700, cursor: "pointer" }}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Card - Figma style */}
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ background: "#fff", border: "1px solid", borderColor: hovered ? "#e5e7eb" : "#f3f4f6", borderRadius: 12, padding: "20px 24px", transition: "all 0.18s", boxShadow: hovered ? "0 4px 16px rgba(0,0,0,0.08)" : "0 1px 3px rgba(0,0,0,0.04)" }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
          <div style={{ flex: 1, minWidth: 0 }}>

            {/* Title row */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 6 }}>
              <span style={{ fontWeight: 700, fontSize: 15, color: "#111827" }}>{notif.title}</span>

              {/* Status badge */}
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 10px", borderRadius: 999, fontSize: 11, fontWeight: 600, background: statusCfg.bg, color: statusCfg.text, border: `1px solid ${statusCfg.border}` }}>
                {statusCfg.icon} {notif.status}
              </span>

              {/* Priority badge */}
              <span style={{ padding: "2px 10px", borderRadius: 999, fontSize: 11, fontWeight: 600, background: priorityCfg.bg, color: priorityCfg.text, border: `1px solid ${priorityCfg.border}` }}>
                {notif.isUrgent ? "HIGH" : "LOW"}
              </span>
            </div>

            {/* Body */}
            <p style={{ color: "#6b7280", fontSize: 13.5, margin: "0 0 10px", lineHeight: 1.55, overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as React.CSSProperties["WebkitBoxOrient"] }}>
              {notif.body}
            </p>

            {/* Meta row - like Figma */}
            <div style={{ display: "flex", gap: 20, flexWrap: "wrap", fontSize: 12, color: "#9ca3af" }}>
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                👥 — recipients
              </span>
              {notif.readAt && (
                <span style={{ display: "flex", alignItems: "center", gap: 4, color: "#0d9488" }}>
                  👁 Read
                </span>
              )}
              {sentDate && (
                <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  ✓ {sentDate}
                </span>
              )}
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                📡 {typeLabel}
              </span>
            </div>
          </div>

          {/* Action icons */}
          <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
            <button
              onClick={() => setShowDetails(true)}
              title="View details"
              style={{ width: 34, height: 34, border: "1px solid #e5e7eb", borderRadius: 8, background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#9ca3af", transition: "all 0.15s", fontSize: 15 }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#0d9488"; e.currentTarget.style.color = "#0d9488"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.color = "#9ca3af"; }}
            >
              👁
            </button>

            {notif.status === "Draft" && (
              <button
                title="Edit"
                style={{ width: 34, height: 34, border: "1px solid #e5e7eb", borderRadius: 8, background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#9ca3af", transition: "all 0.15s", fontSize: 15 }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#2563eb"; e.currentTarget.style.color = "#2563eb"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.color = "#9ca3af"; }}
              >
                ✏
              </button>
            )}

            <button
              onClick={() => setShowConfirm(true)}
              title="Delete"
              style={{ width: 34, height: 34, border: "1px solid #e5e7eb", borderRadius: 8, background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#9ca3af", transition: "all 0.15s", fontSize: 15 }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#dc2626"; e.currentTarget.style.color = "#dc2626"; e.currentTarget.style.background = "#fef2f2"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.color = "#9ca3af"; e.currentTarget.style.background = "#fff"; }}
            >
              🗑
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
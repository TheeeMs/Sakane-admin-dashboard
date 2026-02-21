import { useState } from "react";
import type { PushNotification } from "../../types";
import { PriorityBadge, StatusBadge } from "../shared/Badges";
import { ActionBtn } from "../shared/ActionButtons";

export function NotificationCard({ notif, onDelete }: { notif: PushNotification; onDelete: (id: number) => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{ background: hovered ? "#fafffe" : "#fff", border: "1px solid", borderColor: hovered ? "#2dd4bf33" : "#e5e7eb", borderRadius: 12, padding: "18px 20px", transition: "all 0.18s", boxShadow: hovered ? "0 4px 16px rgba(13,148,136,0.08)" : "none" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
            <span style={{ fontWeight: 700, fontSize: 15, color: "#111827" }}>{notif.title}</span>
            <StatusBadge status={notif.status} />
            <PriorityBadge priority={notif.priority} />
          </div>
          <p style={{ color: "#6b7280", fontSize: 13.5, margin: "0 0 10px", lineHeight: 1.55 }}>{notif.description}</p>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", fontSize: 12, color: "#9ca3af" }}>
            {notif.recipients !== undefined && <span>👥 {notif.recipients} recipients</span>}
            {notif.readPercent !== undefined && <span>👁 {notif.readCount} read ({notif.readPercent}%)</span>}
            {notif.sentAt && <span>🕐 {notif.sentAt}</span>}
            {notif.scheduledAt && <span>📅 {notif.scheduledAt}</span>}
            {notif.sentBy && <span>By {notif.sentBy}</span>}
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, marginLeft: 16 }}>
          <ActionBtn icon="👁" title="View" color="#6b7280" hoverColor="#0d9488" />
          {notif.status === "Draft" && <ActionBtn icon="✏" title="Edit" color="#6b7280" hoverColor="#2563eb" />}
          <ActionBtn icon="🗑" title="Delete" color="#6b7280" hoverColor="#dc2626" onClick={() => onDelete(notif.id)} />
        </div>
      </div>
    </div>
  );
}
import { useState } from "react";
import type { SystemNotif } from "../../types";
import { categoryColors } from "../../data/systemData";
import { EditIcon, BarChartIcon } from "../shared/Icons";
import { SysActionBtn } from "../shared/ActionButtons";
import { Toggle } from "./Toggle";

function StatCell({ label, value, valueColor }: { label: string; value: string; valueColor?: string }) {
  return <div><p style={{ margin: 0, fontSize: 11, color: "#9ca3af", marginBottom: 2 }}>{label}</p><p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: valueColor || "#111827" }}>{value}</p></div>;
}

export function SystemNotifCard({ notif, onToggle }: { notif: SystemNotif; onToggle: () => void }) {
  const [hovered, setHovered] = useState(false);
  const catCfg = categoryColors[notif.category];
  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{ background: hovered ? "#fafffe" : "#fff", border: "1px solid", borderColor: hovered ? "#14b8a633" : "#e5e7eb", borderRadius: 12, padding: "18px 20px", transition: "all 0.18s" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
        <div style={{ display: "flex", gap: 14, flex: 1, minWidth: 0 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: notif.enabled ? "#f0fdf4" : "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{notif.icon}</div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
              <span style={{ fontWeight: 700, fontSize: 15, color: "#111827" }}>{notif.title}</span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 9px", borderRadius: 999, fontSize: 11, fontWeight: 600, background: notif.enabled ? "#f0fdf4" : "#f3f4f6", color: notif.enabled ? "#16a34a" : "#6b7280", border: "1px solid currentColor" }}><span style={{ width: 6, height: 6, borderRadius: "50%", background: "currentColor", display: "inline-block" }} />{notif.enabled ? "Enabled" : "Disabled"}</span>
              <span style={{ padding: "2px 9px", borderRadius: 999, fontSize: 11, fontWeight: 600, background: catCfg.bg, color: catCfg.text }}>{notif.category}</span>
            </div>
            <div style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 8, padding: "8px 12px", fontSize: 12.5, color: "#374151", fontFamily: "monospace", lineHeight: 1.5, marginBottom: 12 }}>{notif.template}</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
              <StatCell label="Trigger Condition" value={notif.triggerCondition} />
              <StatCell label="Total Sent" value={notif.totalSent.toLocaleString()} />
              <StatCell label="Success Rate" value={`${notif.successRate}%`} valueColor={notif.successRate >= 98 ? "#16a34a" : notif.successRate >= 95 ? "#d97706" : "#dc2626"} />
              <StatCell label="Last Sent" value={notif.lastSent} />
            </div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10, flexShrink: 0 }}>
          <Toggle enabled={notif.enabled} onChange={onToggle} />
          <SysActionBtn icon={<EditIcon />} title="Edit" hoverColor="#0d9488" />
          <SysActionBtn icon={<BarChartIcon />} title="Stats" hoverColor="#7c3aed" />
        </div>
      </div>
    </div>
  );
}
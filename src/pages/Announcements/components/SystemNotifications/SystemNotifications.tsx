import { useState } from "react";
import { systemNotifData } from "../../data/systemData";
import { SystemNotifCard } from "./SystemNotifCard";

export function SystemNotifications() {
  const [list, setList] = useState(systemNotifData);
  const toggle = (id: number) => setList((p) => p.map((n) => n.id === id ? { ...n, enabled: !n.enabled } : n));
  const activeCount = list.filter((n) => n.enabled).length;
  const totalSent = list.reduce((a, b) => a + b.totalSent, 0);
  const avgSuccess = (list.reduce((a, b) => a + b.successRate, 0) / list.length).toFixed(1);
  const stats = [
    { label: "ACTIVE", value: activeCount, color: "#0d9488", bg: "#f0fdf4", icon: "✓" },
    { label: "TOTAL SENT", value: totalSent.toLocaleString(), color: "#3b82f6", bg: "#eff6ff", icon: "✈" },
    { label: "AVG SUCCESS", value: `${avgSuccess}%`, color: "#8b5cf6", bg: "#f5f3ff", icon: "↗" },
    { label: "TEMPLATES", value: list.length, color: "#f59e0b", bg: "#fffbeb", icon: "📄" },
  ];
  return (
    <div>
      <div style={{ background: "#f5f3ff", border: "1px solid #ddd6fe", borderRadius: 10, padding: "12px 16px", marginBottom: 20, display: "flex", gap: 10 }}>
        <span style={{ color: "#7c3aed", fontSize: 17, flexShrink: 0 }}>⚡</span>
        <div>
          <p style={{ margin: 0, fontWeight: 700, fontSize: 13.5, color: "#7c3aed" }}>Automated System Notifications</p>
          <p style={{ margin: "3px 0 0", fontSize: 13, color: "#6d28d9" }}>These notifications are triggered automatically by system events.</p>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 14, marginBottom: 24 }}>
        {stats.map((s) => (
          <div key={s.label} style={{ background: s.bg, borderRadius: 12, padding: "16px 18px", border: `1px solid ${s.color}22` }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: s.color, letterSpacing: "0.06em" }}>{s.label}</span>
              <span style={{ fontSize: 18 }}>{s.icon}</span>
            </div>
            <div style={{ fontSize: 26, fontWeight: 800, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {list.map((n) => <SystemNotifCard key={n.id} notif={n} onToggle={() => toggle(n.id)} />)}
      </div>
    </div>
  );
}
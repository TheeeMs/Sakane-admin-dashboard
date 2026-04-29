// src/pages/Announcements/components/SystemNotifications/SystemNotifications.tsx

import { useState, useEffect, useCallback } from "react";
import { SystemNotifCard } from "./SystemNotifCard";
import { LoadingSpinner } from "../shared/Loadingspinner";
import { fetchSystemTemplates, type SystemTemplate } from "../../../../lib/Systemtemplateservice";

interface Props {
  onRegisterRefresh?: (fn: () => void) => void;
}

export function SystemNotifications({ onRegisterRefresh }: Props) {
  const [list,    setList]    = useState<SystemTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true); setError(null);
      const data = await fetchSystemTemplates();
      setList(data);
    } catch (err) { setError((err as Error).message); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { onRegisterRefresh?.(load); }, [load, onRegisterRefresh]);

  const handleToggle = (id: string) => {
    setList((prev) => prev.map((t) => t.id === id ? { ...t, isEnabled: !t.isEnabled } : t));
  };

  const activeCount = list.filter((t) => t.isEnabled).length;
  const totalSent   = list.reduce((a, b) => a + (b.totalSent ?? 0), 0);
  const avgSuccess  = list.length > 0
    ? (list.reduce((a, b) => a + (b.successRate ?? 0), 0) / list.length).toFixed(1)
    : "0";

  const stats = [
    { label: "ACTIVE",      value: activeCount,               color: "#0d9488", bg: "#f0fdf4", iconBg: "#dcfce7", icon: "✓"  },
    { label: "TOTAL SENT",  value: totalSent.toLocaleString(), color: "#3b82f6", bg: "#eff6ff", iconBg: "#dbeafe", icon: "✈"  },
    { label: "AVG SUCCESS", value: `${avgSuccess}%`,           color: "#8b5cf6", bg: "#f5f3ff", iconBg: "#ede9fe", icon: "↗"  },
    { label: "TEMPLATES",   value: list.length,                color: "#f59e0b", bg: "#fffbeb", iconBg: "#fef3c7", icon: "📄" },
  ];

  return (
    <div>
      <div style={{ background: "#faf5ff", border: "1px solid #ddd6fe", borderRadius: 10, padding: "12px 16px", marginBottom: 20, display: "flex", gap: 10 }}>
        <span style={{ color: "#7c3aed", fontSize: 17, flexShrink: 0 }}>⚡</span>
        <div>
          <p style={{ margin: 0, fontWeight: 700, fontSize: 13.5, color: "#7c3aed" }}>Automated System Notifications</p>
          <p style={{ margin: "3px 0 0", fontSize: 13, color: "#6d28d9" }}>These notifications are triggered automatically by system events. You can enable/disable them, edit templates, and monitor performance.</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
        {stats.map((s) => (
          <div key={s.label} style={{ background: s.bg, borderRadius: 12, padding: "16px 20px", border: `1px solid ${s.color}22`, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <p style={{ margin: "0 0 8px", fontSize: 11, fontWeight: 700, color: s.color, letterSpacing: "0.06em" }}>{s.label}</p>
              <p style={{ margin: 0, fontSize: 28, fontWeight: 800, color: s.color }}>{s.value}</p>
            </div>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: s.iconBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>{s.icon}</div>
          </div>
        ))}
      </div>

      {loading ? (
        <LoadingSpinner text="Loading templates…" />
      ) : error ? (
        <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: "16px 20px", color: "#dc2626", display: "flex", gap: 10, alignItems: "center" }}>
          <span>⚠️</span>
          <div><strong>Failed to load</strong><p style={{ margin: "4px 0 0", fontSize: 13 }}>{error}</p></div>
          <button onClick={load} style={{ marginLeft: "auto", padding: "6px 14px", border: "1px solid #fca5a5", borderRadius: 8, background: "#fff", color: "#dc2626", cursor: "pointer", fontWeight: 600 }}>Retry</button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {list.map((t) => <SystemNotifCard key={t.id} template={t} onToggle={handleToggle} />)}
        </div>
      )}
    </div>
  );
}
// src/pages/Announcements/components/SystemNotifications/SystemNotifCard.tsx

import { useState } from "react";
import type { SystemTemplate } from "../../../../lib/Systemtemplateservice";
import { categoryConfig } from "../../../../lib/Systemtemplateservice";

// ─── Toggle ───────────────────────────────────────────────────────────────────

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: () => void }) {
  return (
    <div
      onClick={onChange}
      style={{ width: 44, height: 24, borderRadius: 999, background: enabled ? "#0d9488" : "#d1d5db", cursor: "pointer", position: "relative", transition: "background 0.2s", flexShrink: 0 }}
    >
      <div style={{ position: "absolute", top: 3, left: enabled ? 23 : 3, width: 18, height: 18, borderRadius: "50%", background: "#fff", transition: "left 0.2s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
    </div>
  );
}

// ─── Edit Modal ───────────────────────────────────────────────────────────────

function EditModal({ template, onClose }: { template: SystemTemplate; onClose: () => void }) {
  const [name,    setName]    = useState(template.title);
  const [message, setMessage] = useState(template.messageTemplate);
  const [trigger, setTrigger] = useState(template.triggerCondition);

  const inputStyle: React.CSSProperties = {
    width: "100%", boxSizing: "border-box", padding: "12px 16px",
    border: "1.5px solid #e5e7eb", borderRadius: 10, fontSize: 14, color: "#111827", background: "#fff", outline: "none",
  };
  const focus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => (e.currentTarget.style.borderColor = "#0d9488");
  const blur  = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => (e.currentTarget.style.borderColor = "#e5e7eb");

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, backdropFilter: "blur(4px)" }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: "#fff", borderRadius: 20, padding: "28px 32px", width: "100%", maxWidth: 520, boxShadow: "0 24px 64px rgba(0,0,0,0.2)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#111827" }}>Edit Template</h2>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: "50%", border: "none", background: "#f3f4f6", cursor: "pointer", fontSize: 14, color: "#6b7280" }}>✕</button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 8 }}>Template Name *</label>
            <input value={name} onChange={(e) => setName(e.target.value)} style={inputStyle} onFocus={focus} onBlur={blur} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 8 }}>Message Template *</label>
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={4} style={{ ...inputStyle, resize: "vertical" }} onFocus={focus} onBlur={blur} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 8 }}>Trigger Condition *</label>
            <input value={trigger} onChange={(e) => setTrigger(e.target.value)} style={inputStyle} onFocus={focus} onBlur={blur} />
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 24, justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{ padding: "10px 24px", border: "1.5px solid #e5e7eb", borderRadius: 10, background: "#fff", color: "#374151", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>Cancel</button>
          <button onClick={onClose} style={{ padding: "10px 24px", border: "none", borderRadius: 10, background: "linear-gradient(135deg,#0d9488,#14b8a6)", color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
            💾 Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Analytics Modal ──────────────────────────────────────────────────────────

function AnalyticsModal({ template, onClose }: { template: SystemTemplate; onClose: () => void }) {
  const cfg = categoryConfig[template.category] ?? categoryConfig["General"];

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, backdropFilter: "blur(4px)" }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: "#fff", borderRadius: 20, padding: "28px 32px", width: "100%", maxWidth: 520, boxShadow: "0 24px 64px rgba(0,0,0,0.2)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#111827" }}>Template Analytics</h2>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: "50%", border: "none", background: "#f3f4f6", cursor: "pointer", fontSize: 14, color: "#6b7280" }}>✕</button>
        </div>

        {/* Title */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: cfg.iconBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{cfg.icon}</div>
          <span style={{ fontWeight: 700, fontSize: 16, color: "#111827" }}>{template.title}</span>
          <span style={{ padding: "2px 10px", borderRadius: 999, fontSize: 12, fontWeight: 600, background: template.isEnabled ? "#f0fdf4" : "#f3f4f6", color: template.isEnabled ? "#16a34a" : "#6b7280", border: `1px solid ${template.isEnabled ? "#bbf7d0" : "#e5e7eb"}` }}>
            {template.isEnabled ? "• Enabled" : "○ Disabled"}
          </span>
        </div>
        <p style={{ margin: "0 0 20px", fontSize: 13.5, color: "#6b7280", lineHeight: 1.6, fontFamily: "monospace", background: "#f9fafb", padding: "10px 12px", borderRadius: 8, border: "1px solid #e5e7eb" }}>
          {template.messageTemplate}
        </p>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 20 }}>
          <div style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 12, padding: "14px" }}>
            <p style={{ margin: "0 0 6px", fontSize: 11, color: "#9ca3af" }}>Total Sent</p>
            <p style={{ margin: 0, fontSize: 24, fontWeight: 800, color: "#111827" }}>{template.totalSent?.toLocaleString() ?? "—"}</p>
          </div>
          <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 12, padding: "14px" }}>
            <p style={{ margin: "0 0 6px", fontSize: 11, color: "#9ca3af" }}>Success Rate</p>
            <p style={{ margin: 0, fontSize: 24, fontWeight: 800, color: "#16a34a" }}>{template.successRate ? `${template.successRate}%` : "—"}</p>
          </div>
          <div style={{ background: "#faf5ff", border: "1px solid #e9d5ff", borderRadius: 12, padding: "14px" }}>
            <p style={{ margin: "0 0 6px", fontSize: 11, color: "#9ca3af" }}>Last Sent</p>
            <p style={{ margin: 0, fontSize: 18, fontWeight: 800, color: "#7c3aed" }}>{template.lastSent ?? "—"}</p>
          </div>
        </div>

        {/* Meta */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
            <span style={{ color: "#6b7280" }}>Notification Type</span>
            <span style={{ fontWeight: 600, padding: "2px 10px", borderRadius: 999, fontSize: 12, background: cfg.badgeBg, color: cfg.badgeText }}>{template.category}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
            <span style={{ color: "#6b7280" }}>Trigger Condition</span>
            <span style={{ fontWeight: 600, color: "#111827" }}>{template.triggerCondition}</span>
          </div>
        </div>

        {/* Performance History */}
        <div style={{ background: "#f8faff", border: "1px solid #dbeafe", borderRadius: 12, padding: "16px", marginBottom: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <span>📊</span>
            <span style={{ fontWeight: 700, fontSize: 14, color: "#1d4ed8" }}>Performance History</span>
          </div>
          {[
            { label: "Last 7 days",  sent: Math.round((template.totalSent ?? 0) * 0.03), success: `${((template.successRate ?? 0) - 0.2).toFixed(1)}%` },
            { label: "Last 30 days", sent: Math.round((template.totalSent ?? 0) * 0.12), success: `${((template.successRate ?? 0) - 0.1).toFixed(1)}%` },
            { label: "All time",     sent: template.totalSent ?? 0, success: `${template.successRate ?? 0}%` },
          ].map((row) => (
            <div key={row.label} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 8 }}>
              <span style={{ color: "#6b7280" }}>{row.label}</span>
              <span style={{ fontWeight: 600, color: "#374151" }}>{row.sent.toLocaleString()} sent • {row.success} success</span>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{ padding: "10px 24px", border: "1.5px solid #e5e7eb", borderRadius: 10, background: "#fff", color: "#374151", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>Close</button>
        </div>
      </div>
    </div>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────

interface Props {
  template: SystemTemplate;
  onToggle: (id: string) => void;
}

export function SystemNotifCard({ template, onToggle }: Props) {
  const [hovered,       setHovered]       = useState(false);
  const [showEdit,      setShowEdit]      = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);

  const cfg = categoryConfig[template.category] ?? categoryConfig["General"];

  return (
    <>
      {showEdit      && <EditModal      template={template} onClose={() => setShowEdit(false)} />}
      {showAnalytics && <AnalyticsModal template={template} onClose={() => setShowAnalytics(false)} />}

      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ background: hovered ? "#fafffe" : "#fff", border: "1px solid", borderColor: hovered ? "#d1fae5" : "#e5e7eb", borderRadius: 12, padding: "20px 24px", transition: "all 0.18s", boxShadow: hovered ? "0 4px 16px rgba(0,0,0,0.07)" : "0 1px 3px rgba(0,0,0,0.04)" }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>

          <div style={{ display: "flex", gap: 14, flex: 1, minWidth: 0 }}>
            {/* Category icon */}
            <div style={{ width: 44, height: 44, borderRadius: 12, background: cfg.iconBg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>
              {cfg.icon}
            </div>

            <div style={{ flex: 1 }}>
              {/* Title + badges */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
                <span style={{ fontWeight: 700, fontSize: 15, color: "#111827" }}>{template.title}</span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "2px 9px", borderRadius: 999, fontSize: 11, fontWeight: 600, background: template.isEnabled ? "#f0fdf4" : "#f3f4f6", color: template.isEnabled ? "#16a34a" : "#6b7280", border: `1px solid ${template.isEnabled ? "#bbf7d0" : "#e5e7eb"}` }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "currentColor", display: "inline-block" }} />
                  {template.isEnabled ? "Enabled" : "Disabled"}
                </span>
                <span style={{ padding: "2px 9px", borderRadius: 999, fontSize: 11, fontWeight: 600, background: cfg.badgeBg, color: cfg.badgeText }}>
                  {template.category}
                </span>
              </div>

              {/* Message template */}
              <div style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 8, padding: "8px 12px", fontSize: 12.5, color: "#374151", fontFamily: "monospace", lineHeight: 1.5, marginBottom: 12 }}>
                {template.messageTemplate}
              </div>

              {/* Stats grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
                <div>
                  <p style={{ margin: 0, fontSize: 11, color: "#9ca3af", marginBottom: 2 }}>Trigger Condition</p>
                  <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: "#111827" }}>{template.triggerCondition}</p>
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: 11, color: "#9ca3af", marginBottom: 2 }}>Total Sent</p>
                  <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: "#111827" }}>{template.totalSent?.toLocaleString() ?? "—"}</p>
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: 11, color: "#9ca3af", marginBottom: 2 }}>Success Rate</p>
                  <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: template.successRate && template.successRate >= 98 ? "#16a34a" : template.successRate && template.successRate >= 95 ? "#d97706" : "#dc2626" }}>
                    {template.successRate ? `${template.successRate}%` : "—"}
                  </p>
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: 11, color: "#9ca3af", marginBottom: 2 }}>Last Sent</p>
                  <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: "#111827" }}>{template.lastSent ?? "—"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right actions */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10, flexShrink: 0 }}>
            {/* Toggle */}
            <Toggle enabled={template.isEnabled} onChange={() => onToggle(template.id)} />

            {/* Edit */}
            <button
              onClick={() => setShowEdit(true)}
              title="Edit template"
              style={{ width: 32, height: 32, border: "1px solid #e5e7eb", borderRadius: 8, background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#9ca3af", fontSize: 14, transition: "all 0.15s" }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#0d9488"; e.currentTarget.style.color = "#0d9488"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.color = "#9ca3af"; }}
            >
              ✏
            </button>

            {/* Analytics */}
            <button
              onClick={() => setShowAnalytics(true)}
              title="View analytics"
              style={{ width: 32, height: 32, border: "1px solid #e5e7eb", borderRadius: 8, background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#9ca3af", fontSize: 14, transition: "all 0.15s" }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#7c3aed"; e.currentTarget.style.color = "#7c3aed"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.color = "#9ca3af"; }}
            >
              📊
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
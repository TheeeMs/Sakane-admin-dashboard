// src/pages/Announcements/components/NewsAnnouncements/AnnouncementCard.tsx

import { useState } from "react";
import type { AnnouncementAPI } from "@/lib/announcementService";

// ─── Parse content helper ─────────────────────────────────────────────────────
// Content format: [img:url]text  OR  [color:#hex]text  OR  plain text

interface ParsedContent {
  imageUrl:  string | null;
  bgColor:   string | null;
  text:      string;
}

function parseContent(raw: string): ParsedContent {
  const imgMatch   = raw.match(/^\[img:([^\]]+)\]/);
  const colorMatch = raw.match(/^\[color:([^\]]+)\]/);

  if (imgMatch)   return { imageUrl: imgMatch[1],   bgColor: null,           text: raw.slice(imgMatch[0].length) };
  if (colorMatch) return { imageUrl: null,           bgColor: colorMatch[1],  text: raw.slice(colorMatch[0].length) };
  return { imageUrl: null, bgColor: null, text: raw };
}

// ─── Default colors by priority ───────────────────────────────────────────────

const priorityBg: Record<string, string> = {
  LOW:    "#0d9488",
  NORMAL: "#f59e0b",
  URGENT: "#ef4444",
  // legacy keys
  MEDIUM: "#f59e0b",
  HIGH:   "#ef4444",
};

// ─── Details Modal ────────────────────────────────────────────────────────────

function DetailsModal({ item, parsed, onClose }: { item: AnnouncementAPI; parsed: ParsedContent; onClose: () => void }) {
  const isActive   = item.isActive;
  const expiryDate = new Date(item.expiresAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const headerBg   = parsed.bgColor ?? priorityBg[item.priority] ?? "#0d9488";

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, backdropFilter: "blur(4px)" }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: "#fff", borderRadius: 20, width: "100%", maxWidth: 520, boxShadow: "0 24px 64px rgba(0,0,0,0.2)", overflow: "hidden", maxHeight: "90vh", overflowY: "auto" }}>

        {/* Header */}
        <div style={{ height: 160, position: "relative", background: parsed.imageUrl ? `url(${parsed.imageUrl}) center/cover no-repeat` : headerBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {!parsed.imageUrl && (
            <span style={{ color: "#fff", fontWeight: 800, fontSize: 22, textAlign: "center", padding: "0 24px", textShadow: "0 2px 8px rgba(0,0,0,0.3)" }}>{item.title}</span>
          )}
          <button onClick={onClose} style={{ position: "absolute", top: 12, right: 12, width: 32, height: 32, borderRadius: "50%", border: "none", background: "rgba(0,0,0,0.3)", cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>✕</button>
        </div>

        <div style={{ padding: "24px 28px" }}>
          <h2 style={{ margin: "0 0 8px", fontSize: 18, fontWeight: 800, color: "#111827" }}>Announcement Details</h2>
          <p style={{ margin: "0 0 4px", fontSize: 16, fontWeight: 700, color: "#111827" }}>{item.title}</p>
          <p style={{ margin: "0 0 20px", fontSize: 14, color: "#6b7280", lineHeight: 1.6 }}>{parsed.text}</p>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginBottom: 20 }}>
            <div style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 12, padding: "14px 16px" }}>
              <p style={{ margin: "0 0 6px", fontSize: 11, color: "#9ca3af" }}>Total Views</p>
              <p style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#111827" }}>—</p>
            </div>
            <div style={{ background: isActive ? "#f0fdf4" : "#f9fafb", border: `1px solid ${isActive ? "#bbf7d0" : "#e5e7eb"}`, borderRadius: 12, padding: "14px 16px" }}>
              <p style={{ margin: "0 0 6px", fontSize: 11, color: "#9ca3af" }}>Status</p>
              <p style={{ margin: 0, fontSize: 16, fontWeight: 800, color: isActive ? "#16a34a" : "#6b7280" }}>{isActive ? "Live" : "Inactive"}</p>
            </div>
            <div style={{ background: "#faf5ff", border: "1px solid #e9d5ff", borderRadius: 12, padding: "14px 16px" }}>
              <p style={{ margin: "0 0 6px", fontSize: 11, color: "#9ca3af" }}>Expires</p>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#7c3aed" }}>{expiryDate}</p>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
              <span style={{ color: "#6b7280" }}>Priority</span>
              <span style={{ fontWeight: 600, color: "#111827" }}>{item.priority}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14 }}>
              <span style={{ color: "#6b7280" }}>Expires At</span>
              <span style={{ fontWeight: 600, color: "#0d9488" }}>{expiryDate}</span>
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
            <button onClick={onClose} style={{ padding: "10px 24px", border: "1.5px solid #e5e7eb", borderRadius: 10, background: "#fff", color: "#374151", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>Close</button>
            <button style={{ padding: "10px 24px", border: "none", borderRadius: 10, background: "linear-gradient(135deg,#0d9488,#14b8a6)", color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>✏ Edit</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────

interface Props {
  item: AnnouncementAPI;
  onDeactivate: (id: string) => void;
}

export function AnnouncementCard({ item, onDeactivate }: Props) {
  const [hovered,      setHovered]      = useState(false);
  const [showDetails,  setShowDetails]  = useState(false);
  const [showConfirm,  setShowConfirm]  = useState(false);
  const [deactivating, setDeactivating] = useState(false);

  const parsed   = parseContent(item.content);
  const isActive = item.isActive;
  const headerBg = parsed.bgColor ?? priorityBg[item.priority] ?? "#0d9488";
  const expiryDate = new Date(item.expiresAt).toLocaleDateString("en-US", { month: "short", day: "numeric" });

  const handleConfirmDeactivate = async () => {
    setDeactivating(true);
    try { await onDeactivate(item.id); setShowConfirm(false); }
    finally { setDeactivating(false); }
  };

  return (
    <>
      {showDetails && <DetailsModal item={item} parsed={parsed} onClose={() => setShowDetails(false)} />}

      {/* Confirm Dialog */}
      {showConfirm && (
        <div onClick={() => setShowConfirm(false)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, backdropFilter: "blur(4px)" }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: "#fff", borderRadius: 16, padding: 28, width: "100%", maxWidth: 400, boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
            <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#fef2f2", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, marginBottom: 16 }}>🗑️</div>
            <h3 style={{ margin: "0 0 8px", fontSize: 17, fontWeight: 800, color: "#111827" }}>Deactivate Announcement</h3>
            <p style={{ margin: "0 0 6px", fontSize: 14, color: "#6b7280" }}>Are you sure you want to deactivate:</p>
            <p style={{ margin: "0 0 16px", fontSize: 14, fontWeight: 600, color: "#111827", background: "#f9fafb", padding: "8px 12px", borderRadius: 8, border: "1px solid #e5e7eb" }}>"{item.title}"</p>
            <p style={{ margin: "0 0 20px", fontSize: 13, color: "#9ca3af" }}>This announcement will no longer be visible to residents.</p>
            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button onClick={() => setShowConfirm(false)} disabled={deactivating} style={{ padding: "9px 20px", border: "1px solid #e5e7eb", borderRadius: 8, background: "#fff", color: "#374151", fontWeight: 600, cursor: "pointer" }}>Cancel</button>
              <button onClick={handleConfirmDeactivate} disabled={deactivating} style={{ padding: "9px 20px", border: "none", borderRadius: 8, background: deactivating ? "#fca5a5" : "#dc2626", color: "#fff", fontWeight: 700, cursor: deactivating ? "not-allowed" : "pointer" }}>
                {deactivating ? "Deactivating…" : "Yes, Deactivate"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Card */}
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ background: "#fff", border: "1px solid", borderColor: hovered ? "#d1fae5" : "#e5e7eb", borderRadius: 16, overflow: "hidden", transition: "all 0.2s", boxShadow: hovered ? "0 8px 24px rgba(0,0,0,0.1)" : "0 1px 4px rgba(0,0,0,0.05)", transform: hovered ? "translateY(-2px)" : "translateY(0)", display: "flex", flexDirection: "column", opacity: isActive ? 1 : 0.6 }}
      >
        {/* Header */}
        <div style={{ height: 160, position: "relative", background: parsed.imageUrl ? `url(${parsed.imageUrl}) center/cover no-repeat` : headerBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
          {!parsed.imageUrl && (
            <span style={{ color: "#fff", fontWeight: 800, fontSize: 18, textAlign: "center", padding: "0 20px", textShadow: "0 1px 4px rgba(0,0,0,0.25)", lineHeight: 1.3 }}>
              {item.title}
            </span>
          )}
          {/* Live/Inactive badge */}
          <div style={{ position: "absolute", top: 10, right: 10, display: "flex", alignItems: "center", gap: 5, padding: "4px 10px", borderRadius: 999, fontSize: 12, fontWeight: 700, background: isActive ? "#16a34a" : "#6b7280", color: "#fff" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff", display: "inline-block" }} />
            {isActive ? "Live" : "Inactive"}
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: "16px", flex: 1, display: "flex", flexDirection: "column" }}>
          <h3 style={{ margin: "0 0 6px", fontSize: 14, fontWeight: 700, color: "#111827" }}>{item.title}</h3>
          <p style={{ margin: "0 0 12px", fontSize: 13, color: "#6b7280", lineHeight: 1.5, flex: 1, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as React.CSSProperties["WebkitBoxOrient"] }}>
            {parsed.text}
          </p>

          {/* Meta */}
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#9ca3af", marginBottom: 12 }}>
            <span>👁 —</span>
            <span>📅 {expiryDate}</span>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: 8 }}>
            <button
              style={{ flex: 1, padding: "8px 0", border: "1.5px solid #e5e7eb", borderRadius: 8, background: "#fff", color: "#374151", fontWeight: 600, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, transition: "all 0.15s" }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#0d9488"; e.currentTarget.style.color = "#0d9488"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.color = "#374151"; }}
            >
              ✏ Edit
            </button>
            <button
              onClick={() => setShowDetails(true)}
              title="View details"
              style={{ width: 36, height: 36, border: "1.5px solid #e5e7eb", borderRadius: 8, background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#9ca3af", fontSize: 15, transition: "all 0.15s" }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#0d9488"; e.currentTarget.style.color = "#0d9488"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.color = "#9ca3af"; }}
            >
              👁
            </button>
            <button
              onClick={() => isActive && setShowConfirm(true)}
              title={isActive ? "Deactivate" : "Already inactive"}
              style={{ width: 36, height: 36, border: "1.5px solid #e5e7eb", borderRadius: 8, background: "#fff", cursor: isActive ? "pointer" : "not-allowed", display: "flex", alignItems: "center", justifyContent: "center", color: isActive ? "#9ca3af" : "#d1d5db", fontSize: 15, transition: "all 0.15s" }}
              onMouseEnter={(e) => { if (isActive) { e.currentTarget.style.borderColor = "#dc2626"; e.currentTarget.style.color = "#dc2626"; e.currentTarget.style.background = "#fef2f2"; } }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#e5e7eb"; e.currentTarget.style.color = isActive ? "#9ca3af" : "#d1d5db"; e.currentTarget.style.background = "#fff"; }}
            >
              🗑
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
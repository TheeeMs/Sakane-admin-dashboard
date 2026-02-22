import { useState } from "react";
import type { Announcement } from "../../types";
import { EyeIcon, CalendarIcon, EditIcon, TrashIcon } from "../shared/Icons";

export function AnnouncementCard({ item, onDelete }: { item: Announcement; onDelete: (id: number) => void }) {
  const [hovered, setHovered] = useState(false);
  const [editH, setEditH] = useState(false);
  const [eyeH, setEyeH] = useState(false);
  const [delH, setDelH] = useState(false);
  const isLive = item.status === "Live";
  const hasImage = !!item.image;
  const hasColor = !!item.bgColor && !hasImage;

  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{ background: "#fff", border: "1px solid", borderColor: hovered ? "#14b8a633" : "#e5e7eb", borderRadius: 14, overflow: "hidden", transition: "all 0.2s", boxShadow: hovered ? "0 8px 24px rgba(13,148,136,0.1)" : "0 1px 4px rgba(0,0,0,0.05)", transform: hovered ? "translateY(-2px)" : "translateY(0)", display: "flex", flexDirection: "column" }}>
      <div style={{ height: 140, position: "relative", background: hasImage ? `url(${item.image}) center/cover no-repeat` : hasColor ? item.bgColor! : "#f3f4f6", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {hasColor && <span style={{ color: "#fff", fontWeight: 800, fontSize: 18, textAlign: "center", padding: "0 20px", textShadow: "0 1px 4px rgba(0,0,0,0.25)" }}>{item.title}</span>}
        <div style={{ position: "absolute", top: 10, right: 10, display: "flex", alignItems: "center", gap: 5, padding: "3px 10px", borderRadius: 999, fontSize: 12, fontWeight: 700, background: isLive ? "#16a34a" : "#6b7280", color: "#fff" }}>
          <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#fff", display: "inline-block" }} />{item.status}
        </div>
      </div>
      <div style={{ padding: "14px 16px 16px", flex: 1, display: "flex", flexDirection: "column" }}>
        {!hasColor && <h3 style={{ margin: "0 0 6px", fontSize: 15, fontWeight: 700, color: "#111827" }}>{item.title}</h3>}
        <p style={{ margin: "0 0 12px", fontSize: 13, color: "#6b7280", lineHeight: 1.5, flex: 1 }}>{item.description}</p>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#9ca3af", marginBottom: 12 }}>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}><EyeIcon /> {item.views.toLocaleString()}</span>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}><CalendarIcon /> {item.date}</span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button onMouseEnter={() => setEditH(true)} onMouseLeave={() => setEditH(false)} style={{ flex: 1, padding: "8px 0", border: "1.5px solid #0d9488", borderRadius: 8, background: editH ? "#0d948815" : "transparent", color: "#0d9488", fontWeight: 600, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}><EditIcon /> Edit</button>
          <button onMouseEnter={() => setEyeH(true)} onMouseLeave={() => setEyeH(false)} style={{ width: 36, height: 36, border: "1.5px solid", borderColor: eyeH ? "#0d9488" : "#e5e7eb", borderRadius: 8, background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: eyeH ? "#0d9488" : "#6b7280" }}><EyeIcon /></button>
          <button onClick={() => onDelete(item.id)} onMouseEnter={() => setDelH(true)} onMouseLeave={() => setDelH(false)} style={{ width: 36, height: 36, border: "1.5px solid", borderColor: delH ? "#dc2626" : "#e5e7eb", borderRadius: 8, background: delH ? "#fef2f2" : "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: delH ? "#dc2626" : "#6b7280" }}><TrashIcon /></button>
        </div>
      </div>
    </div>
  );
}
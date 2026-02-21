import { useState } from "react";
import { announcementsData } from "../../data/newsData";
import { AnnouncementCard } from "./AnnouncementCard";

export function NewsAnnouncements() {
  const [list, setList] = useState(announcementsData);
  return (
    <div>
      <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 10, padding: "12px 16px", marginBottom: 24, display: "flex", gap: 10 }}>
        <span style={{ color: "#3b82f6", fontSize: 17, flexShrink: 0 }}>ℹ</span>
        <div>
          <p style={{ margin: 0, fontWeight: 700, fontSize: 13.5, color: "#1d4ed8" }}>About News & Announcements</p>
          <p style={{ margin: "3px 0 0", fontSize: 13, color: "#3b82f6" }}>These announcements appear as horizontal cards in the resident app home screen.</p>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))", gap: 20 }}>
        {list.map((item) => <AnnouncementCard key={item.id} item={item} onDelete={(id) => setList((p) => p.filter((a) => a.id !== id))} />)}
      </div>
    </div>
  );
}
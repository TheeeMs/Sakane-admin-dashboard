import { useState } from "react";
import type { PushNotification, SubTab } from "../../types";
import { NotificationCard } from "./NotificationCard";

interface Props {
  instantList: PushNotification[];
  setInstantList: React.Dispatch<React.SetStateAction<PushNotification[]>>;
  scheduledList: PushNotification[];
  setScheduledList: React.Dispatch<React.SetStateAction<PushNotification[]>>;
}

export function PushNotifications({ instantList, setInstantList, scheduledList, setScheduledList }: Props) {
  const [activeSubTab, setActiveSubTab] = useState<SubTab>("instant");
  const [search, setSearch] = useState("");

  const currentList = activeSubTab === "instant" ? instantList : scheduledList;
  const filtered = currentList.filter((n) => n.title.toLowerCase().includes(search.toLowerCase()) || n.description.toLowerCase().includes(search.toLowerCase()));
  const handleDelete = (id: number) => {
    if (activeSubTab === "instant") setInstantList((p) => p.filter((n) => n.id !== id));
    else setScheduledList((p) => p.filter((n) => n.id !== id));
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
        {(["instant", "scheduled"] as SubTab[]).map((s) => {
          const active = activeSubTab === s;
          return <button key={s} onClick={() => setActiveSubTab(s)} style={{ padding: "8px 18px", borderRadius: 8, border: "1px solid", borderColor: active ? "#0d9488" : "#e5e7eb", background: active ? "#0d9488" : "#fff", color: active ? "#fff" : "#374151", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>{s === "instant" ? "⚡ Instant & Sent" : `📅 Scheduled (${scheduledList.length})`}</button>;
        })}
      </div>
      <div style={{ position: "relative", marginBottom: 18 }}>
        <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#9ca3af", pointerEvents: "none" }}>🔍</span>
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search notifications..." style={{ width: "100%", boxSizing: "border-box", padding: "11px 14px 11px 40px", border: "1px solid #e5e7eb", borderRadius: 10, fontSize: 14, background: "#fafafa", outline: "none" }} onFocus={(e) => (e.currentTarget.style.borderColor = "#0d9488")} onBlur={(e) => (e.currentTarget.style.borderColor = "#e5e7eb")} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {filtered.length === 0 ? <div style={{ textAlign: "center", color: "#9ca3af", padding: "40px 0" }}>No notifications found.</div>
          : filtered.map((n) => <NotificationCard key={n.id} notif={n} onDelete={handleDelete} />)}
      </div>
    </div>
  );
}
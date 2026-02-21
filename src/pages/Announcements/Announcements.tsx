import { useState } from "react";
import type { Tab, PushNotification } from "./types";
import { instantNotifications, scheduledNotifications } from "./data/pushData";
import { PushNotifications } from "./components/PushNotifications";
import { NewsAnnouncements } from "./components/NewsAnnouncements";
import { SystemNotifications } from "./components/SystemNotifications";
import { Modal } from "./components/shared/Modal";

const tabs = [
  { key: "push"   as Tab, label: "Push Notifications",   count: 5,     icon: "📣" },
  { key: "news"   as Tab, label: "News & Announcements",  count: 5,     icon: "📄" },
  { key: "system" as Tab, label: "System Notifications",  count: "6/7", icon: "⚡" },
];

export default function Announcements() {
  const [activeTab, setActiveTab]           = useState<Tab>("push");
  const [showModal, setShowModal]           = useState(false);
  const [instantList, setInstantList] = useState<PushNotification[]>(instantNotifications);
  const [scheduledList, setScheduledList] = useState<PushNotification[]>(scheduledNotifications);
  const newBtnLabel = activeTab === "news" ? "+ New Announcement" : activeTab === "system" ? "+ New Template" : "+ New Notification";

  return (
    <div style={{ fontFamily: "'DM Sans','Segoe UI',sans-serif", minHeight: "100vh", background: "#f9fafb", padding: "32px", boxSizing: "border-box" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: "#111827" }}>Communications Center</h1>
          <p style={{ margin: "6px 0 0", color: "#6b7280", fontSize: 14 }}>Manage all resident communications and notifications</p>
        </div>
        <button onClick={() => setShowModal(true)} style={{ background: "linear-gradient(135deg,#0d9488,#14b8a6)", color: "#fff", border: "none", borderRadius: 10, padding: "11px 20px", fontWeight: 700, fontSize: 14, cursor: "pointer", boxShadow: "0 4px 14px rgba(13,148,136,0.35)" }}>{newBtnLabel}</button>
      </div>
      <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e5e7eb", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
        <div style={{ display: "flex", borderBottom: "1px solid #e5e7eb", padding: "0 20px", gap: 4 }}>
          {tabs.map((t) => {
            const active = activeTab === t.key;
            return <button key={t.key} onClick={() => setActiveTab(t.key)} style={{ background: "none", border: "none", borderBottom: active ? "2.5px solid #0d9488" : "2.5px solid transparent", padding: "16px 14px 13px", cursor: "pointer", fontWeight: active ? 700 : 500, fontSize: 13.5, color: active ? "#0d9488" : "#6b7280", display: "flex", alignItems: "center", gap: 7, whiteSpace: "nowrap" }}>{t.icon} {t.label}<span style={{ background: active ? "#0d9488" : "#e5e7eb", color: active ? "#fff" : "#6b7280", borderRadius: 999, fontSize: 11, fontWeight: 700, padding: "1px 7px" }}>{t.count}</span></button>;
          })}
        </div>
        <div style={{ padding: 20 }}>
          {activeTab === "push"   && <PushNotifications instantList={instantList} setInstantList={setInstantList} scheduledList={scheduledList} setScheduledList={setScheduledList} />}
          {activeTab === "news"   && <NewsAnnouncements />}
          {activeTab === "system" && <SystemNotifications />}
        </div>
      </div>
      {showModal && <Modal tab={activeTab} onClose={() => setShowModal(false)} />}
    </div>
  );
}
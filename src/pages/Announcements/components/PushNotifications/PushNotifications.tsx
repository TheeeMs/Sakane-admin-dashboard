// src/pages/Announcements/components/PushNotifications/PushNotifications.tsx

import { useState, useEffect, useCallback } from "react";
import { NotificationCard } from "./NotificationCard";
import { useAuth } from "@/hooks/useAuth";
import { LoadingSpinner } from "../shared/Loadingspinner";
import { fetchNotifications, markAsRead, type NotificationAPI, type NotificationStatus } from "@/lib/notificationService";

type SubTab = "instant" | "scheduled";

interface Props {
  onRegisterRefresh?: (fn: () => void) => void;
}

function ScheduledCalendar({ list }: { list: NotificationAPI[] }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const year  = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthName   = currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const firstDay    = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonth   = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth   = () => setCurrentDate(new Date(year, month + 1, 1));
  const notifDays   = new Set(list.map((n) => n.sentAt ? new Date(n.sentAt).getDate() : null).filter(Boolean));
  const days  = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const cells: (number | null)[] = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <span style={{ fontSize: 16, fontWeight: 700, color: "#111827" }}>{monthName}</span>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={prevMonth} style={{ width: 32, height: 32, border: "1px solid #e5e7eb", borderRadius: 8, background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#6b7280", fontSize: 14 }}>‹</button>
          <button onClick={nextMonth} style={{ width: 32, height: 32, border: "1px solid #e5e7eb", borderRadius: 8, background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: "#6b7280", fontSize: 14 }}>›</button>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 1, marginBottom: 4 }}>
        {days.map((d) => <div key={d} style={{ textAlign: "center", fontSize: 12, fontWeight: 600, color: "#9ca3af", padding: "8px 0" }}>{d}</div>)}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 1 }}>
        {cells.map((day, i) => (
          <div key={i} style={{ minHeight: 80, border: "1px solid #f3f4f6", padding: "6px 8px", background: day ? "#fff" : "#fafafa" }}>
            {day && (
              <>
                <span style={{ fontSize: 13, color: "#374151", fontWeight: 500 }}>{day}</span>
                {notifDays.has(day) && (
                  <div style={{ marginTop: 4 }}>
                    <div style={{ background: "#0d9488", color: "#fff", borderRadius: 4, padding: "2px 6px", fontSize: 10, fontWeight: 600, display: "inline-block" }}>📅 Notif</div>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function PushNotifications({ onRegisterRefresh }: Props) {
  const { user } = useAuth();
  const [activeSubTab, setActiveSubTab] = useState<SubTab>("instant");
  const [sentList,     setSentList]     = useState<NotificationAPI[]>([]);
  const [pendingList,  setPendingList]  = useState<NotificationAPI[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState<string | null>(null);
  const [search,       setSearch]       = useState("");

  const load = useCallback(async () => {
    if (!user?.userId) return;
    try {
      setLoading(true); setError(null);
      const [sent, pending] = await Promise.all([
        fetchNotifications({ recipientId: user.userId, status: "SENT" }),
        fetchNotifications({ recipientId: user.userId, status: "PENDING" }),
      ]);
      setSentList(sent);
      setPendingList(pending);
    } catch (err) { setError((err as Error).message); }
    finally { setLoading(false); }
  }, [user?.userId]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { onRegisterRefresh?.(load); }, [load, onRegisterRefresh]);

  const handleMarkRead = async (id: string) => {
    try {
      await markAsRead(id);
      setSentList((prev) => prev.map((n) => n.id === id ? { ...n, status: "READ" as NotificationStatus } : n));
    } catch (err) { alert(`Failed: ${(err as Error).message}`); }
  };

  const handleDelete = (id: string) => {
    setSentList((prev)    => prev.filter((n) => n.id !== id));
    setPendingList((prev) => prev.filter((n) => n.id !== id));
  };

  const currentList = activeSubTab === "instant" ? sentList : pendingList;
  const filtered = currentList.filter((n) =>
    n.title.toLowerCase().includes(search.toLowerCase()) ||
    n.body.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        <button onClick={() => setActiveSubTab("instant")} style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 18px", borderRadius: 8, border: "1px solid", borderColor: activeSubTab === "instant" ? "#0d9488" : "#e5e7eb", background: activeSubTab === "instant" ? "#0d9488" : "#fff", color: activeSubTab === "instant" ? "#fff" : "#374151", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
          <span style={{ fontSize: 14 }}>⚡</span> Instant &amp; Sent ({sentList.length})
        </button>
        <button onClick={() => setActiveSubTab("scheduled")} style={{ display: "flex", alignItems: "center", gap: 8, padding: "9px 18px", borderRadius: 8, border: "1px solid", borderColor: activeSubTab === "scheduled" ? "#0d9488" : "#e5e7eb", background: activeSubTab === "scheduled" ? "#0d9488" : "#fff", color: activeSubTab === "scheduled" ? "#fff" : "#374151", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
          <span style={{ fontSize: 14 }}>📅</span> Scheduled ({pendingList.length})
        </button>
      </div>

      {loading ? (
        <LoadingSpinner text="Loading notifications…" />
      ) : error ? (
        <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: "16px 20px", color: "#dc2626", display: "flex", gap: 10, alignItems: "center" }}>
          <span>⚠️</span>
          <div><strong>Failed to load</strong><p style={{ margin: "4px 0 0", fontSize: 13 }}>{error}</p></div>
          <button onClick={load} style={{ marginLeft: "auto", padding: "6px 14px", border: "1px solid #fca5a5", borderRadius: 8, background: "#fff", color: "#dc2626", cursor: "pointer", fontWeight: 600 }}>Retry</button>
        </div>
      ) : activeSubTab === "scheduled" ? (
        <ScheduledCalendar list={pendingList} />
      ) : (
        <>
          <div style={{ position: "relative", marginBottom: 18 }}>
            <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#9ca3af", pointerEvents: "none", fontSize: 14 }}>🔍</span>
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search notifications..." style={{ width: "100%", boxSizing: "border-box", padding: "11px 14px 11px 42px", border: "1px solid #e5e7eb", borderRadius: 10, fontSize: 14, background: "#fafafa", outline: "none" }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "#0d9488")}
              onBlur={(e)  => (e.currentTarget.style.borderColor = "#e5e7eb")} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {filtered.length === 0
              ? <div style={{ textAlign: "center", color: "#9ca3af", padding: "40px 0" }}>No notifications found.</div>
              : filtered.map((n) => <NotificationCard key={n.id} notif={n} onMarkRead={handleMarkRead} onDelete={handleDelete} />)
            }
          </div>
        </>
      )}
    </div>
  );
}
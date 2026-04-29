// src/pages/Announcements/components/NewsAnnouncements/NewsAnnouncements.tsx

import { useState, useEffect, useCallback } from "react";
import { AnnouncementCard } from "./AnnouncementCard";
import { useAuth } from "@/hooks/useAuth";
import { LoadingSpinner } from "../shared/Loadingspinner";
import { fetchAnnouncements, deactivateAnnouncement, type AnnouncementAPI } from "@/lib/announcementService";

interface Props {
  onRegisterRefresh?: (fn: () => void) => void;
}

export function NewsAnnouncements({ onRegisterRefresh }: Props) {
  const { user } = useAuth();
  const [list,    setList]    = useState<AnnouncementAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true); setError(null);
      const data = await fetchAnnouncements();
      setList(data);
    } catch (err) { setError((err as Error).message); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { onRegisterRefresh?.(load); }, [load, onRegisterRefresh]);

  const handleDeactivate = async (id: string) => {
    if (!user?.userId) return;
    await deactivateAnnouncement(id, user.userId);
    setList((prev) => prev.filter((a) => a.id !== id));
  };

  if (loading) return <LoadingSpinner text="Loading announcements…" />;

  if (error)
    return (
      <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: "16px 20px", color: "#dc2626", display: "flex", gap: 10, alignItems: "center" }}>
        <span>⚠️</span>
        <div><strong>Failed to load announcements</strong><p style={{ margin: "4px 0 0", fontSize: 13 }}>{error}</p></div>
        <button onClick={load} style={{ marginLeft: "auto", padding: "6px 14px", border: "1px solid #fca5a5", borderRadius: 8, background: "#fff", color: "#dc2626", cursor: "pointer", fontWeight: 600 }}>Retry</button>
      </div>
    );

  return (
    <div>
      <div style={{ background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 10, padding: "12px 16px", marginBottom: 24, display: "flex", gap: 10 }}>
        <span style={{ color: "#3b82f6", fontSize: 17, flexShrink: 0 }}>ℹ</span>
        <div>
          <p style={{ margin: 0, fontWeight: 700, fontSize: 13.5, color: "#1d4ed8" }}>About News &amp; Announcements</p>
          <p style={{ margin: "3px 0 0", fontSize: 13, color: "#3b82f6" }}>These announcements appear as horizontal cards in the resident app home screen.</p>
        </div>
      </div>
      {list.length === 0 ? (
        <div style={{ textAlign: "center", color: "#9ca3af", padding: "60px 0" }}>
          <div style={{ fontSize: 32, marginBottom: 10 }}>📢</div>No announcements found.
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
          {list.map((item) => <AnnouncementCard key={item.id} item={item} onDeactivate={handleDeactivate} />)}
        </div>
      )}
    </div>
  );
}
import { useEffect, useState } from "react";
import type { Announcement } from "../../types";
import { AnnouncementCard } from "./AnnouncementCard";
import {
  communicationsApi,
  type CommunicationCardItemDto,
} from "../../data/communicationsApi";
import {
  AnnouncementModal,
  type AnnouncementFormData,
} from "./AnnouncementModal";

interface NewsAnnouncementsProps {
  isCreateOpen: boolean;
  onCloseCreate: () => void;
  onCountChange?: (count: number) => void;
}

const formatShortDate = (value?: string | null) => {
  if (!value) return "";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

const mapAnnouncement = (
  raw: CommunicationCardItemDto,
  index: number,
): Announcement => {
  return {
    id: raw.itemId ?? `announcement-${index}`,
    title: raw.title ?? "Untitled Announcement",
    description: raw.message ?? "",
    status: raw.status === "Sent" ? "Live" : "Inactive",
    views: raw.recipientCount ?? 0,
    date: raw.sentAt ? formatShortDate(raw.sentAt) : "",
    priority: raw.priority as Announcement["priority"],
    expiresAt: null,
  };
};

export function NewsAnnouncements({
  isCreateOpen,
  onCloseCreate,
  onCountChange,
}: NewsAnnouncementsProps) {
  const [list, setList] = useState<Announcement[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchAnnouncements = async () => {
    try {
      const res = await communicationsApi.getCenter({
        tab: "NEWS_ANNOUNCEMENTS",
        status: "ALL",
      });
      const items = res.data.items || [];
      setList(items.map(mapAnnouncement));
      const tabCounter = res.data.tabs?.find(
        (tab) => tab.key === "NEWS_ANNOUNCEMENTS",
      );
      if (tabCounter) {
        onCountChange?.(Number(tabCounter.count ?? items.length));
      } else {
        onCountChange?.(items.length);
      }
    } catch (err) {
      console.error("Failed to load announcements", err);
      setList([]);
      onCountChange?.(0);
    }
  };

  const handleCreate = async (data: AnnouncementFormData) => {
    try {
      setIsSubmitting(true);
      await communicationsApi.createAnnouncement({
        title: data.title,
        content: data.content,
        priority: data.priority,
        expiresAt: data.expiresAt ?? null,
      });
      await fetchAnnouncements();
      onCloseCreate();
    } catch (err) {
      console.error("Failed to create announcement", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeactivate = async (id: string) => {
    try {
      await communicationsApi.deleteAnnouncementItem(id);
      await fetchAnnouncements();
    } catch (err) {
      console.error("Failed to deactivate announcement", err);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  return (
    <div>
      <div
        style={{
          background: "#eff6ff",
          border: "1px solid #bfdbfe",
          borderRadius: 10,
          padding: "12px 16px",
          marginBottom: 24,
          display: "flex",
          gap: 10,
        }}
      >
        <span style={{ color: "#3b82f6", fontSize: 17, flexShrink: 0 }}>ℹ</span>
        <div>
          <p
            style={{
              margin: 0,
              fontWeight: 700,
              fontSize: 13.5,
              color: "#1d4ed8",
            }}
          >
            About News & Announcements
          </p>
          <p style={{ margin: "3px 0 0", fontSize: 13, color: "#3b82f6" }}>
            These announcements appear as horizontal cards in the resident app
            home screen.
          </p>
        </div>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))",
          gap: 20,
        }}
      >
        {list.length === 0 ? (
          <div
            style={{ textAlign: "center", color: "#9ca3af", padding: "30px 0" }}
          >
            No announcements found.
          </div>
        ) : (
          list.map((item) => (
            <AnnouncementCard
              key={item.id}
              item={item}
              onDelete={handleDeactivate}
            />
          ))
        )}
      </div>
      <AnnouncementModal
        isOpen={isCreateOpen}
        onClose={onCloseCreate}
        onSubmit={handleCreate}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}

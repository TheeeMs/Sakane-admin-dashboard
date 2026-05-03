import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Inbox, Info } from "lucide-react";
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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchAnnouncements = async () => {
    setIsLoading(true);
    setError(null);
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
      const msg =
        err instanceof Error ? err.message : "Failed to load announcements";
      setError(msg);
      setList([]);
      onCountChange?.(0);
    } finally {
      setIsLoading(false);
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
      toast.success("Announcement created successfully");
      await fetchAnnouncements();
      onCloseCreate();
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Failed to create announcement";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeactivate = async (id: string) => {
    try {
      await communicationsApi.deleteAnnouncementItem(id);
      toast.success("Announcement removed");
      await fetchAnnouncements();
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Failed to remove announcement";
      toast.error(msg);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      {/* Info banner */}
      <div className="flex items-start gap-3 p-4 mb-5 rounded-xl bg-blue-50 border border-blue-200">
        <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
          <Info className="w-4 h-4" />
        </div>
        <div>
          <p className="m-0 font-bold text-sm text-blue-700">
            About News &amp; Announcements
          </p>
          <p className="m-0 mt-0.5 text-[13px] text-blue-600/90">
            These announcements appear as horizontal cards in the resident app
            home screen.
          </p>
        </div>
      </div>

      {/* Error banner */}
      {error && !isLoading && (
        <div className="mb-5 flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
          <span>⚠️ {error}</span>
          <button
            onClick={fetchAnnouncements}
            className="px-3 py-1.5 rounded-lg bg-white border border-red-200 text-red-700 text-xs font-semibold hover:bg-red-50 transition"
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading state */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-500">
          <div className="w-9 h-9 mb-3 rounded-full border-[3px] border-gray-200 border-t-[#00A389] animate-spin" />
          <p className="text-sm font-medium">Loading announcements…</p>
        </div>
      ) : list.length === 0 && !error ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-3">
            <Inbox className="w-6 h-6 text-gray-400" />
          </div>
          <p className="text-sm font-medium text-gray-600">
            No announcements yet
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Click "New Announcement" to create the first one.
          </p>
        </div>
      ) : !error ? (
        <div className="grid gap-5 grid-cols-[repeat(auto-fill,minmax(270px,1fr))]">
          {list.map((item) => (
            <AnnouncementCard
              key={item.id}
              item={item}
              onDelete={handleDeactivate}
            />
          ))}
        </div>
      ) : null}

      <AnnouncementModal
        isOpen={isCreateOpen}
        onClose={onCloseCreate}
        onSubmit={handleCreate}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}

import { useEffect, useState } from "react";
import type { Tab, PushNotification } from "./types";
import { PushNotifications } from "./components/PushNotifications";
import { NewsAnnouncements } from "./components/NewsAnnouncements";
import { SystemNotifications } from "./components/SystemNotifications";
import { Modal, type NotificationFormData } from "./components/shared/Modal";
import { NotificationDetailsModal } from "./components/shared/NotificationDetailsModal";
import {
  communicationsApi,
  type CommunicationCardItemDto,
  type CommunicationTabCounter,
} from "./data/communicationsApi";

const tabs = [
  {
    key: "push" as Tab,
    apiKey: "PUSH_NOTIFICATIONS",
    label: "Push Notifications",
    icon: "📣",
  },
  {
    key: "news" as Tab,
    apiKey: "NEWS_ANNOUNCEMENTS",
    label: "News & Announcements",
    icon: "📄",
  },
  {
    key: "system" as Tab,
    apiKey: "SYSTEM_NOTIFICATIONS",
    label: "System Notifications",
    icon: "⚡",
  },
];

const formatDateTime = (value?: string | null) => {
  if (!value) return "";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const mapPriority = (value?: string | null): PushNotification["priority"] => {
  const normalized = (value || "").toUpperCase();
  if (normalized === "HIGH" || normalized === "URGENT") return "HIGH";
  if (normalized === "LOW") return "LOW";
  return "NORMAL";
};

const mapNotificationItem = (
  item: CommunicationCardItemDto,
): PushNotification => {
  const status = item.status === "Draft" ? "Draft" : "Sent";
  const sentLabel = item.sentAt
    ? `Sent ${formatDateTime(item.sentAt)}`
    : undefined;
  const scheduledLabel =
    item.status === "Draft" && item.sentAt
      ? `Scheduled ${formatDateTime(item.sentAt)}`
      : undefined;

  return {
    id: item.itemId,
    title: item.title ?? "Untitled Notification",
    status,
    priority: mapPriority(item.priority),
    description: item.message ?? "",
    recipients: item.recipientCount ?? 0,
    readCount: item.readCount ?? 0,
    readPercent: item.readPercent ?? 0,
    sentAt: sentLabel,
    scheduledAt: scheduledLabel,
    sentBy: item.sentBy ?? undefined,
  };
};

export default function Announcements() {
  const [activeTab, setActiveTab] = useState<Tab>("push");
  const [showModal, setShowModal] = useState(false);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [newsCount, setNewsCount] = useState(0);
  const [pushItems, setPushItems] = useState<PushNotification[]>([]);
  const [systemItems, setSystemItems] = useState<PushNotification[]>([]);
  const [tabBadges, setTabBadges] = useState<Record<string, string>>({});
  const [isCreatingPush, setIsCreatingPush] = useState(false);
  const [pushSearch, setPushSearch] = useState("");
  const [systemSearch, setSystemSearch] = useState("");
  const [pushStatus, setPushStatus] = useState("ALL");
  const [systemStatus, setSystemStatus] = useState("ALL");
  const [pushStatusOptions, setPushStatusOptions] = useState<
    Array<{ value: string; label: string; count?: number }>
  >([]);
  const [systemStatusOptions, setSystemStatusOptions] = useState<
    Array<{ value: string; label: string; count?: number }>
  >([]);
  const [detailsItem, setDetailsItem] =
    useState<CommunicationCardItemDto | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const newBtnLabel =
    activeTab === "news"
      ? "+ New Announcement"
      : activeTab === "system"
        ? "+ New Template"
        : "+ New Notification";

  const updateTabBadges = (tabsData: CommunicationTabCounter[]) => {
    setTabBadges((prev) => {
      const next: Record<string, string> = { ...prev };
      tabsData.forEach((tab) => {
        next[tab.key] = tab.badgeText ?? String(tab.count ?? 0);
      });
      return next;
    });
  };

  const fetchCenterTab = async (
    tabKey: "PUSH_NOTIFICATIONS" | "SYSTEM_NOTIFICATIONS",
    statusValue: string,
    searchValue: string,
  ) => {
    try {
      const res = await communicationsApi.getCenter({
        tab: tabKey,
        status: statusValue,
        search: searchValue || undefined,
      });
      const items = res.data.items || [];
      const mapped = items.map(mapNotificationItem);
      if (tabKey === "PUSH_NOTIFICATIONS") {
        setPushItems(mapped);
        setPushStatusOptions(
          (res.data.statuses || []).map((status) => ({
            value: status.key,
            label: status.label,
            count: status.count,
          })),
        );
      } else {
        setSystemItems(mapped);
        setSystemStatusOptions(
          (res.data.statuses || []).map((status) => ({
            value: status.key,
            label: status.label,
            count: status.count,
          })),
        );
      }
      updateTabBadges(res.data.tabs || []);
    } catch (err) {
      console.error("Failed to load communications center", err);
      if (tabKey === "PUSH_NOTIFICATIONS") {
        setPushItems([]);
        setPushStatusOptions([]);
      } else {
        setSystemItems([]);
        setSystemStatusOptions([]);
      }
    }
  };

  const handleDeleteNotification = async (
    id: string,
    tabKey: "PUSH_NOTIFICATIONS" | "SYSTEM_NOTIFICATIONS",
  ) => {
    try {
      await communicationsApi.deleteNotificationItem(id, tabKey);
      await fetchCenterTab(
        tabKey,
        tabKey === "PUSH_NOTIFICATIONS" ? pushStatus : systemStatus,
        tabKey === "PUSH_NOTIFICATIONS" ? pushSearch : systemSearch,
      );
    } catch (err) {
      console.error("Failed to delete notification", err);
    }
  };

  const handleCreatePush = async (data: NotificationFormData) => {
    try {
      setIsCreatingPush(true);
      await communicationsApi.createPushNotification({
        title: data.title,
        message: data.message,
        priority: data.priority,
        scheduleAt: data.scheduleAt ?? null,
        sendToAll: true,
      });
      await fetchCenterTab("PUSH_NOTIFICATIONS", pushStatus, pushSearch);
      setShowModal(false);
    } catch (err) {
      console.error("Failed to create push notification", err);
    } finally {
      setIsCreatingPush(false);
    }
  };

  const handleViewNotification = async (
    item: PushNotification,
    tabKey: "PUSH_NOTIFICATIONS" | "SYSTEM_NOTIFICATIONS",
  ) => {
    try {
      const res = await communicationsApi.getNotificationItem(item.id, tabKey);
      setDetailsItem(res.data);
      setDetailsOpen(true);
    } catch (err) {
      console.error("Failed to load notification details", err);
    }
  };

  useEffect(() => {
    fetchCenterTab("PUSH_NOTIFICATIONS", pushStatus, pushSearch);
    fetchCenterTab("SYSTEM_NOTIFICATIONS", systemStatus, systemSearch);
  }, []);

  useEffect(() => {
    if (activeTab === "push") {
      fetchCenterTab("PUSH_NOTIFICATIONS", pushStatus, pushSearch);
    }
    if (activeTab === "system") {
      fetchCenterTab("SYSTEM_NOTIFICATIONS", systemStatus, systemSearch);
    }
  }, [activeTab, pushStatus, pushSearch, systemStatus, systemSearch]);

  return (
    <div
      style={{
        fontFamily: "'DM Sans','Segoe UI',sans-serif",
        minHeight: "100vh",
        background: "#f9fafb",
        padding: "32px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 28,
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: 26,
              fontWeight: 800,
              color: "#111827",
            }}
          >
            Communications Center
          </h1>
          <p style={{ margin: "6px 0 0", color: "#6b7280", fontSize: 14 }}>
            Manage all resident communications and notifications
          </p>
        </div>
        {activeTab !== "system" && (
          <button
            onClick={() =>
              activeTab === "news"
                ? setShowAnnouncementModal(true)
                : setShowModal(true)
            }
            style={{
              background: "linear-gradient(135deg,#0d9488,#14b8a6)",
              color: "#fff",
              border: "none",
              borderRadius: 10,
              padding: "11px 20px",
              fontWeight: 700,
              fontSize: 14,
              cursor: "pointer",
              boxShadow: "0 4px 14px rgba(13,148,136,0.35)",
            }}
          >
            {newBtnLabel}
          </button>
        )}
      </div>
      <div
        style={{
          background: "#fff",
          borderRadius: 16,
          border: "1px solid #e5e7eb",
          overflow: "hidden",
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        }}
      >
        <div
          style={{
            display: "flex",
            borderBottom: "1px solid #e5e7eb",
            padding: "0 20px",
            gap: 4,
          }}
        >
          {tabs.map((t) => {
            const active = activeTab === t.key;
            const badgeText = tabBadges[t.apiKey] ?? "0";
            return (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                style={{
                  background: "none",
                  border: "none",
                  borderBottom: active
                    ? "2.5px solid #0d9488"
                    : "2.5px solid transparent",
                  padding: "16px 14px 13px",
                  cursor: "pointer",
                  fontWeight: active ? 700 : 500,
                  fontSize: 13.5,
                  color: active ? "#0d9488" : "#6b7280",
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  whiteSpace: "nowrap",
                }}
              >
                {t.icon} {t.label}
                <span
                  style={{
                    background: active ? "#0d9488" : "#e5e7eb",
                    color: active ? "#fff" : "#6b7280",
                    borderRadius: 999,
                    fontSize: 11,
                    fontWeight: 700,
                    padding: "1px 7px",
                  }}
                >
                  {t.key === "news" ? newsCount : badgeText}
                </span>
              </button>
            );
          })}
        </div>
        <div style={{ padding: 20 }}>
          {activeTab === "push" && (
            <PushNotifications
              items={pushItems}
              onDelete={(id) =>
                handleDeleteNotification(id, "PUSH_NOTIFICATIONS")
              }
              search={pushSearch}
              onSearchChange={setPushSearch}
              statusOptions={pushStatusOptions}
              statusValue={pushStatus}
              onStatusChange={setPushStatus}
              onView={(item) =>
                handleViewNotification(item, "PUSH_NOTIFICATIONS")
              }
            />
          )}
          {activeTab === "news" && (
            <NewsAnnouncements
              isCreateOpen={showAnnouncementModal}
              onCloseCreate={() => setShowAnnouncementModal(false)}
              onCountChange={setNewsCount}
            />
          )}
          {activeTab === "system" && (
            <SystemNotifications
              items={systemItems}
              onDelete={(id) =>
                handleDeleteNotification(id, "SYSTEM_NOTIFICATIONS")
              }
              onRefresh={() =>
                fetchCenterTab(
                  "SYSTEM_NOTIFICATIONS",
                  systemStatus,
                  systemSearch,
                )
              }
              search={systemSearch}
              onSearchChange={setSystemSearch}
              statusOptions={systemStatusOptions}
              statusValue={systemStatus}
              onStatusChange={setSystemStatus}
              onView={(item) =>
                handleViewNotification(item, "SYSTEM_NOTIFICATIONS")
              }
            />
          )}
        </div>
      </div>
      {showModal && (
        <Modal
          tab={activeTab}
          onClose={() => setShowModal(false)}
          onSubmit={activeTab === "push" ? handleCreatePush : undefined}
          isSubmitting={isCreatingPush}
        />
      )}
      <NotificationDetailsModal
        isOpen={detailsOpen}
        item={detailsItem}
        onClose={() => setDetailsOpen(false)}
      />
    </div>
  );
}

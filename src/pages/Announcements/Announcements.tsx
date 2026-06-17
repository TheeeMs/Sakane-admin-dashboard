import { useCallback, useEffect, useState } from "react";
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

function BellIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
  );
}
function FileTextIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
      <polyline points="10 9 9 9 8 9"/>
    </svg>
  );
}
function ZapIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  );
}
function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <line x1="12" y1="5" x2="12" y2="19"/>
      <line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  );
}

const tabs = [
  {
    key: "push" as Tab,
    apiKey: "PUSH_NOTIFICATIONS",
    label: "Push Notifications",
    Icon: BellIcon,
    badgeColor: "#0d9488",
  },
  {
    key: "news" as Tab,
    apiKey: "NEWS_ANNOUNCEMENTS",
    label: "News & Announcements",
    Icon: FileTextIcon,
    badgeColor: "#10b981",
  },
  {
    key: "system" as Tab,
    apiKey: "SYSTEM_NOTIFICATIONS",
    label: "System Notifications",
    Icon: ZapIcon,
    badgeColor: "#7c3aed",
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

  const updateTabBadges = useCallback((tabsData: CommunicationTabCounter[]) => {
    setTabBadges((prev) => {
      const next: Record<string, string> = { ...prev };
      tabsData.forEach((tab) => {
        next[tab.key] = tab.badgeText ?? String(tab.count ?? 0);
      });
      return next;
    });
  }, []);

  const fetchCenterTab = useCallback(
    async (
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
    },
    [updateTabBadges],
  );

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
  }, [fetchCenterTab, pushStatus, pushSearch, systemStatus, systemSearch]);

  useEffect(() => {
    if (activeTab === "push") {
      fetchCenterTab("PUSH_NOTIFICATIONS", pushStatus, pushSearch);
    }
    if (activeTab === "system") {
      fetchCenterTab("SYSTEM_NOTIFICATIONS", systemStatus, systemSearch);
    }
  }, [
    activeTab,
    fetchCenterTab,
    pushStatus,
    pushSearch,
    systemStatus,
    systemSearch,
  ]);

  return (
    <div
      style={{
        fontFamily: "'Inter','DM Sans','Segoe UI',sans-serif",
        minHeight: "100vh",
        background: "#f4f5f7",
        padding: "32px",
        boxSizing: "border-box",
      }}
    >
      {/* Page Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: 22,
              fontWeight: 700,
              color: "#111827",
              letterSpacing: "-0.3px",
            }}
          >
            Communications Center
          </h1>
          <p style={{ margin: "4px 0 0", color: "#6b7280", fontSize: 13.5 }}>
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
              background: "#0d9488",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              padding: "10px 18px",
              fontWeight: 600,
              fontSize: 13.5,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
              boxShadow: "0 2px 8px rgba(13,148,136,0.30)",
            }}
          >
            <PlusIcon />
            {newBtnLabel.replace("+ ", "")}
          </button>
        )}
      </div>

      {/* Main Card */}
      <div
        style={{
          background: "#fff",
          borderRadius: 12,
          border: "1px solid #e5e7eb",
          overflow: "hidden",
          boxShadow: "0 1px 3px rgba(0,0,0,0.07)",
        }}
      >
        {/* Tabs Bar */}
        <div
          style={{
            display: "flex",
            borderBottom: "1px solid #e5e7eb",
            padding: "0 24px",
          }}
        >
          {tabs.map((t) => {
            const active = activeTab === t.key;
            const badgeText = tabBadges[t.apiKey] ?? "0";
            const Icon = t.Icon;
            return (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                style={{
                  background: "none",
                  border: "none",
                  borderBottom: active
                    ? "2px solid #0d9488"
                    : "2px solid transparent",
                  padding: "14px 16px 12px",
                  cursor: "pointer",
                  fontWeight: active ? 600 : 500,
                  fontSize: 13.5,
                  color: active ? "#0d9488" : "#6b7280",
                  display: "flex",
                  alignItems: "center",
                  gap: 7,
                  whiteSpace: "nowrap",
                  transition: "color 0.15s",
                }}
              >
                <Icon />
                {t.label}
                <span
                  style={{
                    background: active ? t.badgeColor : "#f3f4f6",
                    color: active ? "#fff" : "#6b7280",
                    borderRadius: 999,
                    fontSize: 11,
                    fontWeight: 700,
                    padding: "2px 7px",
                    minWidth: 20,
                    textAlign: "center" as const,
                    lineHeight: "16px",
                  }}
                >
                  {t.key === "news" ? newsCount : badgeText}
                </span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div style={{ padding: "20px 24px" }}>
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

      {/* Modals */}
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

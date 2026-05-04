import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Bell, FileText, Megaphone, Plus, Zap } from "lucide-react";
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

/* ──────────────────────────────────────────────
 *  Tabs configuration
 * ──────────────────────────────────────────── */
const tabs = [
  {
    key: "push" as Tab,
    apiKey: "PUSH_NOTIFICATIONS",
    label: "Push Notifications",
    Icon: Bell,
  },
  {
    key: "news" as Tab,
    apiKey: "NEWS_ANNOUNCEMENTS",
    label: "News & Announcements",
    Icon: FileText,
  },
  {
    key: "system" as Tab,
    apiKey: "SYSTEM_NOTIFICATIONS",
    label: "System Notifications",
    Icon: Zap,
  },
];

/* ──────────────────────────────────────────────
 *  Helpers
 * ──────────────────────────────────────────── */
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

/* ──────────────────────────────────────────────
 *  Component
 * ──────────────────────────────────────────── */
export default function Announcements() {
  const [activeTab, setActiveTab] = useState<Tab>("push");
  const [showModal, setShowModal] = useState(false);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);

  /* server-driven state */
  const [newsCount, setNewsCount] = useState(0);
  const [pushItems, setPushItems] = useState<PushNotification[]>([]);
  const [systemItems, setSystemItems] = useState<PushNotification[]>([]);
  const [tabBadges, setTabBadges] = useState<Record<string, string>>({});
  const [loadingTab, setLoadingTab] = useState<Record<string, boolean>>({});
  const [errorTab, setErrorTab] = useState<Record<string, string | null>>({});

  /* mutations */
  const [isCreatingPush, setIsCreatingPush] = useState(false);

  /* search / filters */
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

  /* details modal */
  const [detailsItem, setDetailsItem] =
    useState<CommunicationCardItemDto | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const newBtnLabel =
    activeTab === "news"
      ? "New Announcement"
      : activeTab === "system"
        ? "New Template"
        : "New Notification";

  const updateTabBadges = (tabsData: CommunicationTabCounter[]) => {
    setTabBadges((prev) => {
      const next: Record<string, string> = { ...prev };
      tabsData.forEach((tab) => {
        next[tab.key] = tab.badgeText ?? String(tab.count ?? 0);
      });
      return next;
    });
  };

  const fetchCenterTab = useCallback(
    async (
      tabKey: "PUSH_NOTIFICATIONS" | "SYSTEM_NOTIFICATIONS",
      statusValue: string,
      searchValue: string,
    ) => {
      setLoadingTab((prev) => ({ ...prev, [tabKey]: true }));
      setErrorTab((prev) => ({ ...prev, [tabKey]: null }));
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
        const msg =
          err instanceof Error ? err.message : "Failed to load communications";
        setErrorTab((prev) => ({ ...prev, [tabKey]: msg }));
        if (tabKey === "PUSH_NOTIFICATIONS") {
          setPushItems([]);
          setPushStatusOptions([]);
        } else {
          setSystemItems([]);
          setSystemStatusOptions([]);
        }
      } finally {
        setLoadingTab((prev) => ({ ...prev, [tabKey]: false }));
      }
    },
    [],
  );

  const handleDeleteNotification = async (
    id: string,
    tabKey: "PUSH_NOTIFICATIONS" | "SYSTEM_NOTIFICATIONS",
  ) => {
    try {
      await communicationsApi.deleteNotificationItem(id, tabKey);
      toast.success("Notification deleted");
      await fetchCenterTab(
        tabKey,
        tabKey === "PUSH_NOTIFICATIONS" ? pushStatus : systemStatus,
        tabKey === "PUSH_NOTIFICATIONS" ? pushSearch : systemSearch,
      );
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to delete";
      toast.error(msg);
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
      toast.success("Notification sent successfully");
      await fetchCenterTab("PUSH_NOTIFICATIONS", pushStatus, pushSearch);
      setShowModal(false);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Failed to create notification";
      toast.error(msg);
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
      const msg =
        err instanceof Error ? err.message : "Failed to load details";
      toast.error(msg);
    }
  };

  /* initial load + refresh on filter change */
  useEffect(() => {
    fetchCenterTab("PUSH_NOTIFICATIONS", pushStatus, pushSearch);
    fetchCenterTab("SYSTEM_NOTIFICATIONS", systemStatus, systemSearch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (activeTab === "push") {
      fetchCenterTab("PUSH_NOTIFICATIONS", pushStatus, pushSearch);
    }
    if (activeTab === "system") {
      fetchCenterTab("SYSTEM_NOTIFICATIONS", systemStatus, systemSearch);
    }
  }, [activeTab, pushStatus, pushSearch, systemStatus, systemSearch, fetchCenterTab]);

  const showCreateButton = activeTab !== "system";
  const currentTabApiKey = activeTab === "push"
    ? "PUSH_NOTIFICATIONS"
    : activeTab === "system"
      ? "SYSTEM_NOTIFICATIONS"
      : null;
  const currentError = currentTabApiKey ? errorTab[currentTabApiKey] : null;
  const currentLoading = currentTabApiKey ? loadingTab[currentTabApiKey] : false;

  return (
    <div className="min-h-screen bg-[#F4F6F8] p-6 md:p-8">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-7">
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#00A389] to-[#007A67] flex items-center justify-center text-white shadow-md shadow-[#00A389]/20">
            <Megaphone className="w-5 h-5" />
          </div>
          <div>
            <h1 className="m-0 text-2xl font-extrabold text-gray-900">
              Communications Center
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage all resident communications and notifications
            </p>
          </div>
        </div>
        {showCreateButton && (
          <button
            onClick={() =>
              activeTab === "news"
                ? setShowAnnouncementModal(true)
                : setShowModal(true)
            }
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00A389] hover:bg-[#008F77] active:scale-[0.99] text-white text-sm font-semibold shadow-md hover:shadow-lg transition disabled:opacity-70"
          >
            <Plus className="w-4 h-4" />
            {newBtnLabel}
          </button>
        )}
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-gray-100 px-2 sm:px-5 overflow-x-auto">
          {tabs.map((t) => {
            const active = activeTab === t.key;
            const badgeText = tabBadges[t.apiKey] ?? "0";
            const Icon = t.Icon;
            return (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`flex items-center gap-2 px-4 py-4 text-sm whitespace-nowrap border-b-[2.5px] transition-colors ${
                  active
                    ? "text-[#00A389] border-[#00A389] font-bold"
                    : "text-gray-500 border-transparent font-medium hover:text-gray-700"
                }`}
              >
                <Icon className="w-4 h-4" />
                {t.label}
                <span
                  className={`text-[11px] font-bold rounded-full px-2 py-0.5 ${
                    active
                      ? "bg-[#00A389] text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {t.key === "news" ? newsCount : badgeText}
                </span>
              </button>
            );
          })}
        </div>

        {/* Body */}
        <div className="p-5">
          {/* Error banner */}
          {currentError && !currentLoading && (
            <div className="mb-5 flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
              <span>⚠️ {currentError}</span>
              <button
                onClick={() => {
                  if (currentTabApiKey === "PUSH_NOTIFICATIONS") {
                    fetchCenterTab(currentTabApiKey, pushStatus, pushSearch);
                  } else if (currentTabApiKey === "SYSTEM_NOTIFICATIONS") {
                    fetchCenterTab(currentTabApiKey, systemStatus, systemSearch);
                  }
                }}
                className="px-3 py-1.5 rounded-lg bg-white border border-red-200 text-red-700 text-xs font-semibold hover:bg-red-50 transition"
              >
                Retry
              </button>
            </div>
          )}

          {/* Loading state */}
          {currentLoading && (
            <div className="flex flex-col items-center justify-center py-16 text-gray-500">
              <div
                className="w-9 h-9 mb-3 rounded-full border-[3px] border-gray-200 border-t-[#00A389] animate-spin"
                aria-label="Loading"
              />
              <p className="text-sm font-medium">Loading…</p>
            </div>
          )}

          {/* Tab content */}
          {!currentLoading && activeTab === "push" && (
            <PushNotifications
              items={pushItems}
              onDelete={(id) => handleDeleteNotification(id, "PUSH_NOTIFICATIONS")}
              search={pushSearch}
              onSearchChange={setPushSearch}
              statusOptions={pushStatusOptions}
              statusValue={pushStatus}
              onStatusChange={setPushStatus}
              onView={(item) => handleViewNotification(item, "PUSH_NOTIFICATIONS")}
            />
          )}
          {activeTab === "news" && (
            <NewsAnnouncements
              isCreateOpen={showAnnouncementModal}
              onCloseCreate={() => setShowAnnouncementModal(false)}
              onCountChange={setNewsCount}
            />
          )}
          {!currentLoading && activeTab === "system" && (
            <SystemNotifications
              items={systemItems}
              onDelete={(id) =>
                handleDeleteNotification(id, "SYSTEM_NOTIFICATIONS")
              }
              onRefresh={() =>
                fetchCenterTab("SYSTEM_NOTIFICATIONS", systemStatus, systemSearch)
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

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import {
  CheckCircle2,
  FileText,
  Inbox,
  Plus,
  RefreshCw,
  Search,
  Send,
  TrendingUp,
  Zap,
} from "lucide-react";
import type { PushNotification } from "../../types";
import { systemApi } from "./systemApi";
import { SystemNotifCard } from "./SystemNotifCard";
import {
  CreateTemplateModal,
  type CreateTemplateFormData,
} from "./CreateTemplateModal";
import {
  EditTemplateModal,
  type EditTemplateFormData,
} from "./EditTemplateModal";
import { LocalViewModal } from "./LocalViewModal";
import {
  addLocalTemplate,
  getLocalTemplates,
  isKnownPushId,
  registerSystemIds,
  removeLocalTemplate,
  unregisterSystemId,
} from "./templateStore";

/* ──────────── Error helpers ──────────── */
type ProblemDetail = {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  message?: string;
  errors?: Record<string, string[]> | string[];
};

function extractApiError(err: unknown, fallback: string): string {
  if (isAxiosError(err)) {
    const data = err.response?.data as ProblemDetail | string | undefined;
    if (typeof data === "string" && data.trim()) return data;
    if (data && typeof data === "object") {
      const detail = data.detail || data.message || data.title;
      if (detail) {
        if (data.errors) {
          const flat = Array.isArray(data.errors)
            ? data.errors.join(", ")
            : Object.values(data.errors).flat().join(", ");
          if (flat) return detail + " — " + flat;
        }
        return detail;
      }
    }
    if (err.response?.status === 409)
      return "Cannot modify this notification — it may have already been sent or is locked by the server.";
    if (err.response?.status)
      return "Request failed (" + err.response.status + "). Please try again.";
  }
  if (err instanceof Error && err.message) return err.message;
  return fallback;
}

/* ──────────── Types ──────────── */
interface SystemNotificationsProps {
  items: PushNotification[];
  onDelete: (id: string) => void;
  onRefresh: () => void;
  search: string;
  onSearchChange: (value: string) => void;
  statusOptions: Array<{ value: string; label: string; count?: number }>;
  statusValue: string;
  onStatusChange: (value: string) => void;
  onView?: (notif: PushNotification) => void;
}

interface SummaryCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  gradient: string;
  border: string;
  labelColor: string;
  valueColor: string;
  iconBg: string;
  iconColor: string;
}

function SummaryCard({
  label,
  value,
  icon,
  gradient,
  border,
  labelColor,
  valueColor,
  iconBg,
  iconColor,
}: SummaryCardProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border ${border} ${gradient} px-5 py-4`}
    >
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <p
            className={`m-0 text-[11px] font-bold uppercase tracking-wider ${labelColor}`}
          >
            {label}
          </p>
          <p className={`m-0 mt-2 text-3xl font-extrabold ${valueColor}`}>
            {value}
          </p>
        </div>
        <div
          className={`w-9 h-9 rounded-xl ${iconBg} ${iconColor} flex items-center justify-center flex-shrink-0`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

function typeToPriority(type: string): string {
  switch (type) {
    case "Payment":
    case "Security":
      return "HIGH";
    case "Maintenance":
    case "Event":
      return "NORMAL";
    default:
      return "NORMAL";
  }
}

function makeLocalId(): string {
  return (
    "local-" +
    Date.now().toString(36) +
    "-" +
    Math.random().toString(36).slice(2, 8)
  );
}

function isLocalId(id: string): boolean {
  return typeof id === "string" && id.startsWith("local-");
}

export function SystemNotifications({
  items,
  onDelete,
  onRefresh,
  search,
  onSearchChange,
  statusOptions,
  statusValue,
  onStatusChange,
  onView,
}: SystemNotificationsProps) {
  /* modal state */
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingNotif, setEditingNotif] = useState<PushNotification | null>(
    null,
  );
  const [viewingLocal, setViewingLocal] = useState<PushNotification | null>(
    null,
  );
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  /* local templates */
  const [localTemplates, setLocalTemplates] = useState<PushNotification[]>(
    () => getLocalTemplates(),
  );

  useEffect(() => {
    const onStorage = () => setLocalTemplates(getLocalTemplates());
    if (typeof window !== "undefined") {
      window.addEventListener("storage", onStorage);
      return () => window.removeEventListener("storage", onStorage);
    }
    return undefined;
  }, []);

  /* Register the ids the API tells us belong to the System tab.
   * registerSystemIds enforces first-seen ownership against pushIds. */
  const apiIds = useMemo(
    () => items.map((n) => n.id).filter((id): id is string => Boolean(id)),
    [items],
  );
  useEffect(() => {
    if (apiIds.length > 0) registerSystemIds(apiIds);
  }, [apiIds]);

  /* Merged & deduped list:
   *   - drop API items already claimed by Push
   *   - prepend locally-stored templates (newest first) */
  const merged = useMemo<PushNotification[]>(() => {
    const localById = new Map<string, PushNotification>(
      localTemplates.map((t) => [t.id, t]),
    );
    const apiCleaned = items.filter(
      (n) => !isKnownPushId(n.id) && !localById.has(n.id),
    );
    return [...localTemplates, ...apiCleaned];
  }, [items, localTemplates]);

  const filtered = useMemo(
    () =>
      merged.filter(
        (n) =>
          n.title.toLowerCase().includes(search.toLowerCase()) ||
          n.description.toLowerCase().includes(search.toLowerCase()),
      ),
    [merged, search],
  );

  const summary = useMemo(() => {
    const total = merged.length;
    const active = merged.filter((n) => n.status === "Sent").length;
    const totalSent = merged.reduce((acc, n) => acc + (n.recipients ?? 0), 0);
    const successAvg =
      merged.length > 0
        ? merged.reduce((acc, n) => acc + (n.readPercent ?? 0), 0) /
          merged.length
        : 0;
    return {
      active,
      totalSent,
      successAvg: Number(successAvg.toFixed(1)),
      total,
    };
  }, [merged]);

  /* Create */
  const handleCreateTemplate = async (data: CreateTemplateFormData) => {
    const optimistic: PushNotification = {
      id: makeLocalId(),
      title: data.name,
      status: data.enabled ? "Sent" : "Draft",
      priority:
        typeToPriority(data.type) === "HIGH"
          ? "HIGH"
          : typeToPriority(data.type) === "LOW"
            ? "LOW"
            : "NORMAL",
      description: data.message,
      recipients: 0,
      readCount: 0,
      readPercent: 0,
      sentAt: undefined,
      scheduledAt: data.trigger,
      sentBy: "Admin",
    };

    try {
      setIsCreating(true);
      addLocalTemplate(optimistic);
      setLocalTemplates(getLocalTemplates());

      try {
        await systemApi.createTemplate({
          title: data.name,
          message: data.message,
          priority: typeToPriority(data.type),
          scheduleAt: null,
          sendToAll: true,
        });
      } catch (apiErr) {
        toast.warning(
          "Template saved locally. Backend sync failed: " +
            extractApiError(apiErr, "unknown error"),
        );
        setCreateOpen(false);
        onRefresh();
        return;
      }

      toast.success("Template created successfully");
      setCreateOpen(false);
      onRefresh();
    } finally {
      setIsCreating(false);
    }
  };

  /* Edit */
  const handleEditTemplate = async (
    notif: PushNotification,
    data: EditTemplateFormData,
  ) => {
    const local = isLocalId(notif.id);
    try {
      setIsEditing(true);

      const updated: PushNotification = {
        ...notif,
        title: data.name,
        description: data.message,
        scheduledAt: data.trigger,
      };

      if (local) {
        addLocalTemplate(updated);
        setLocalTemplates(getLocalTemplates());
        toast.success("Template updated successfully");
        setEditOpen(false);
        setEditingNotif(null);
        return;
      }

      const payload: { title?: string; message?: string } = {};
      if (data.name && data.name !== notif.title) payload.title = data.name;
      if (data.message && data.message !== notif.description)
        payload.message = data.message;

      if (Object.keys(payload).length === 0) {
        toast.info("No changes to save");
        setEditOpen(false);
        setEditingNotif(null);
        return;
      }

      await systemApi.updateTemplate(notif.id, payload);
      toast.success("Template updated successfully");
      setEditOpen(false);
      setEditingNotif(null);
      onRefresh();
    } catch (err) {
      toast.error(extractApiError(err, "Failed to update template"));
    } finally {
      setIsEditing(false);
    }
  };

  /* View — route local templates to local modal, others to parent's API view */
  const handleView = (notif: PushNotification) => {
    if (isLocalId(notif.id)) {
      setViewingLocal(notif);
      return;
    }
    onView?.(notif);
  };

  /* Delete — clean up registry + local store */
  const handleDelete = async (id: string) => {
    const local = isLocalId(id);
    removeLocalTemplate(id);
    setLocalTemplates(getLocalTemplates());
    unregisterSystemId(id);
    if (!local) {
      onDelete(id);
    } else {
      toast.success("Template deleted");
    }
  };

  return (
    <div>
      {/* Section header */}
      <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
        <div>
          <h2 className="m-0 text-[15px] font-bold text-gray-900">
            Notification Templates
          </h2>
          <p className="m-0 mt-0.5 text-xs text-gray-500">
            Configure system-triggered notifications and templates
          </p>
        </div>
        <button
          type="button"
          onClick={() => setCreateOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#00A389] hover:bg-[#008F77] active:scale-[0.99] text-white text-sm font-semibold shadow-md hover:shadow-lg transition"
        >
          <Plus className="w-4 h-4" />
          New Template
        </button>
      </div>

      {/* Info banner */}
      <div className="flex items-start gap-3 p-4 mb-5 rounded-2xl bg-violet-50 border border-violet-200">
        <div className="w-9 h-9 rounded-lg bg-violet-100 flex items-center justify-center text-violet-600 flex-shrink-0">
          <Zap className="w-4 h-4" />
        </div>
        <div>
          <p className="m-0 font-bold text-sm text-violet-700">
            Automated System Notifications
          </p>
          <p className="m-0 mt-0.5 text-[13px] text-violet-600/90">
            These notifications are triggered automatically by system events.
            You can enable/disable them, edit templates, and monitor
            performance.
          </p>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <SummaryCard
          label="Active"
          value={summary.active.toString()}
          gradient="bg-gradient-to-br from-emerald-50 to-teal-50"
          border="border-emerald-100"
          labelColor="text-emerald-700"
          valueColor="text-emerald-800"
          iconBg="bg-emerald-100"
          iconColor="text-emerald-600"
          icon={<CheckCircle2 className="w-4 h-4" />}
        />
        <SummaryCard
          label="Total Sent"
          value={summary.totalSent.toLocaleString()}
          gradient="bg-gradient-to-br from-blue-50 to-indigo-50"
          border="border-blue-100"
          labelColor="text-blue-700"
          valueColor="text-blue-800"
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
          icon={<Send className="w-4 h-4" />}
        />
        <SummaryCard
          label="Avg Success"
          value={summary.successAvg + "%"}
          gradient="bg-gradient-to-br from-fuchsia-50 to-pink-50"
          border="border-fuchsia-100"
          labelColor="text-fuchsia-700"
          valueColor="text-fuchsia-800"
          iconBg="bg-fuchsia-100"
          iconColor="text-fuchsia-600"
          icon={<TrendingUp className="w-4 h-4" />}
        />
        <SummaryCard
          label="Templates"
          value={summary.total.toString()}
          gradient="bg-gradient-to-br from-amber-50 to-orange-50"
          border="border-amber-100"
          labelColor="text-amber-700"
          valueColor="text-amber-800"
          iconBg="bg-amber-100"
          iconColor="text-amber-600"
          icon={<FileText className="w-4 h-4" />}
        />
      </div>

      {/* Filters row */}
      <div className="flex flex-col md:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search system notifications..."
            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-3 py-2.5 text-sm text-gray-800 outline-none focus:border-[#00A389] focus:ring-2 focus:ring-[#00A389]/15 transition-all"
          />
        </div>
        <select
          value={statusValue}
          onChange={(e) => onStatusChange(e.target.value)}
          className="md:w-56 bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-800 outline-none focus:border-[#00A389] focus:ring-2 focus:ring-[#00A389]/15 transition-all"
        >
          {statusOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
              {option.count !== undefined ? " (" + option.count + ")" : ""}
            </option>
          ))}
        </select>
        <button
          onClick={onRefresh}
          title="Refresh"
          className="flex items-center justify-center gap-2 md:w-auto px-4 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-sm font-semibold text-gray-700 transition"
        >
          <RefreshCw className="w-4 h-4" />
          <span className="md:hidden">Refresh</span>
        </button>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-3">
            <Inbox className="w-6 h-6 text-gray-400" />
          </div>
          <p className="text-sm font-medium text-gray-600">
            No notifications found
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((n) => (
            <SystemNotifCard
              key={n.id}
              notif={n}
              onAnalytics={handleView}
              onEdit={(notif) => {
                setEditingNotif(notif);
                setEditOpen(true);
              }}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <CreateTemplateModal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        onSave={handleCreateTemplate}
        isSubmitting={isCreating}
      />
      <EditTemplateModal
        isOpen={editOpen}
        notif={editingNotif}
        onClose={() => {
          setEditOpen(false);
          setEditingNotif(null);
        }}
        onSave={handleEditTemplate}
        isSubmitting={isEditing}
      />
      <LocalViewModal
        isOpen={Boolean(viewingLocal)}
        notif={viewingLocal}
        onClose={() => setViewingLocal(null)}
        onEdit={(notif) => {
          setViewingLocal(null);
          setEditingNotif(notif);
          setEditOpen(true);
        }}
      />
    </div>
  );
}

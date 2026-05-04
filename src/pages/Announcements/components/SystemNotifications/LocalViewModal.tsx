import { Edit3, X } from "lucide-react";
import type { PushNotification } from "../../types";

interface LocalViewModalProps {
  isOpen: boolean;
  notif: PushNotification | null;
  onClose: () => void;
  onEdit?: (notif: PushNotification) => void;
}

const priorityStyles: Record<string, string> = {
  HIGH: "bg-red-50 text-red-600 border-red-200",
  NORMAL: "bg-blue-50 text-blue-600 border-blue-200",
  LOW: "bg-gray-50 text-gray-600 border-gray-200",
};

const statusStyles: Record<string, string> = {
  Sent: "bg-emerald-50 text-emerald-600 border-emerald-200",
  Draft: "bg-amber-50 text-amber-600 border-amber-200",
};

/**
 * Read-only details view for templates that exist only in client-side
 * storage (id prefix `local-`). These templates have no backend record,
 * so the parent's API-backed details modal can't load them. This modal
 * renders the values directly from the in-memory PushNotification.
 */
export function LocalViewModal({
  isOpen,
  notif,
  onClose,
  onEdit,
}: LocalViewModalProps) {
  if (!isOpen || !notif) return null;

  const priorityKey = (notif.priority ?? "NORMAL").toUpperCase();
  const priorityClass =
    priorityStyles[priorityKey] ?? priorityStyles.NORMAL;
  const statusClass = statusStyles[notif.status ?? "Draft"] ?? statusStyles.Draft;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/40"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-[560px] max-h-[92vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100">
          <h2 className="text-[17px] font-bold text-gray-900">
            Template Details
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Title + badges */}
          <div>
            <h3 className="m-0 text-[18px] font-bold text-gray-900">
              {notif.title}
            </h3>
            <div className="flex items-center gap-2 mt-2">
              <span
                className={
                  "inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border " +
                  statusClass
                }
              >
                {notif.status}
              </span>
              {notif.priority && (
                <span
                  className={
                    "inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold border " +
                    priorityClass
                  }
                >
                  {notif.priority}
                </span>
              )}
            </div>
          </div>

          {/* Message template */}
          <div>
            <p className="text-xs font-semibold text-gray-500 mb-1.5">
              Message Template
            </p>
            <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 font-mono text-[13px] text-gray-700 leading-relaxed whitespace-pre-wrap">
              {notif.description || "—"}
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-3">
              <p className="text-xs font-medium text-gray-500">Total Sent</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {(notif.recipients ?? 0).toLocaleString()}
              </p>
            </div>
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3">
              <p className="text-xs font-medium text-emerald-600">
                Success Rate
              </p>
              <p className="text-2xl font-bold text-emerald-700 mt-1">
                {notif.readPercent ?? 0}%
              </p>
            </div>
          </div>

          {/* Detail rows */}
          <div className="rounded-xl border border-gray-100 divide-y divide-gray-100">
            <div className="flex justify-between px-4 py-3">
              <span className="text-sm text-gray-500">Created By</span>
              <span className="text-sm font-semibold text-gray-800">
                {notif.sentBy || "Admin"}
              </span>
            </div>
            <div className="flex justify-between px-4 py-3">
              <span className="text-sm text-gray-500">Trigger Condition</span>
              <span className="text-sm font-semibold text-gray-800 text-right max-w-[60%]">
                {notif.scheduledAt || "When event occurs"}
              </span>
            </div>
            <div className="flex justify-between px-4 py-3">
              <span className="text-sm text-gray-500">Last Sent</span>
              <span className="text-sm font-semibold text-emerald-700">
                {notif.sentAt || "—"}
              </span>
            </div>
          </div>

          {/* Local note */}
          <div className="rounded-xl bg-amber-50 border border-amber-200 px-4 py-3">
            <p className="text-[12.5px] text-amber-700 m-0">
              This template is stored locally on this device. Backend
              synchronisation may be limited.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 text-sm font-semibold transition"
          >
            Close
          </button>
          {onEdit && (
            <button
              onClick={() => onEdit(notif)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00A389] hover:bg-[#008F77] text-white text-sm font-semibold shadow-md hover:shadow-lg transition"
            >
              <Edit3 className="w-4 h-4" />
              Edit
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

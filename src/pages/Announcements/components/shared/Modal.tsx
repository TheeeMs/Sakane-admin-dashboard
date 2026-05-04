import { useEffect, useState } from "react";
import { Calendar, Clock, Send, X } from "lucide-react";
import type { Tab, Priority } from "../../types";

export type NotificationFormData = {
  title: string;
  message: string;
  priority: Priority;
  scheduleAt?: string | null;
};

interface ModalProps {
  tab: Tab;
  onClose: () => void;
  onSubmit?: (data: NotificationFormData) => void;
  isSubmitting?: boolean;
}

const labelClass = "block text-[13px] font-semibold text-gray-700 mb-1.5";
const inputClass =
  "w-full bg-white border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-800 outline-none focus:border-[#00A389] focus:ring-2 focus:ring-[#00A389]/15 transition placeholder:text-gray-400 disabled:bg-gray-50 disabled:cursor-not-allowed";

export function Modal({
  tab,
  onClose,
  onSubmit,
  isSubmitting = false,
}: ModalProps) {
  const modalTitle =
    tab === "news"
      ? "Create News Announcement"
      : tab === "system"
        ? "Create System Template"
        : "Create Push Notification";

  const [formTitle, setFormTitle] = useState("");
  const [message, setMessage] = useState("");
  const [priority, setPriority] = useState<Priority>("LOW");
  const [scheduleEnabled, setScheduleEnabled] = useState(false);
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setFormTitle("");
    setMessage("");
    setPriority("LOW");
    setScheduleEnabled(false);
    setScheduleDate("");
    setScheduleTime("");
    setErrors({});
  }, [tab]);

  const validate = () => {
    if (tab !== "push") return true;
    const nextErrors: Record<string, string> = {};
    if (!formTitle.trim()) nextErrors.title = "Title is required";
    if (!message.trim()) nextErrors.message = "Message is required";
    if (scheduleEnabled && (!scheduleDate || !scheduleTime)) {
      nextErrors.schedule = "Date and time are required for scheduling";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSend = (saveAsDraft = false) => {
    if (!onSubmit || tab !== "push") return;
    if (!validate()) return;
    const scheduleAtIso =
      scheduleEnabled && scheduleDate && scheduleTime
        ? new Date(`${scheduleDate}T${scheduleTime}`).toISOString()
        : null;
    onSubmit({
      title: formTitle.trim(),
      message: message.trim(),
      priority,
      scheduleAt: saveAsDraft ? scheduleAtIso : scheduleAtIso,
    });
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-[560px] max-h-[92vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100">
          <h2 className="text-[17px] font-bold text-gray-900">{modalTitle}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {tab === "system" ? (
            <div className="rounded-xl bg-violet-50 border border-violet-200 px-4 py-3 text-sm text-violet-700">
              System notifications are generated automatically by platform
              events and cannot be created manually.
            </div>
          ) : (
            <>
              {/* Notification Title */}
              <div>
                <label className={labelClass}>
                  Notification Title <span className="text-red-500">*</span>
                </label>
                <input
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Enter notification title"
                  disabled={isSubmitting}
                  className={`${inputClass} ${
                    errors.title ? "border-red-300 focus:ring-red-200" : ""
                  }`}
                />
                {errors.title && (
                  <p className="text-red-500 text-xs mt-1.5">{errors.title}</p>
                )}
              </div>

              {/* Message */}
              <div>
                <label className={labelClass}>
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Enter notification message"
                  rows={4}
                  disabled={isSubmitting}
                  className={`${inputClass} resize-none ${
                    errors.message ? "border-red-300 focus:ring-red-200" : ""
                  }`}
                />
                {errors.message && (
                  <p className="text-red-500 text-xs mt-1.5">{errors.message}</p>
                )}
              </div>

              {/* Priority + Recipients */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as Priority)}
                    disabled={isSubmitting}
                    className={inputClass}
                  >
                    <option value="LOW">Low</option>
                    <option value="NORMAL">Normal</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Recipients</label>
                  <select disabled={isSubmitting} className={inputClass}>
                    <option>All Residents</option>
                  </select>
                </div>
              </div>

              {/* Schedule for Later */}
              <div
                className={`rounded-xl border px-4 py-3 transition-colors ${
                  scheduleEnabled
                    ? "bg-blue-50 border-blue-200"
                    : "bg-gray-50 border-gray-100"
                }`}
              >
                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={scheduleEnabled}
                    onChange={(e) => setScheduleEnabled(e.target.checked)}
                    disabled={isSubmitting}
                    className="mt-0.5 w-4 h-4 accent-[#00A389] cursor-pointer"
                  />
                  <div>
                    <p className="text-sm font-bold text-gray-800">
                      Schedule for Later
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Choose a specific date and time to send this notification
                    </p>
                  </div>
                </label>
                {scheduleEnabled && (
                  <div className="grid grid-cols-2 gap-3 mt-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-500 mb-1">
                        Date
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                        <input
                          type="date"
                          value={scheduleDate}
                          onChange={(e) => setScheduleDate(e.target.value)}
                          disabled={isSubmitting}
                          className={`${inputClass} pl-9 py-2`}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-500 mb-1">
                        Time
                      </label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                        <input
                          type="time"
                          value={scheduleTime}
                          onChange={(e) => setScheduleTime(e.target.value)}
                          disabled={isSubmitting}
                          className={`${inputClass} pl-9 py-2`}
                        />
                      </div>
                    </div>
                  </div>
                )}
                {errors.schedule && (
                  <p className="text-red-500 text-xs mt-2">{errors.schedule}</p>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-gray-100">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 text-sm font-semibold transition disabled:opacity-50"
          >
            Cancel
          </button>
          {tab === "push" && (
            <>
              <button
                onClick={() => handleSend(true)}
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 bg-gray-50 hover:bg-gray-100 text-sm font-semibold transition disabled:opacity-50"
              >
                Save as Draft
              </button>
              <button
                onClick={() => handleSend(false)}
                disabled={isSubmitting}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00A389] hover:bg-[#008F77] text-white text-sm font-semibold shadow-md hover:shadow-lg transition disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                {isSubmitting ? "Sending..." : "Send Now"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

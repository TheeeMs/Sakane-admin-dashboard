import { useMemo, useState } from "react";
import { Info, Save, X } from "lucide-react";

export type NotificationType =
  | "Payment"
  | "Maintenance"
  | "Event"
  | "Security"
  | "General";

export interface CreateTemplateFormData {
  name: string;
  type: NotificationType;
  message: string;
  trigger: string;
  enabled: boolean;
}

interface CreateTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateTemplateFormData) => Promise<void> | void;
  isSubmitting?: boolean;
}

const NOTIFICATION_TYPES: { value: NotificationType; label: string }[] = [
  { value: "Payment", label: "Payment" },
  { value: "Maintenance", label: "Maintenance" },
  { value: "Event", label: "Event" },
  { value: "Security", label: "Security" },
  { value: "General", label: "General" },
];

const PREVIEW_VALUES: Record<string, string> = {
  amount: "2,500 EGP",
  date: "Feb 12, 2026",
  name: "Ahmed Hassan",
  ticketId: "12345",
  eventName: "Community BBQ",
  code: "A1B2C3",
  duration: "24 hours",
  guestName: "Sarah",
  time: "6:00 PM",
};

function renderPreview(template: string): string {
  if (!template.trim())
    return "Your payment of 2,500 EGP has been received on Feb 12, 2026. Thank you!";
  return template.replace(/\{(\w+)\}/g, (_, key: string) => {
    return PREVIEW_VALUES[key] ?? `{${key}}`;
  });
}

export function CreateTemplateModal({
  isOpen,
  onClose,
  onSave,
  isSubmitting = false,
}: CreateTemplateModalProps) {
  const [name, setName] = useState("");
  const [type, setType] = useState<NotificationType | "">("");
  const [message, setMessage] = useState("");
  const [trigger, setTrigger] = useState("");
  const [enabled, setEnabled] = useState(true);
  const [touched, setTouched] = useState(false);

  const previewText = useMemo(() => renderPreview(message), [message]);

  const isValid = name.trim() && type && message.trim() && trigger.trim();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!isValid || !type) return;
    await onSave({
      name: name.trim(),
      type: type as NotificationType,
      message: message.trim(),
      trigger: trigger.trim(),
      enabled,
    });
  };

  const handleClose = () => {
    setName("");
    setType("");
    setMessage("");
    setTrigger("");
    setEnabled(true);
    setTouched(false);
    onClose();
  };

  return (
    <div
      onClick={handleClose}
      className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/40"
    >
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-[640px] max-h-[92vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100">
          <h2 className="text-[17px] font-bold text-gray-900">
            Create System Notification Template
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="w-8 h-8 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Template Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1.5">
              Template Name <span className="text-red-500">*</span>
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Payment Confirmation"
              className={`w-full bg-white border rounded-xl px-3.5 py-2.5 text-sm text-gray-800 outline-none focus:border-[#00A389] focus:ring-2 focus:ring-[#00A389]/15 transition ${
                touched && !name.trim()
                  ? "border-red-300"
                  : "border-gray-200"
              }`}
            />
          </div>

          {/* Notification Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1.5">
              Notification Type <span className="text-red-500">*</span>
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as NotificationType)}
              className={`w-full bg-white border rounded-xl px-3.5 py-2.5 text-sm text-gray-800 outline-none focus:border-[#00A389] focus:ring-2 focus:ring-[#00A389]/15 transition ${
                touched && !type ? "border-red-300" : "border-gray-200"
              }`}
            >
              <option value="">Select type...</option>
              {NOTIFICATION_TYPES.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Message Template */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1.5">
              Message Template <span className="text-red-500">*</span>
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              placeholder="Enter template message. Use variables like {amount}, {date}, {name}, {ticketId}, etc."
              className={`w-full bg-white border rounded-xl px-3.5 py-2.5 text-sm text-gray-800 font-mono outline-none focus:border-[#00A389] focus:ring-2 focus:ring-[#00A389]/15 transition resize-none ${
                touched && !message.trim()
                  ? "border-red-300"
                  : "border-gray-200"
              }`}
            />
            <p className="mt-1.5 text-[12px] text-gray-500">
              Available variables:{" "}
              <span className="font-mono text-gray-600">
                {`{amount}, {date}, {name}, {ticketId}, {eventName}, {code}, {duration}, {guestName}`}
              </span>
            </p>
          </div>

          {/* Trigger Condition */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1.5">
              Trigger Condition <span className="text-red-500">*</span>
            </label>
            <input
              value={trigger}
              onChange={(e) => setTrigger(e.target.value)}
              placeholder="e.g., When payment is received, 3 days before due date"
              className={`w-full bg-white border rounded-xl px-3.5 py-2.5 text-sm text-gray-800 outline-none focus:border-[#00A389] focus:ring-2 focus:ring-[#00A389]/15 transition ${
                touched && !trigger.trim()
                  ? "border-red-300"
                  : "border-gray-200"
              }`}
            />
          </div>

          {/* Enable Template */}
          <label
            htmlFor="enable-template"
            className="flex items-start gap-3 p-4 rounded-xl bg-violet-50/60 border border-violet-200 cursor-pointer"
          >
            <input
              id="enable-template"
              type="checkbox"
              checked={enabled}
              onChange={(e) => setEnabled(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded border-violet-300 text-violet-600 focus:ring-violet-500 cursor-pointer"
            />
            <div>
              <p className="m-0 font-bold text-sm text-gray-900">
                Enable Template
              </p>
              <p className="m-0 mt-0.5 text-[12.5px] text-gray-600">
                Start sending notifications automatically when trigger
                condition is met
              </p>
            </div>
          </label>

          {/* Preview */}
          <div className="rounded-xl bg-blue-50/40 border border-blue-200 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Info className="w-4 h-4 text-blue-600" />
              <p className="m-0 font-bold text-sm text-gray-900">Preview</p>
            </div>
            <div className="bg-white border border-blue-100 rounded-lg px-3 py-2.5 font-mono text-[12.5px] text-gray-700 leading-relaxed">
              {previewText}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-gray-100 bg-gray-50/40">
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-700 bg-white hover:bg-gray-50 text-sm font-semibold transition disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !isValid}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#00A389] hover:bg-[#008F77] text-white text-sm font-semibold shadow-md hover:shadow-lg transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <Save className="w-4 h-4" />
            {isSubmitting ? "Saving..." : "Save Template"}
          </button>
        </div>
      </form>
    </div>
  );
}

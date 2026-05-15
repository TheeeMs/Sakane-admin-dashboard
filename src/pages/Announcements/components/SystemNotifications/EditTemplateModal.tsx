import { useState } from "react";
import { Save, X } from "lucide-react";
import type { PushNotification } from "../../types";

export interface EditTemplateFormData {
  name: string;
  message: string;
  trigger: string;
}

interface EditTemplateModalProps {
  isOpen: boolean;
  notif: PushNotification | null;
  onClose: () => void;
  onSave: (
    notif: PushNotification,
    data: EditTemplateFormData,
  ) => Promise<void> | void;
  isSubmitting?: boolean;
}

function inferTrigger(notif: PushNotification): string {
  return (
    notif.scheduledAt?.replace(/^Scheduled\s+/i, "") ||
    (notif.status === "Draft"
      ? "Draft — not yet triggered"
      : "When event occurs")
  );
}

/* Inner form is remounted on each open via key, so useState initializers
 * run with the active notif's values — no setState-in-effect needed. */
function EditTemplateForm({
  notif,
  onClose,
  onSave,
  isSubmitting,
}: {
  notif: PushNotification;
  onClose: () => void;
  onSave: EditTemplateModalProps["onSave"];
  isSubmitting: boolean;
}) {
  const [name, setName] = useState(notif.title ?? "");
  const [message, setMessage] = useState(notif.description ?? "");
  const [trigger, setTrigger] = useState(inferTrigger(notif));
  const [touched, setTouched] = useState(false);

  const isValid = name.trim() && message.trim() && trigger.trim();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!isValid) return;
    await onSave(notif, {
      name: name.trim(),
      message: message.trim(),
      trigger: trigger.trim(),
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      onClick={(e) => e.stopPropagation()}
      className="bg-white w-full max-w-[560px] max-h-[92vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100">
        <h2 className="text-[17px] font-bold text-gray-900">Edit Template</h2>
        <button
          type="button"
          onClick={onClose}
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
            className={
              "w-full bg-white border rounded-xl px-3.5 py-2.5 text-sm text-gray-800 outline-none focus:border-[#00A389] focus:ring-2 focus:ring-[#00A389]/15 transition " +
              (touched && !name.trim() ? "border-red-300" : "border-gray-200")
            }
          />
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
            className={
              "w-full bg-white border rounded-xl px-3.5 py-2.5 text-sm text-gray-800 font-mono outline-none focus:border-[#00A389] focus:ring-2 focus:ring-[#00A389]/15 transition resize-none " +
              (touched && !message.trim()
                ? "border-red-300"
                : "border-gray-200")
            }
          />
        </div>

        {/* Trigger Condition */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-1.5">
            Trigger Condition <span className="text-red-500">*</span>
          </label>
          <input
            value={trigger}
            onChange={(e) => setTrigger(e.target.value)}
            className={
              "w-full bg-white border rounded-xl px-3.5 py-2.5 text-sm text-gray-800 outline-none focus:border-[#00A389] focus:ring-2 focus:ring-[#00A389]/15 transition " +
              (touched && !trigger.trim()
                ? "border-red-300"
                : "border-gray-200")
            }
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-gray-100 bg-gray-50/40">
        <button
          type="button"
          onClick={onClose}
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
          {isSubmitting ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}

export function EditTemplateModal({
  isOpen,
  notif,
  onClose,
  onSave,
  isSubmitting = false,
}: EditTemplateModalProps) {
  if (!isOpen || !notif) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/40"
    >
      {/* key forces fresh state when the active notif changes */}
      <EditTemplateForm
        key={notif.id}
        notif={notif}
        onClose={onClose}
        onSave={onSave}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}

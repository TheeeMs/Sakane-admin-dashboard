import { useEffect, useState } from "react";
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

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 12,
  fontWeight: 600,
  color: "#374151",
  marginBottom: 6,
};
const inputStyle: React.CSSProperties = {
  width: "100%",
  boxSizing: "border-box",
  padding: "9px 12px",
  border: "1px solid #e5e7eb",
  borderRadius: 8,
  fontSize: 14,
  color: "#111827",
  background: "#fafafa",
  outline: "none",
};

function Field({
  label,
  placeholder,
  multiline,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  multiline?: boolean;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      {multiline ? (
        <textarea
          placeholder={placeholder}
          rows={3}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={{ ...inputStyle, resize: "vertical" }}
        />
      ) : (
        <input
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          style={inputStyle}
        />
      )}
    </div>
  );
}

export function Modal({
  tab,
  onClose,
  onSubmit,
  isSubmitting = false,
}: ModalProps) {
  const title =
    tab === "news"
      ? "+ New Announcement"
      : tab === "system"
        ? "+ New Template"
        : "+ New Notification";
  const [formTitle, setFormTitle] = useState("");
  const [message, setMessage] = useState("");
  const [priority, setPriority] = useState<Priority>("NORMAL");
  const [sendType, setSendType] = useState("Instant");
  const [scheduleAt, setScheduleAt] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setFormTitle("");
    setMessage("");
    setPriority("NORMAL");
    setSendType("Instant");
    setScheduleAt("");
    setErrors({});
  }, [tab]);

  const validate = () => {
    if (tab !== "push") return true;
    const nextErrors: Record<string, string> = {};
    if (!formTitle.trim()) nextErrors.title = "Title is required";
    if (!message.trim()) nextErrors.message = "Message is required";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!onSubmit || tab !== "push") return;
    if (!validate()) return;
    onSubmit({
      title: formTitle.trim(),
      message: message.trim(),
      priority,
      scheduleAt:
        sendType === "Scheduled" && scheduleAt
          ? new Date(scheduleAt).toISOString()
          : null,
    });
  };
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
        backdropFilter: "blur(2px)",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          borderRadius: 16,
          padding: 28,
          width: "100%",
          maxWidth: 480,
          boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
        }}
      >
        <h2
          style={{
            margin: "0 0 20px",
            fontSize: 18,
            fontWeight: 800,
            color: "#111827",
          }}
        >
          {title}
        </h2>
        {tab === "system" ? (
          <div
            style={{
              background: "#f5f3ff",
              border: "1px solid #ddd6fe",
              borderRadius: 10,
              padding: "12px 14px",
              fontSize: 13,
              color: "#6d28d9",
            }}
          >
            System notifications are generated automatically by platform events
            and cannot be created manually.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <Field
              label="Title"
              placeholder="Enter title..."
              value={formTitle}
              onChange={setFormTitle}
            />
            {errors.title && (
              <p style={{ color: "#ef4444", fontSize: 12, margin: "-8px 0 0" }}>
                {errors.title}
              </p>
            )}
            <Field
              label="Message"
              placeholder="Enter message..."
              multiline
              value={message}
              onChange={setMessage}
            />
            {errors.message && (
              <p style={{ color: "#ef4444", fontSize: 12, margin: "-8px 0 0" }}>
                {errors.message}
              </p>
            )}
            <div style={{ display: "flex", gap: 12 }}>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as Priority)}
                  style={inputStyle}
                >
                  <option value="HIGH">HIGH</option>
                  <option value="NORMAL">NORMAL</option>
                  <option value="LOW">LOW</option>
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Type</label>
                <select
                  value={sendType}
                  onChange={(e) => setSendType(e.target.value)}
                  style={inputStyle}
                >
                  <option>Instant</option>
                  <option>Scheduled</option>
                </select>
              </div>
            </div>
            {sendType === "Scheduled" && (
              <div>
                <label style={labelStyle}>Schedule At</label>
                <input
                  type="datetime-local"
                  value={scheduleAt}
                  onChange={(e) => setScheduleAt(e.target.value)}
                  style={inputStyle}
                />
              </div>
            )}
          </div>
        )}
        <div
          style={{
            display: "flex",
            gap: 10,
            marginTop: 22,
            justifyContent: "flex-end",
          }}
        >
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              color: "#374151",
              border: "1px solid #e5e7eb",
              borderRadius: 8,
              padding: "10px 20px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          {tab !== "system" && (
            <button
              onClick={tab === "push" ? handleSubmit : onClose}
              disabled={isSubmitting}
              style={{
                background: "linear-gradient(135deg,#0d9488,#14b8a6)",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: "10px 20px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {isSubmitting ? "Sending..." : "Send"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

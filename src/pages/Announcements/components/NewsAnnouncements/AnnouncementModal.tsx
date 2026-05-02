import { useEffect, useState } from "react";
import type { AnnouncementPriority } from "../../data/communicationsApi";

interface AnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: AnnouncementFormData) => void;
  isSubmitting?: boolean;
}

export type AnnouncementFormData = {
  title: string;
  content: string;
  priority: AnnouncementPriority;
  expiresAt?: string | null;
};

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

export function AnnouncementModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false,
}: AnnouncementModalProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [priority, setPriority] = useState<AnnouncementPriority>("NORMAL");
  const [expiresAt, setExpiresAt] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!isOpen) return;
    setTitle("");
    setContent("");
    setPriority("NORMAL");
    setExpiresAt("");
    setErrors({});
  }, [isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const nextErrors: Record<string, string> = {};
    if (!title.trim()) nextErrors.title = "Title is required";
    if (!content.trim()) nextErrors.content = "Message is required";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit({
      title: title.trim(),
      content: content.trim(),
      priority,
      expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null,
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
          + New Announcement
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={labelStyle}>Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter title..."
              style={{
                ...inputStyle,
                borderColor: errors.title ? "#ef4444" : "#e5e7eb",
              }}
            />
            {errors.title && (
              <p style={{ color: "#ef4444", fontSize: 12, margin: "4px 0 0" }}>
                {errors.title}
              </p>
            )}
          </div>
          <div>
            <label style={labelStyle}>Message</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter message..."
              rows={3}
              style={{
                ...inputStyle,
                resize: "vertical",
                borderColor: errors.content ? "#ef4444" : "#e5e7eb",
              }}
            />
            {errors.content && (
              <p style={{ color: "#ef4444", fontSize: 12, margin: "4px 0 0" }}>
                {errors.content}
              </p>
            )}
          </div>
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            <div>
              <label style={labelStyle}>Priority</label>
              <select
                value={priority}
                onChange={(e) =>
                  setPriority(e.target.value as AnnouncementPriority)
                }
                style={inputStyle}
              >
                <option value="LOW">Low</option>
                <option value="NORMAL">Normal</option>
                <option value="HIGH">High</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Expires At (optional)</label>
              <input
                type="datetime-local"
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>
        </div>
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
          <button
            onClick={handleSubmit}
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
            {isSubmitting ? "Publishing..." : "Publish"}
          </button>
        </div>
      </div>
    </div>
  );
}

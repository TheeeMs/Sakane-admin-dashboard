import type { CommunicationCardItemDto } from "../../data/communicationsApi";

interface NotificationDetailsModalProps {
  isOpen: boolean;
  item: CommunicationCardItemDto | null;
  onClose: () => void;
}

const formatDateTime = (value?: string | null) => {
  if (!value) return "";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export function NotificationDetailsModal({
  isOpen,
  item,
  onClose,
}: NotificationDetailsModalProps) {
  if (!isOpen || !item) return null;

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
        zIndex: 60,
        backdropFilter: "blur(2px)",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          borderRadius: 16,
          padding: 24,
          width: "100%",
          maxWidth: 520,
          boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h2
            style={{
              margin: 0,
              fontSize: 18,
              fontWeight: 800,
              color: "#111827",
            }}
          >
            Notification Details
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              fontSize: 18,
              cursor: "pointer",
              color: "#6b7280",
            }}
          >
            ×
          </button>
        </div>

        <div style={{ marginTop: 16, display: "grid", gap: 12 }}>
          <div>
            <p style={{ margin: 0, fontSize: 12, color: "#9ca3af" }}>Title</p>
            <p style={{ margin: "4px 0 0", fontSize: 15, fontWeight: 700 }}>
              {item.title}
            </p>
          </div>
          <div>
            <p style={{ margin: 0, fontSize: 12, color: "#9ca3af" }}>Message</p>
            <p
              style={{
                margin: "4px 0 0",
                fontSize: 14,
                color: "#374151",
                lineHeight: 1.6,
              }}
            >
              {item.message}
            </p>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2,1fr)",
              gap: 10,
            }}
          >
            <div>
              <p style={{ margin: 0, fontSize: 12, color: "#9ca3af" }}>
                Status
              </p>
              <p style={{ margin: "4px 0 0", fontWeight: 600 }}>
                {item.status}
              </p>
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 12, color: "#9ca3af" }}>
                Priority
              </p>
              <p style={{ margin: "4px 0 0", fontWeight: 600 }}>
                {item.priority}
              </p>
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 12, color: "#9ca3af" }}>
                Recipients
              </p>
              <p style={{ margin: "4px 0 0", fontWeight: 600 }}>
                {item.recipientCount}
              </p>
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 12, color: "#9ca3af" }}>Read</p>
              <p style={{ margin: "4px 0 0", fontWeight: 600 }}>
                {item.readCount} ({item.readPercent}%)
              </p>
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 12, color: "#9ca3af" }}>
                Sent At
              </p>
              <p style={{ margin: "4px 0 0", fontWeight: 600 }}>
                {formatDateTime(item.sentAt)}
              </p>
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 12, color: "#9ca3af" }}>
                Sent By
              </p>
              <p style={{ margin: "4px 0 0", fontWeight: 600 }}>
                {item.sentBy || "System"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

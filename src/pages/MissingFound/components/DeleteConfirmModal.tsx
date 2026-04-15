import { CloseIcon } from "./icons";

interface DeleteConfirmModalProps {
  title: string;
  onConfirm: () => void;
  onClose: () => void;
}

export default function DeleteConfirmModal({ title, onConfirm, onClose }: DeleteConfirmModalProps) {
  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 110, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, background: "rgba(0,0,0,0.3)" }}
      onClick={onClose}
    >
      <div
        style={{ background: "#fff", borderRadius: 20, width: "100%", maxWidth: 400, boxShadow: "0 8px 40px rgba(0,0,0,0.12)", overflow: "hidden" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ padding: "20px 24px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontWeight: 700, fontSize: 17, color: "#111827" }}>Delete Report</span>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", display: "flex", padding: 4 }}>
            <CloseIcon />
          </button>
        </div>

        <div style={{ padding: "0 24px 24px", display: "flex", flexDirection: "column", alignItems: "center", gap: 12, textAlign: "center" }}>
          <div style={{ width: 60, height: 60, borderRadius: "50%", background: "#fef2f2", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28 }}>
            🗑️
          </div>
          <p style={{ margin: 0, fontSize: 14, color: "#4b5563", lineHeight: 1.6 }}>
            Are you sure you want to delete <strong style={{ color: "#111827" }}>"{title}"</strong>?<br />
            This action cannot be undone.
          </p>
        </div>

        <div style={{ padding: "0 24px 20px", display: "flex", gap: 10 }}>
          <button
            onClick={onConfirm}
            style={{ flex: 1, background: "#ef4444", color: "#fff", border: "none", borderRadius: 12, padding: "12px", fontWeight: 700, fontSize: 14, cursor: "pointer" }}
          >
            Delete
          </button>
          <button
            onClick={onClose}
            style={{ flex: 1, background: "#fff", color: "#6b7280", border: "1.5px solid #e5e7eb", borderRadius: 12, padding: "12px", fontWeight: 600, fontSize: 14, cursor: "pointer" }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
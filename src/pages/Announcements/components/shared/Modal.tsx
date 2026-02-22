import type { Tab } from "../../types";

const labelStyle: React.CSSProperties = { display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 6 };
const inputStyle: React.CSSProperties = { width: "100%", boxSizing: "border-box", padding: "9px 12px", border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 14, color: "#111827", background: "#fafafa", outline: "none" };

function Field({ label, placeholder, multiline }: { label: string; placeholder: string; multiline?: boolean }) {
  return <div><label style={labelStyle}>{label}</label>{multiline ? <textarea placeholder={placeholder} rows={3} style={{ ...inputStyle, resize: "vertical" }} /> : <input placeholder={placeholder} style={inputStyle} />}</div>;
}

export function Modal({ tab, onClose }: { tab: Tab; onClose: () => void }) {
  const title = tab === "news" ? "+ New Announcement" : tab === "system" ? "+ New Template" : "+ New Notification";
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, backdropFilter: "blur(2px)" }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: "#fff", borderRadius: 16, padding: 28, width: "100%", maxWidth: 480, boxShadow: "0 20px 60px rgba(0,0,0,0.15)" }}>
        <h2 style={{ margin: "0 0 20px", fontSize: 18, fontWeight: 800, color: "#111827" }}>{title}</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <Field label="Title" placeholder="Enter title..." />
          <Field label="Message" placeholder="Enter message..." multiline />
          {tab === "news" && <Field label="Image URL (optional)" placeholder="https://..." />}
          <div style={{ display: "flex", gap: 12 }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>{tab === "news" ? "Status" : "Priority"}</label>
              <select style={inputStyle}>{tab === "news" ? <><option>Live</option><option>Inactive</option></> : <><option>HIGH</option><option>MEDIUM</option><option>LOW</option></>}</select>
            </div>
            {tab !== "news" && <div style={{ flex: 1 }}><label style={labelStyle}>Type</label><select style={inputStyle}><option>Instant</option><option>Scheduled</option></select></div>}
          </div>
        </div>
        <div style={{ display: "flex", gap: 10, marginTop: 22, justifyContent: "flex-end" }}>
          <button onClick={onClose} style={{ background: "transparent", color: "#374151", border: "1px solid #e5e7eb", borderRadius: 8, padding: "10px 20px", fontWeight: 600, cursor: "pointer" }}>Cancel</button>
          <button onClick={onClose} style={{ background: "linear-gradient(135deg,#0d9488,#14b8a6)", color: "#fff", border: "none", borderRadius: 8, padding: "10px 20px", fontWeight: 700, cursor: "pointer" }}>{tab === "news" ? "Publish" : "Send"}</button>
        </div>
      </div>
    </div>
  );
}
// src/pages/Announcements/components/shared/Modal.tsx

import { useState, useRef } from "react";
import type { Tab } from "../../types";
import { useAuth } from "@/hooks/useAuth";
import { createAnnouncement } from "@/lib/announcementService";
import { sendNotification, type NotificationType } from "@/lib/notificationService";
import { createAlert, type AlertType } from "@/lib/alertService";
const labelStyle: React.CSSProperties = {
  display: "block", fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 8,
};
const inputStyle: React.CSSProperties = {
  width: "100%", boxSizing: "border-box", padding: "12px 16px",
  border: "1.5px solid #e5e7eb", borderRadius: 12, fontSize: 14,
  color: "#111827", background: "#fff", outline: "none", transition: "border-color 0.15s",
};
const focus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
  (e.currentTarget.style.borderColor = "#0d9488");
const blur  = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
  (e.currentTarget.style.borderColor = "#e5e7eb");

interface Props { tab: Tab; onClose: () => void; onCreated?: () => void; }

const BG_COLORS = ["#0d9488","#3b82f6","#8b5cf6","#ef4444","#f59e0b","#22c55e","#f97316","#14b8a6","#1e3a5f","#9ca3af"];

// ─── News Form ────────────────────────────────────────────────────────────────
function NewsForm({ onClose, onCreated }: { onClose: () => void; onCreated?: () => void }) {
  const { user } = useAuth();
  type BgType = "color" | "image";
  const [bgType,      setBgType]      = useState<BgType>("image");
  const [bgColor,     setBgColor]     = useState(BG_COLORS[0]);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [imageUrl,    setImageUrl]    = useState<string>("");
  const [title,       setTitle]       = useState("");
  const [content,     setContent]     = useState("");
  const [publishDate, setPublishDate] = useState("");
  const [expiresAt,   setExpiresAt]   = useState("");
  const [publishNow,  setPublishNow]  = useState(true);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Convert file to base64 preview + store as data URL
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setImagePreview(result);
      setImageUrl(result); // store base64 as URL
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImagePreview("");
    setImageUrl("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async () => {
    if (!title.trim())   { setError("Title is required");       return; }
    if (!content.trim()) { setError("Description is required"); return; }
    if (!user?.userId)   { setError("Not authenticated");       return; }

    const expiry = expiresAt
      ? new Date(expiresAt).toISOString()
      : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

    // Encode image URL or bg color in content using prefix
    let finalContent = content.trim();
    if (bgType === "image" && imageUrl) {
      finalContent = `[img:${imageUrl}]${finalContent}`;
    } else if (bgType === "color") {
      finalContent = `[color:${bgColor}]${finalContent}`;
    }

    setLoading(true); setError(null);
    try {
      await createAnnouncement({
        authorId:  user.userId,
        title:     title.trim(),
        content:   finalContent,
        priority: "MEDIUM",
        expiresAt: expiry,
      });
      onCreated?.(); onClose();
    } catch (err) { setError((err as Error).message); }
    finally { setLoading(false); }
  };

  return (
    <>
      {error && (
        <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: "10px 14px", marginBottom: 16, fontSize: 13, color: "#dc2626" }}>
          ⚠️ {error}
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>

        {/* Background Type toggle */}
        <div>
          <label style={labelStyle}>Background Type</label>
          <div style={{ display: "flex", gap: 0, background: "#f9fafb", padding: 4, borderRadius: 10, border: "1px solid #e5e7eb" }}>
            {(["image", "color"] as BgType[]).map((t) => (
              <button key={t} onClick={() => setBgType(t)} style={{ flex: 1, padding: "8px 0", borderRadius: 8, border: "none", background: bgType === t ? "#0d9488" : "transparent", color: bgType === t ? "#fff" : "#6b7280", fontWeight: 600, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, transition: "all 0.15s" }}>
                {t === "image" ? "🖼 Cover Image" : "🎨 Color Background"}
              </button>
            ))}
          </div>
        </div>

        {/* Cover Image - file picker */}
        {bgType === "image" && (
          <div>
            <label style={labelStyle}>Cover Image</label>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display: "none" }} />

            {imagePreview ? (
              <div style={{ position: "relative", height: 160, borderRadius: 12, overflow: "hidden", border: "1.5px solid #e5e7eb" }}>
                <img src={imagePreview} alt="cover" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                <button onClick={handleRemoveImage} style={{ position: "absolute", top: 8, right: 8, width: 28, height: 28, borderRadius: "50%", border: "none", background: "rgba(0,0,0,0.55)", color: "#fff", cursor: "pointer", fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                style={{ border: "2px dashed #d1d5db", borderRadius: 12, padding: "36px 20px", textAlign: "center", cursor: "pointer", background: "#fafafa", transition: "all 0.15s" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#0d9488"; e.currentTarget.style.background = "#f0fdf4"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#d1d5db"; e.currentTarget.style.background = "#fafafa"; }}
              >
                <div style={{ fontSize: 32, marginBottom: 8 }}>🖼</div>
                <p style={{ margin: "0 0 4px", fontSize: 13, color: "#374151", fontWeight: 600 }}>Click to upload or drag and drop</p>
                <p style={{ margin: 0, fontSize: 12, color: "#9ca3af" }}>Recommended: 800×400px • PNG, JPG, WEBP</p>
              </div>
            )}
          </div>
        )}

        {/* Color picker */}
        {bgType === "color" && (
          <div>
            <label style={labelStyle}>Background Color *</label>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
              {BG_COLORS.map((c) => (
                <button key={c} onClick={() => setBgColor(c)} style={{ width: 40, height: 40, borderRadius: 10, background: c, border: bgColor === c ? "3px solid #111827" : "3px solid transparent", cursor: "pointer", transition: "all 0.15s" }} />
              ))}
            </div>
            <div style={{ height: 48, borderRadius: 10, background: bgColor, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#fff", fontWeight: 700, fontSize: 14, textShadow: "0 1px 3px rgba(0,0,0,0.3)" }}>{title || "Preview"}</span>
            </div>
          </div>
        )}

        {/* Title */}
        <div>
          <label style={labelStyle}>Title *</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter announcement title" style={inputStyle} onFocus={focus} onBlur={blur} />
        </div>

        {/* Description */}
        <div>
          <label style={labelStyle}>Description *</label>
          <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Enter announcement description" rows={3} style={{ ...inputStyle, resize: "vertical" }} onFocus={focus} onBlur={blur} />
        </div>

        {/* Dates */}
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Publish Date</label>
            <input type="date" value={publishDate} onChange={(e) => setPublishDate(e.target.value)} style={inputStyle} onFocus={focus} onBlur={blur} />
          </div>
          <div style={{ flex: 1 }}>
            <label style={labelStyle}>Expiry Date (Optional)</label>
            <input type="date" value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} style={inputStyle} onFocus={focus} onBlur={blur} />
          </div>
        </div>

        {/* Publish Immediately */}
        <div
          style={{ background: publishNow ? "#f0fdf4" : "#f9fafb", border: `1.5px solid ${publishNow ? "#bbf7d0" : "#e5e7eb"}`, borderRadius: 12, padding: "14px 16px", display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer", transition: "all 0.15s" }}
          onClick={() => setPublishNow(!publishNow)}
        >
          <div style={{ width: 20, height: 20, borderRadius: 6, background: publishNow ? "#0d9488" : "#fff", border: `2px solid ${publishNow ? "#0d9488" : "#d1d5db"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
            {publishNow && <span style={{ color: "#fff", fontSize: 12, fontWeight: 800 }}>✓</span>}
          </div>
          <div>
            <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: publishNow ? "#065f46" : "#374151" }}>Publish Immediately</p>
            <p style={{ margin: "2px 0 0", fontSize: 12, color: "#6b7280" }}>Make this announcement visible in the resident app</p>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, marginTop: 24, justifyContent: "flex-end" }}>
        <button onClick={onClose} disabled={loading} style={{ padding: "11px 24px", border: "1.5px solid #e5e7eb", borderRadius: 10, background: "#fff", color: "#374151", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>Cancel</button>
        <button onClick={handleSubmit} disabled={loading} style={{ padding: "11px 24px", border: "none", borderRadius: 10, background: loading ? "#99f6e4" : "linear-gradient(135deg,#0d9488,#14b8a6)", color: "#fff", fontWeight: 700, fontSize: 14, cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: 8 }}>
          {loading ? "Creating…" : <><span>+</span> Create Announcement</>}
        </button>
      </div>
    </>
  );
}

// ─── Push Form ────────────────────────────────────────────────────────────────
function PushForm({ onClose, onCreated }: { onClose: () => void; onCreated?: () => void }) {
  const { user } = useAuth();
  const [title,     setTitle]     = useState("");
  const [body,      setBody]      = useState("");
  const [type,      setType]      = useState<NotificationType>("ANNOUNCEMENT");
  const [scheduled, setScheduled] = useState(false);
  const [schedDate, setSchedDate] = useState("");
  const [schedTime, setSchedTime] = useState("");
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState<string | null>(null);

  const handleSend = async () => {
    if (!title.trim()) { setError("Notification title is required"); return; }
    if (!body.trim())  { setError("Message is required");            return; }
    if (!user?.userId) { setError("Not authenticated");              return; }
    setLoading(true); setError(null);
    try {
      await sendNotification({ recipientId: user.userId, title: title.trim(), body: body.trim(), type, referenceId: user.userId, channel: "PUSH" });
      onCreated?.(); onClose();
    } catch (err) { setError((err as Error).message); }
    finally { setLoading(false); }
  };

  return (
    <>
      {error && <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: "10px 14px", marginBottom: 16, fontSize: 13, color: "#dc2626" }}>⚠️ {error}</div>}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div><label style={labelStyle}>Notification Title *</label><input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter notification title" style={inputStyle} onFocus={focus} onBlur={blur} /></div>
        <div><label style={labelStyle}>Message *</label><textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Enter notification message" rows={4} style={{ ...inputStyle, resize: "vertical" }} onFocus={focus} onBlur={blur} /></div>
        <div style={{ display: "flex", gap: 12 }}>
          <div style={{ flex: 1 }}><label style={labelStyle}>Type</label><select value={type} onChange={(e) => setType(e.target.value as NotificationType)} style={inputStyle} onFocus={focus} onBlur={blur}><option value="ANNOUNCEMENT">Announcement</option><option value="MAINTENANCE_UPDATE">Maintenance Update</option><option value="EVENT_REMINDER">Event Reminder</option><option value="GENERAL">General</option></select></div>
          <div style={{ flex: 1 }}><label style={labelStyle}>Recipients</label><select style={inputStyle} onFocus={focus} onBlur={blur}><option>All Residents (342)</option><option>Building A</option><option>Building B</option></select></div>
        </div>
        <div style={{ background: "#f0f9ff", border: "1.5px solid #bae6fd", borderRadius: 12, padding: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: scheduled ? 16 : 0, cursor: "pointer" }} onClick={() => setScheduled(!scheduled)}>
            <div style={{ width: 20, height: 20, borderRadius: 6, background: scheduled ? "#0369a1" : "#fff", border: `2px solid ${scheduled ? "#0369a1" : "#d1d5db"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              {scheduled && <span style={{ color: "#fff", fontSize: 12, fontWeight: 800 }}>✓</span>}
            </div>
            <div>
              <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: "#0369a1" }}>Schedule for Later</p>
              <p style={{ margin: "2px 0 0", fontSize: 12, color: "#0284c7" }}>Choose a specific date and time to send this notification</p>
            </div>
          </div>
          {scheduled && (
            <div style={{ display: "flex", gap: 12 }}>
              <div style={{ flex: 1 }}><label style={{ ...labelStyle, color: "#0369a1" }}>Date</label><input type="date" value={schedDate} onChange={(e) => setSchedDate(e.target.value)} style={{ ...inputStyle, background: "#fff" }} onFocus={focus} onBlur={blur} /></div>
              <div style={{ flex: 1 }}><label style={{ ...labelStyle, color: "#0369a1" }}>Time</label><input type="time" value={schedTime} onChange={(e) => setSchedTime(e.target.value)} style={{ ...inputStyle, background: "#fff" }} onFocus={focus} onBlur={blur} /></div>
            </div>
          )}
        </div>
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 24, justifyContent: "flex-end" }}>
        <button onClick={onClose} disabled={loading} style={{ padding: "11px 24px", border: "1.5px solid #e5e7eb", borderRadius: 10, background: "#fff", color: "#374151", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>Cancel</button>
        <button onClick={() => {}} disabled={loading} style={{ padding: "11px 24px", border: "1.5px solid #e5e7eb", borderRadius: 10, background: "#f9fafb", color: "#374151", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>Save as Draft</button>
        <button onClick={handleSend} disabled={loading} style={{ padding: "11px 24px", border: "none", borderRadius: 10, background: loading ? "#99f6e4" : "linear-gradient(135deg,#0d9488,#14b8a6)", color: "#fff", fontWeight: 700, fontSize: 14, cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: 8 }}>
          {loading ? "Sending…" : <><span>✈</span> Send Now</>}
        </button>
      </div>
    </>
  );
}

// ─── System Template Form ─────────────────────────────────────────────────────
function SystemForm({ onClose, onCreated }: { onClose: () => void; onCreated?: () => void }) {
  const { user } = useAuth();
  const [templateName, setTemplateName] = useState("");
  const [notifType,    setNotifType]    = useState<AlertType>("MISSING");
  const [msgTemplate,  setMsgTemplate]  = useState("");
  const [trigger,      setTrigger]      = useState("");
  const [enableNow,    setEnableNow]    = useState(true);
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState<string | null>(null);

  const previewText = msgTemplate
    .replace(/\{amount\}/g, "2,500 EGP")
    .replace(/\{date\}/g,   "Feb 12, 2026")
    .replace(/\{name\}/g,   "Mohamed")
    .replace(/\{ticketId\}/g, "#12345")
    .replace(/\{eventName\}/g, "Spring Festival")
    .replace(/\{code\}/g,   "ABC123")
    .replace(/\{duration\}/g, "24 hours")
    .replace(/\{guestName\}/g, "Ahmed Ali");

  const handleSubmit = async () => {
    if (!templateName.trim()) { setError("Template name is required"); return; }
    if (!msgTemplate.trim())  { setError("Message template is required"); return; }
    if (!trigger.trim())      { setError("Trigger condition is required"); return; }
    if (!user?.userId)        { setError("Not authenticated"); return; }
    setLoading(true); setError(null);
    try {
      await createAlert({
        reporterId:    user.userId,
        type:          notifType,
        category:      "ITEM",
        title:         templateName.trim(),
        description:   msgTemplate.trim(),
        location:      trigger.trim(),
        eventTime:     new Date().toISOString(),
        photoUrls:     [],
        contactNumber: "",
      });
      onCreated?.(); onClose();
    } catch (err) { setError((err as Error).message); }
    finally { setLoading(false); }
  };

  const variables = ["{amount}", "{date}", "{name}", "{ticketId}", "{eventName}", "{code}", "{duration}", "{guestName}"];

  return (
    <>
      {error && <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: "10px 14px", marginBottom: 16, fontSize: 13, color: "#dc2626" }}>⚠️ {error}</div>}
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div><label style={labelStyle}>Template Name *</label><input value={templateName} onChange={(e) => setTemplateName(e.target.value)} placeholder="e.g. Payment Confirmation" style={inputStyle} onFocus={focus} onBlur={blur} /></div>
        <div>
          <label style={labelStyle}>Notification Type *</label>
          <select value={notifType} onChange={(e) => setNotifType(e.target.value as AlertType)} style={inputStyle} onFocus={focus} onBlur={blur}>
            <option value="MISSING">Payment</option>
            <option value="FOUND">Maintenance</option>
            <option value="SUSPICIOUS_ACTIVITY">Security</option>
            <option value="OTHER">Event</option>
          </select>
        </div>
        <div>
          <label style={labelStyle}>Message Template *</label>
          <textarea value={msgTemplate} onChange={(e) => setMsgTemplate(e.target.value)} placeholder="Enter template message. Use variables like {amount}, {date}, {name}, {ticketId}, etc." rows={4} style={{ ...inputStyle, resize: "vertical" }} onFocus={focus} onBlur={blur} />
          <div style={{ marginTop: 8, display: "flex", flexWrap: "wrap", gap: 6 }}>
            {variables.map((v) => (
              <span key={v} onClick={() => setMsgTemplate((p) => p + v)} style={{ padding: "2px 8px", borderRadius: 6, background: "#f3f4f6", fontSize: 12, color: "#374151", cursor: "pointer", border: "1px solid #e5e7eb", fontFamily: "monospace" }}>{v}</span>
            ))}
          </div>
        </div>
        <div><label style={labelStyle}>Trigger Condition *</label><input value={trigger} onChange={(e) => setTrigger(e.target.value)} placeholder="e.g. 3 days before due date" style={inputStyle} onFocus={focus} onBlur={blur} /></div>
        <div style={{ background: enableNow ? "#faf5ff" : "#f9fafb", border: `1.5px solid ${enableNow ? "#ddd6fe" : "#e5e7eb"}`, borderRadius: 12, padding: "14px 16px", display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer" }} onClick={() => setEnableNow(!enableNow)}>
          <div style={{ width: 20, height: 20, borderRadius: 6, background: enableNow ? "#7c3aed" : "#fff", border: `2px solid ${enableNow ? "#7c3aed" : "#d1d5db"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
            {enableNow && <span style={{ color: "#fff", fontSize: 12, fontWeight: 800 }}>✓</span>}
          </div>
          <div>
            <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: enableNow ? "#6d28d9" : "#374151" }}>Enable Template</p>
            <p style={{ margin: "2px 0 0", fontSize: 12, color: "#6b7280" }}>Start sending notifications automatically when trigger condition is met</p>
          </div>
        </div>
        {msgTemplate && (
          <div style={{ background: "#f0f9ff", border: "1.5px solid #bae6fd", borderRadius: 12, padding: "14px 16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <span>ℹ</span>
              <span style={{ fontWeight: 700, fontSize: 14, color: "#0369a1" }}>Preview</span>
            </div>
            <p style={{ margin: 0, fontSize: 13.5, color: "#374151", lineHeight: 1.6 }}>{previewText}</p>
          </div>
        )}
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 24, justifyContent: "flex-end" }}>
        <button onClick={onClose} disabled={loading} style={{ padding: "11px 24px", border: "1.5px solid #e5e7eb", borderRadius: 10, background: "#fff", color: "#374151", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>Cancel</button>
        <button onClick={handleSubmit} disabled={loading} style={{ padding: "11px 24px", border: "none", borderRadius: 10, background: loading ? "#99f6e4" : "linear-gradient(135deg,#0d9488,#14b8a6)", color: "#fff", fontWeight: 700, fontSize: 14, cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: 8 }}>
          {loading ? "Saving…" : <><span>💾</span> Save Template</>}
        </button>
      </div>
    </>
  );
}

// ─── Main Modal ───────────────────────────────────────────────────────────────
export function Modal({ tab, onClose, onCreated }: Props) {
  const title =
    tab === "push"   ? "Create Push Notification"           :
    tab === "system" ? "Create System Notification Template" : "Create News Announcement";

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, backdropFilter: "blur(2px)" }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: "#fff", borderRadius: 20, padding: "28px 32px", width: "100%", maxWidth: 560, boxShadow: "0 24px 64px rgba(0,0,0,0.18)", maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#111827" }}>{title}</h2>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: "50%", border: "none", background: "#f3f4f6", cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", color: "#6b7280" }}>✕</button>
        </div>
        {tab === "push"   && <PushForm   onClose={onClose} onCreated={onCreated} />}
        {tab === "news"   && <NewsForm   onClose={onClose} onCreated={onCreated} />}
        {tab === "system" && <SystemForm onClose={onClose} onCreated={onCreated} />}
      </div>
    </div>
  );
}
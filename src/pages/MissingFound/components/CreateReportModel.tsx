import { useState } from "react";
import type { Report, ReportCategory, ReportType } from "../types";
import { CloseIcon } from "./icons";

interface CreateReportModalProps {
  onClose: () => void;
  onSubmit: (report: Omit<Report, "id">) => void;
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  border: "1.5px solid #e5e7eb",
  borderRadius: 10,
  padding: "10px 14px",
  fontSize: 14,
  color: "#111827",
  outline: "none",
  boxSizing: "border-box",
  background: "#fff",
  transition: "border-color 0.15s",
};

const labelStyle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 600,
  color: "#374151",
  marginBottom: 6,
  display: "block",
};

export default function CreateReportModal({ onClose, onSubmit }: CreateReportModalProps) {
  const [type, setType]           = useState<ReportType>("Missing");
  const [category, setCategory]   = useState<ReportCategory>("Item");
  const [title, setTitle]         = useState("");
  const [location, setLocation]   = useState("");
  const [contact, setContact]     = useState("");
  const [fullDesc, setFullDesc]   = useState("");
  const [photo, setPhoto]         = useState<string | null>(null);
  const [errors, setErrors]       = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!title.trim())    e.title    = "Title is required";
    if (!location.trim()) e.location = "Location is required";
    if (!contact.trim())  e.contact  = "Contact is required";
    if (!fullDesc.trim()) e.fullDesc = "Description is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit({
      type,
      category,
      title: title.trim(),
      shortDesc: fullDesc.trim().slice(0, 20),
      location: location.trim(),
      reportedBy: "Current User",
      unit: "A-101",
      status: "Open",
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      contact: contact.trim(),
      fullDesc: fullDesc.trim(),
      photo,
    });
    onClose();
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div
      style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, background: "rgba(0,0,0,0.3)" }}
      onClick={onClose}
    >
      <div
        style={{ background: "#fff", borderRadius: 20, width: "100%", maxWidth: 540, boxShadow: "0 8px 40px rgba(0,0,0,0.12)", overflow: "hidden", maxHeight: "90vh", display: "flex", flexDirection: "column" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
          <span style={{ fontWeight: 700, fontSize: 17, color: "#111827" }}>Create Report</span>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", display: "flex", padding: 4 }}>
            <CloseIcon />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: "20px 24px", overflowY: "auto", display: "flex", flexDirection: "column", gap: 16, flex: 1 }}>

          {/* Type + Category row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={labelStyle}>Type <span style={{ color: "#ef4444" }}>*</span></label>
              <div style={{ display: "flex", gap: 8 }}>
                {(["Missing", "Found"] as ReportType[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => setType(t)}
                    style={{
                      flex: 1, padding: "9px 0", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer",
                      border: `1.5px solid ${type === t ? (t === "Missing" ? "#ef4444" : "#10b981") : "#e5e7eb"}`,
                      background: type === t ? (t === "Missing" ? "#fef2f2" : "#ecfdf5") : "#fff",
                      color: type === t ? (t === "Missing" ? "#ef4444" : "#059669") : "#6b7280",
                      transition: "all 0.15s",
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={labelStyle}>Category <span style={{ color: "#ef4444" }}>*</span></label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ReportCategory)}
                style={{ ...inputStyle }}
              >
                <option value="Item">Item</option>
                <option value="Pet">Pet</option>
                <option value="Person">Person</option>
                <option value="Vehicle">Vehicle</option>
              </select>
            </div>
          </div>

          {/* Title */}
          <div>
            <label style={labelStyle}>Title <span style={{ color: "#ef4444" }}>*</span></label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Blue Backpack, Golden Retriever..."
              style={{ ...inputStyle, borderColor: errors.title ? "#ef4444" : "#e5e7eb" }}
            />
            {errors.title && <p style={{ color: "#ef4444", fontSize: 12, margin: "4px 0 0" }}>{errors.title}</p>}
          </div>

          {/* Location */}
          <div>
            <label style={labelStyle}>Location <span style={{ color: "#ef4444" }}>*</span></label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Near swimming pool, Building C..."
              style={{ ...inputStyle, borderColor: errors.location ? "#ef4444" : "#e5e7eb" }}
            />
            {errors.location && <p style={{ color: "#ef4444", fontSize: 12, margin: "4px 0 0" }}>{errors.location}</p>}
          </div>

          {/* Contact */}
          <div>
            <label style={labelStyle}>Contact Number <span style={{ color: "#ef4444" }}>*</span></label>
            <input
              type="text"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="+20 100 000 0000"
              style={{ ...inputStyle, borderColor: errors.contact ? "#ef4444" : "#e5e7eb" }}
            />
            {errors.contact && <p style={{ color: "#ef4444", fontSize: 12, margin: "4px 0 0" }}>{errors.contact}</p>}
          </div>

          {/* Description */}
          <div>
            <label style={labelStyle}>Detailed Description <span style={{ color: "#ef4444" }}>*</span></label>
            <textarea
              value={fullDesc}
              onChange={(e) => setFullDesc(e.target.value)}
              placeholder="Describe the item/person/pet in detail..."
              rows={4}
              style={{ ...inputStyle, resize: "none", lineHeight: 1.6, borderColor: errors.fullDesc ? "#ef4444" : "#e5e7eb" }}
            />
            {errors.fullDesc && <p style={{ color: "#ef4444", fontSize: 12, margin: "4px 0 0" }}>{errors.fullDesc}</p>}
          </div>

          {/* Photo upload */}
          <div>
            <label style={labelStyle}>Photo (optional)</label>
            <label style={{
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              border: "2px dashed #e5e7eb", borderRadius: 12, padding: "20px", cursor: "pointer",
              background: "#fafafa", gap: 6, transition: "border-color 0.15s",
            }}>
              {photo ? (
                <img src={photo} alt="preview" style={{ width: 120, height: 90, objectFit: "cover", borderRadius: 8 }} />
              ) : (
                <>
                  <span style={{ fontSize: 28 }}>📷</span>
                  <span style={{ fontSize: 13, color: "#9ca3af" }}>Click to upload photo</span>
                </>
              )}
              <input type="file" accept="image/*" onChange={handlePhotoChange} style={{ display: "none" }} />
            </label>
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: "14px 24px", borderTop: "1px solid #f3f4f6", display: "flex", gap: 10, flexShrink: 0 }}>
          <button
            onClick={handleSubmit}
            style={{
              flex: 1, background: "#10b981", color: "#fff", border: "none",
              borderRadius: 12, padding: "12px", fontWeight: 700, fontSize: 14,
              cursor: "pointer", boxShadow: "0 2px 8px rgba(16,185,129,0.3)",
            }}
          >
            Create Report
          </button>
          <button
            onClick={onClose}
            style={{
              flex: 1, background: "#fff", color: "#6b7280",
              border: "1.5px solid #e5e7eb", borderRadius: 12,
              padding: "12px", fontWeight: 600, fontSize: 14, cursor: "pointer",
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
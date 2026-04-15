import type { Report } from "../types";
import TypeBadge from "./TypeBadge";
import StatusBadge from "./StatusBadge";
import { CloseIcon, TagIcon, MapPinIcon, PhoneIcon, UserIcon, CalendarIcon } from "./icons";

interface ReportModalProps {
  report: Report | null;
  onClose: () => void;
}

interface DetailItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function DetailItem({ icon, label, value }: DetailItemProps) {
  return (
    <div style={{ background: "#f9fafb", border: "1px solid #f3f4f6", borderRadius: 10, padding: "10px 14px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 5, color: "#9ca3af", fontSize: 12, marginBottom: 4 }}>
        {icon} {label}
      </div>
      <div style={{ fontSize: 13, fontWeight: 600, color: "#111827", whiteSpace: "pre-line" }}>{value}</div>
    </div>
  );
}

const ACTION_BTNS = [
  { label: "✏️  Edit",         bg: "#10b981", color: "#fff",    border: "#10b981" },
  { label: "✓  Mark Resolved", bg: "#fff",    color: "#16a34a", border: "#16a34a" },
  { label: "🔗  Mark Matched", bg: "#fff",    color: "#d97706", border: "#d97706" },
  { label: "🔔  Notify User",  bg: "#fff",    color: "#3b82f6", border: "#3b82f6" },
];

export default function ReportModal({ report, onClose }: ReportModalProps) {
  if (!report) return null;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 16, background: "rgba(0,0,0,0.45)" }}
      onClick={onClose}>
      <div style={{ background: "#fff", borderRadius: 18, width: "100%", maxWidth: 530, boxShadow: "0 20px 60px rgba(0,0,0,0.2)", overflow: "hidden" }}
        onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontWeight: 700, fontSize: 16, color: "#111827" }}>Report Details</span>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#9ca3af", display: "flex", padding: 0 }}>
            <CloseIcon />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: "20px 24px", maxHeight: "65vh", overflowY: "auto", display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", gap: 8 }}>
            <TypeBadge type={report.type} />
            <StatusBadge status={report.status} />
          </div>
          <div>
            <div style={{ fontSize: 19, fontWeight: 700, color: "#111827" }}>{report.title}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 5, color: "#6b7280", fontSize: 13, marginTop: 5 }}>
              <TagIcon /> {report.category}
            </div>
          </div>
          {report.photo && (
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 8 }}>Photos</div>
              <img src={report.photo} alt={report.title} style={{ width: 190, height: 145, objectFit: "cover", borderRadius: 12, border: "1px solid #e5e7eb" }} />
            </div>
          )}
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#374151", marginBottom: 6 }}>Detailed Description</div>
            <div style={{ background: "#f9fafb", border: "1px solid #f3f4f6", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "#4b5563", lineHeight: 1.65 }}>
              {report.fullDesc}
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <DetailItem icon={<MapPinIcon />}   label="Last Seen Location" value={report.location} />
            <DetailItem icon={<PhoneIcon />}    label="Contact Number"    value={report.contact} />
            <DetailItem icon={<UserIcon />}     label="Reported By"       value={`${report.reportedBy}\n${report.unit}`} />
            <DetailItem icon={<CalendarIcon />} label="Report Date"       value={`${report.date} at 08:00 AM`} />
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: "14px 24px", borderTop: "1px solid #f3f4f6", display: "flex", flexWrap: "wrap", gap: 8 }}>
          {ACTION_BTNS.map((btn) => (
            <button key={btn.label} style={{ background: btn.bg, color: btn.color, border: `1px solid ${btn.border}`, borderRadius: 10, padding: "8px 14px", fontWeight: 600, fontSize: 13, cursor: "pointer" }}>
              {btn.label}
            </button>
          ))}
          <button onClick={onClose} style={{ background: "#fff", color: "#6b7280", border: "1px solid #e5e7eb", borderRadius: 10, padding: "8px 14px", fontWeight: 600, fontSize: 13, cursor: "pointer", marginLeft: "auto" }}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
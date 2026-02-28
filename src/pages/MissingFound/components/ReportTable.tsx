import type { Report, ReportStatus, ReportType } from "../types";
import TypeBadge from "./TypeBadge";
import StatusBadge from "./StatusBadge";
import { SearchIcon, TagIcon, EyeIcon, EditIcon, HistoryIcon, TrashIcon } from "./icons";

interface ReportTableProps {
  reports: Report[];
  totalCount: number;
  search: string;
  typeFilter: ReportType | "All";
  statusFilter: ReportStatus | "All";
  onSearchChange: (value: string) => void;
  onTypeFilterChange: (value: ReportType | "All") => void;
  onStatusFilterChange: (value: ReportStatus | "All") => void;
  onClearFilters: () => void;
  onViewReport: (report: Report) => void;
  onEditReport: (report: Report) => void;
  onDeleteReport: (report: Report) => void;
}

const TABLE_HEADERS = ["Type", "Category", "Item Details", "Location", "Reported By", "Status", "Date", "Actions"];

const selectStyle: React.CSSProperties = {
  border: "1px solid #e5e7eb", borderRadius: 8, padding: "8px 10px",
  fontSize: 13, color: "#6b7280", background: "#fff", cursor: "pointer", outline: "none",
};

const actionBtnStyle: React.CSSProperties = {
  width: 28, height: 28, borderRadius: 7, border: "1px solid #e5e7eb",
  background: "#fff", cursor: "pointer", display: "flex",
  alignItems: "center", justifyContent: "center", color: "#6b7280", transition: "all 0.15s",
};

export default function ReportTable({
  reports, totalCount, search, typeFilter, statusFilter,
  onSearchChange, onTypeFilterChange, onStatusFilterChange,
  onClearFilters, onViewReport, onEditReport, onDeleteReport,
}: ReportTableProps) {

  const actionButtons = (r: Report) => [
    { icon: <EyeIcon />,     hoverColor: "#10b981", label: "view",   action: () => onViewReport(r) },
    { icon: <EditIcon />,    hoverColor: "#3b82f6", label: "edit",   action: () => onEditReport(r) },
    { icon: <HistoryIcon />, hoverColor: "#f59e0b", label: "history",action: () => {} },
    { icon: <TrashIcon />,   hoverColor: "#ef4444", label: "delete", action: () => onDeleteReport(r) },
  ];

  return (
    <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e5e7eb", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>

      {/* Filter Bar */}
      <div style={{ padding: "14px 18px", borderBottom: "1px solid #f3f4f6", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ flex: 1, position: "relative" }}>
          <span style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "#9ca3af", display: "flex" }}>
            <SearchIcon />
          </span>
          <input
            type="text" value={search} onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by title, description, or reporter name..."
            style={{ width: "100%", paddingLeft: 32, paddingRight: 12, paddingTop: 8, paddingBottom: 8, border: "1px solid #e5e7eb", borderRadius: 8, fontSize: 13, outline: "none", boxSizing: "border-box", color: "#374151" }}
          />
        </div>
        <select value={typeFilter} onChange={(e) => onTypeFilterChange(e.target.value as ReportType | "All")} style={selectStyle}>
          <option value="All">All Types</option>
          <option value="Missing">Missing</option>
          <option value="Found">Found</option>
        </select>
        <select value={statusFilter} onChange={(e) => onStatusFilterChange(e.target.value as ReportStatus | "All")} style={selectStyle}>
          <option value="All">All Status</option>
          <option value="Open">Open</option>
          <option value="Matched">Matched</option>
          <option value="Resolved">Resolved</option>
          <option value="Closed">Closed</option>
        </select>
        <select style={selectStyle}><option value="All">All Dates</option></select>
      </div>

      {/* Row count */}
      <div style={{ padding: "8px 18px", borderBottom: "1px solid #f9fafb", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 13, color: "#6b7280" }}>
          Showing <strong style={{ color: "#374151" }}>{reports.length}</strong> of <strong style={{ color: "#374151" }}>{totalCount}</strong> reports
        </span>
        <button onClick={onClearFilters} style={{ background: "none", border: "none", color: "#10b981", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>
          Clear Filters
        </button>
      </div>

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: "1px solid #f3f4f6" }}>
              {TABLE_HEADERS.map((h) => (
                <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 11, fontWeight: 600, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {reports.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ padding: "40px 16px", textAlign: "center", color: "#9ca3af", fontSize: 14 }}>
                  No reports found
                </td>
              </tr>
            ) : (
              reports.map((r) => (
                <tr key={r.id} style={{ borderBottom: "1px solid #f9fafb", transition: "background 0.1s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#fafafa")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>

                  <td style={{ padding: "13px 16px" }}><TypeBadge type={r.type} /></td>

                  <td style={{ padding: "13px 16px" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 5, color: "#6b7280" }}>
                      <TagIcon /> {r.category}
                    </span>
                  </td>

                  <td style={{ padding: "13px 16px", maxWidth: 155 }}>
                    <div style={{ fontWeight: 600, color: "#111827", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 148 }}>{r.title}</div>
                    <div style={{ color: "#9ca3af", fontSize: 12, marginTop: 2 }}>{r.shortDesc}</div>
                  </td>

                  <td style={{ padding: "13px 16px", color: "#4b5563", whiteSpace: "nowrap" }}>{r.location}</td>

                  <td style={{ padding: "13px 16px" }}>
                    <div style={{ fontWeight: 500, color: "#374151", whiteSpace: "nowrap" }}>{r.reportedBy}</div>
                    <div style={{ fontSize: 12, color: "#9ca3af" }}>{r.unit}</div>
                  </td>

                  <td style={{ padding: "13px 16px" }}><StatusBadge status={r.status} /></td>

                  <td style={{ padding: "13px 16px", color: "#6b7280", whiteSpace: "nowrap" }}>{r.date}</td>

                  <td style={{ padding: "13px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                      {actionButtons(r).map((btn) => (
                        <button key={btn.label} onClick={btn.action} style={actionBtnStyle}
                          onMouseEnter={(e) => { e.currentTarget.style.color = btn.hoverColor; e.currentTarget.style.borderColor = btn.hoverColor; }}
                          onMouseLeave={(e) => { e.currentTarget.style.color = "#6b7280"; e.currentTarget.style.borderColor = "#e5e7eb"; }}>
                          {btn.icon}
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
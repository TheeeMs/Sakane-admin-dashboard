import { useState } from "react";
import type { Report, ReportStatus, ReportType } from "./types";
import StatCard from "./components/StatCard";
import ReportTable from "./components/ReportTable";
import ReportModal from "./components/ReportModal";
import {
  AlertCircleIcon, PackageIcon, ClockIcon, CheckCircleIcon,
} from "./components/icons";
import CreateReportModal from "./components/CreateReportModel";
import DeleteConfirmModal from "./components/DeleteConfirmModal";

const INITIAL_REPORTS: Report[] = [
  { id: 1, type: "Missing", category: "Item",    title: "Car Keys with Blue Keychain",      shortDesc: "Lost my car",  location: "Near swimming pool area", reportedBy: "Ahmed Hassan",  unit: "A-101", status: "Open",     date: "Feb 11, 2026", contact: "+20 100 123 4567", fullDesc: "Lost my car keys near the swimming pool area. Blue keychain attached with a small tag.", photo: null },
  { id: 2, type: "Found",   category: "Item",    title: "iPhone 14 Pro",                    shortDesc: "Found an...",  location: "Gym entrance",            reportedBy: "Sara Mohamed",  unit: "B-205", status: "Matched",  date: "Feb 10, 2026", contact: "+20 100 234 5678", fullDesc: "Found an iPhone 14 Pro at the gym entrance. Screen intact, phone is locked.", photo: null },
  { id: 3, type: "Missing", category: "Item",    title: "Brown Leather Wallet",             shortDesc: "Brown",        location: "Parking lot B",           reportedBy: "Mohamed Ali",   unit: "C-304", status: "Resolved", date: "Feb 9, 2026",  contact: "+20 100 345 6789", fullDesc: "Brown leather wallet lost in parking lot B. Contains ID and credit cards.", photo: null },
  { id: 4, type: "Found",   category: "Pet",     title: "Small White Cat",                  shortDesc: "Found a",      location: "Building C garden",       reportedBy: "Layla Ibrahim", unit: "A-102", status: "Open",     date: "Feb 12, 2026", contact: "+20 100 456 7890", fullDesc: "Found a small white Persian cat with blue eyes near Building C. Very friendly, wearing a pink collar.", photo: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4d/Cat_November_2010-1a.jpg/320px-Cat_November_2010-1a.jpg" },
  { id: 5, type: "Missing", category: "Person",  title: "Elderly Man - Mr. Hassan Ibrahim", shortDesc: "Elderly",      location: "Community center",        reportedBy: "Omar Khalil",   unit: "B-301", status: "Open",     date: "Feb 11, 2026", contact: "+20 100 567 8901", fullDesc: "Elderly man, 75 years old, missing near community center. Last seen wearing a white thobe.", photo: null },
  { id: 6, type: "Found",   category: "Item",    title: "Gold Bracelet",                    shortDesc: "Found a",      location: "Children's playground",   reportedBy: "Ahmed Hassan",  unit: "A-101", status: "Open",     date: "Feb 12, 2026", contact: "+20 100 678 9012", fullDesc: "Found a gold bracelet at the children's playground near the swings.", photo: null },
  { id: 7, type: "Missing", category: "Vehicle", title: "Red Bicycle",                      shortDesc: "Red",          location: "Parking area A",          reportedBy: "Sara Mohamed",  unit: "B-205", status: "Closed",   date: "Feb 8, 2026",  contact: "+20 100 789 0123", fullDesc: "Red bicycle missing from parking area A. Has a black basket and white stripes.", photo: null },
];

export default function MissingFound() {
  const [reports, setReports]               = useState<Report[]>(INITIAL_REPORTS);
  const [search, setSearch]                 = useState("");
  const [typeFilter, setTypeFilter]         = useState<ReportType | "All">("All");
  const [statusFilter, setStatusFilter]     = useState<ReportStatus | "All">("All");

  // Modals
  const [viewReport, setViewReport]         = useState<Report | null>(null);
  const [editReport, setEditReport]         = useState<Report | null>(null);
  const [deleteReport, setDeleteReport]     = useState<Report | null>(null);
  const [showCreate, setShowCreate]         = useState(false);

  const filtered = reports.filter((r) => {
    const q = search.toLowerCase();
    return (
      (!search || r.title.toLowerCase().includes(q) || r.reportedBy.toLowerCase().includes(q) || r.shortDesc.toLowerCase().includes(q)) &&
      (typeFilter   === "All" || r.type   === typeFilter) &&
      (statusFilter === "All" || r.status === statusFilter)
    );
  });

  const stats = {
    missing:  reports.filter((r) => r.type   === "Missing").length,
    found:    reports.filter((r) => r.type   === "Found").length,
    open:     reports.filter((r) => r.status === "Open").length,
    resolved: reports.filter((r) => r.status === "Resolved").length,
  };

  // CRUD handlers
  const handleCreate = (newReport: Omit<Report, "id">) => {
    const id = Math.max(...reports.map((r) => r.id)) + 1;
    setReports((prev) => [{ ...newReport, id }, ...prev]);
  };

  const handleDelete = () => {
    if (!deleteReport) return;
    setReports((prev) => prev.filter((r) => r.id !== deleteReport.id));
    setDeleteReport(null);
  };

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, sans-serif", background: "#fff", minHeight: "100vh" }}>

      {/* ── Page Header ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "24px 20px 16px" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#111827" }}>Missing &amp; Found</h1>
          <p style={{ margin: "3px 0 0", fontSize: 13, color: "#9ca3af" }}>Help residents recover lost items</p>
        </div>

        <button
          onClick={() => setShowCreate(true)}
          style={{
            display: "flex", alignItems: "center", gap: 6,
            background: "#10b981", color: "#fff", border: "none",
            borderRadius: 12, padding: "10px 18px",
            fontWeight: 700, fontSize: 14, cursor: "pointer",
            boxShadow: "0 2px 10px rgba(16,185,129,0.4)",
            whiteSpace: "nowrap",
          }}
        >
          <span style={{ fontSize: 20, lineHeight: 1, marginBottom: 1 }}>+</span>
          Create Report
        </button>
      </div>

      {/* ── Stat Cards ── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 16, padding: "0 20px 20px" }}>
        <StatCard icon={<AlertCircleIcon color="#ef4444" />} value={stats.missing}  label="Missing Items" bg="#fff5f5" border="#fecaca" valueColor="#ef4444" />
        <StatCard icon={<PackageIcon     color="#10b981" />} value={stats.found}    label="Found Items"   bg="#f0fdf4" border="#bbf7d0" valueColor="#10b981" />
        <StatCard icon={<ClockIcon       color="#3b82f6" />} value={stats.open}     label="Open Cases"    bg="#eff6ff" border="#bfdbfe" valueColor="#3b82f6" />
        <StatCard icon={<CheckCircleIcon color="#8b5cf6" />} value={stats.resolved} label="Resolved"      bg="#f5f3ff" border="#ddd6fe" valueColor="#7c3aed" />
      </div>

      {/* ── Table ── */}
      <div style={{ margin: "0 20px 20px" }}>
        <ReportTable
          reports={filtered}
          totalCount={reports.length}
          search={search}
          typeFilter={typeFilter}
          statusFilter={statusFilter}
          onSearchChange={setSearch}
          onTypeFilterChange={setTypeFilter}
          onStatusFilterChange={setStatusFilter}
          onClearFilters={() => { setSearch(""); setTypeFilter("All"); setStatusFilter("All"); }}
          onViewReport={setViewReport}
          onEditReport={setEditReport}
          onDeleteReport={setDeleteReport}
        />
      </div>

      {/* ── Modals ── */}
      {showCreate && (
        <CreateReportModal
          onClose={() => setShowCreate(false)}
          onSubmit={handleCreate}
        />
      )}

      {viewReport && (
        <ReportModal
          report={viewReport}
          onClose={() => setViewReport(null)}
        />
      )}

      {editReport && (
        <CreateReportModal
          onClose={() => setEditReport(null)}
          onSubmit={(updated) => {
            setReports((prev) =>
              prev.map((r) => r.id === editReport.id ? { ...updated, id: editReport.id } : r)
            );
            setEditReport(null);
          }}
        />
      )}

      {deleteReport && (
        <DeleteConfirmModal
          title={deleteReport.title}
          onConfirm={handleDelete}
          onClose={() => setDeleteReport(null)}
        />
      )}
    </div>
  );
}
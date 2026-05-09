import { useEffect, useState } from "react";
import type { Report, ReportCategory, ReportStatus, ReportType } from "./types";
import { StatCard } from "@/components/shared/StatCard";
import ReportTable from "./components/ReportTable";
import ReportModal from "./components/ReportModal";
import CreateReportModal, {
  type ReportFormData,
} from "./components/CreateReportModel";
import DeleteConfirmModal from "./components/DeleteConfirmModal";
import { CircleAlert, CircleCheckBig, Clock4, Package } from "lucide-react";
import {
  missingFoundApi,
  type MissingFoundReportDetailsDto,
  type MissingFoundReportItemDto,
} from "./data/missingFoundApi";

const formatShortDate = (value?: string | null) => {
  if (!value) return "";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const mapReportType = (raw?: string | null): ReportType => {
  const normalized = (raw || "").toUpperCase();
  return normalized.includes("FOUND") ? "Found" : "Missing";
};

const mapReportStatus = (raw?: string | null): ReportStatus => {
  const normalized = (raw || "").toUpperCase();
  switch (normalized) {
    case "OPEN":
      return "Open";
    case "MATCHED":
      return "Matched";
    case "RESOLVED":
      return "Resolved";
    default:
      return "Closed";
  }
};

const mapReportCategory = (raw?: string | null): ReportCategory => {
  const normalized = (raw || "").toUpperCase();
  if (normalized.includes("PET")) return "Pet";
  if (
    normalized.includes("VEHICLE") ||
    normalized.includes("CAR") ||
    normalized.includes("BIKE") ||
    normalized.includes("SCOOTER")
  )
    return "Vehicle";
  if (
    normalized.includes("PERSON") ||
    normalized.includes("CHILD") ||
    normalized.includes("ADULT")
  )
    return "Person";
  if (normalized.includes("OTHER")) return "Other";
  return "Item";
};

const toApiType = (type: ReportType) =>
  type === "Found" ? "FOUND" : "MISSING";
const toApiCategory = (category: ReportCategory) => {
  switch (category) {
    case "Pet":
      return "PET";
    case "Person":
      return "PERSON";
    case "Vehicle":
      return "VEHICLE";
    case "Other":
      return "OTHER";
    case "Item":
    default:
      return "ITEM";
  }
};

const buildShortDesc = (description?: string | null) => {
  if (!description) return "";
  return description.trim().slice(0, 40);
};

const mapReportItem = (
  raw: MissingFoundReportItemDto,
  index: number,
): Report => {
  const description = raw.detailedDescription || raw.description || "";
  const reportedBy =
    raw.reportedByName || raw.reporterName || "Unknown resident";
  const unit = raw.reportedByUnit || raw.reporterUnitLabel || "";
  const statusLabel = raw.statusLabel || raw.status;
  const typeLabel = raw.reportTypeLabel || raw.reportType;
  const categoryLabel = raw.categoryLabel || raw.category;
  const dateValue = raw.createdAt || raw.eventTime || "";

  return {
    id: raw.id ?? `report-${index}`,
    type: mapReportType(typeLabel),
    category: mapReportCategory(categoryLabel),
    title: raw.title ?? "Untitled Report",
    shortDesc: buildShortDesc(description),
    location: raw.lastSeenLocation || raw.location || "",
    reportedBy,
    unit,
    status: mapReportStatus(statusLabel),
    date: formatShortDate(dateValue),
    contact: raw.contactNumber || "",
    fullDesc: description,
    photo: null,
  };
};

const mapReportDetails = (
  details: MissingFoundReportDetailsDto,
  base?: Report,
): Report => {
  const description =
    details.detailedDescription || details.description || base?.fullDesc || "";
  const reportType = details.reportTypeLabel || details.reportType;
  const category = details.categoryLabel || details.category;
  const status = details.statusLabel || details.status;
  const reportedBy =
    details.reportedByName ||
    details.reporterName ||
    base?.reportedBy ||
    "Unknown resident";
  const unit =
    details.reportedByUnit || details.reporterUnitLabel || base?.unit || "";
  const dateValue = details.reportDate || details.eventTime || base?.date || "";
  const photoUrls =
    details.photoUrls || details.photos || base?.photoUrls || [];

  return {
    id: details.id || base?.id || "",
    type: mapReportType(reportType),
    category: mapReportCategory(category),
    title: details.title || base?.title || "Untitled Report",
    shortDesc: buildShortDesc(description),
    location:
      details.lastSeenLocation || details.location || base?.location || "",
    reportedBy,
    unit,
    status: mapReportStatus(status),
    date: formatShortDate(dateValue),
    contact: details.contactNumber || base?.contact || "",
    fullDesc: description,
    photo: photoUrls[0] ?? base?.photo ?? null,
    photoUrls,
  };
};

export default function MissingFound() {
  const [reports, setReports] = useState<Report[]>([]);
  const [stats, setStats] = useState({
    missing: 0,
    found: 0,
    open: 0,
    resolved: 0,
  });
  const [categoryOptions, setCategoryOptions] = useState<string[]>([]);
  const [residentOptions, setResidentOptions] = useState<
    Array<{ value: string; label: string }>
  >([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [viewReport, setViewReport] = useState<Report | null>(null);
  const [editReport, setEditReport] = useState<Report | null>(null);
  const [deleteReport, setDeleteReport] = useState<Report | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  const resolvedCategoryOptions = categoryOptions.length
    ? Array.from(new Set(categoryOptions.map(mapReportCategory)))
    : ["Item", "Pet", "Person", "Vehicle", "Other"];

  const fetchReports = async () => {
    try {
      const res = await missingFoundApi.listReports({ page: 0, size: 100 });
      const items = res.data.reports || [];
      setReports(items.map(mapReportItem));
      setStats({
        missing: res.data.missingCount ?? 0,
        found: res.data.foundCount ?? 0,
        open: res.data.openCount ?? 0,
        resolved: res.data.resolvedCount ?? 0,
      });
    } catch (err) {
      console.error("Failed to fetch missing & found reports", err);
      setReports([]);
      setStats({ missing: 0, found: 0, open: 0, resolved: 0 });
    }
  };

  const fetchOptions = async () => {
    try {
      const [categoriesRes, residentsRes] = await Promise.all([
        missingFoundApi.listCategories(),
        missingFoundApi.listResidentOptions({ page: 0, size: 100 }),
      ]);
      setCategoryOptions(categoriesRes.data || []);
      const residentItems = residentsRes.data.residents || [];
      setResidentOptions(
        residentItems.map((resident) => ({
          value: resident.residentId,
          label: resident.displayLabel || resident.fullName || "Resident",
        })),
      );
    } catch (err) {
      console.error("Failed to load missing & found options", err);
      setCategoryOptions([]);
      setResidentOptions([]);
    }
  };

  const handleCreate = async (data: ReportFormData) => {
    if (!data.residentId) return;
    try {
      setIsSubmitting(true);
      await missingFoundApi.createReport({
        reporterId: data.residentId,
        type: toApiType(data.type),
        category: toApiCategory(data.category),
        title: data.title,
        description: data.fullDesc,
        location: data.location,
        contactNumber: data.contact,
        photoUrls: data.photo ? [data.photo] : undefined,
      });
      await fetchReports();
    } catch (err) {
      console.error("Failed to create missing & found report", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (data: ReportFormData) => {
    if (!editReport) return;
    try {
      setIsSubmitting(true);
      await missingFoundApi.updateReport(editReport.id, {
        type: toApiType(data.type),
        category: toApiCategory(data.category),
        title: data.title,
        description: data.fullDesc,
        location: data.location,
        contactNumber: data.contact,
        photoUrls: data.photo ? [data.photo] : undefined,
      });
      await fetchReports();
    } catch (err) {
      console.error("Failed to update missing & found report", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteReport) return;
    try {
      setIsActionLoading(true);
      await missingFoundApi.deleteReport(deleteReport.id);
      await fetchReports();
    } catch (err) {
      console.error("Failed to delete missing & found report", err);
    } finally {
      setIsActionLoading(false);
      setDeleteReport(null);
    }
  };

  const openReportDetails = async (report: Report) => {
    setViewReport(report);
    try {
      setIsActionLoading(true);
      const res = await missingFoundApi.getReportDetails(report.id);
      setViewReport((prev) => mapReportDetails(res.data, prev || report));
    } catch (err) {
      console.error("Failed to load missing & found report details", err);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleNotifyUser = async (report: Report) => {
    try {
      setIsActionLoading(true);
      await missingFoundApi.notifyUser(report.id);
    } catch (err) {
      console.error("Failed to notify resident", err);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleMarkMatched = async (report: Report) => {
    try {
      setIsActionLoading(true);
      await missingFoundApi.markMatched(report.id);
      await fetchReports();
      setViewReport((prev) => (prev ? { ...prev, status: "Matched" } : prev));
    } catch (err) {
      console.error("Failed to mark report as matched", err);
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleMarkResolved = async (report: Report) => {
    try {
      setIsActionLoading(true);
      await missingFoundApi.markResolved(report.id);
      await fetchReports();
      setViewReport((prev) => (prev ? { ...prev, status: "Resolved" } : prev));
    } catch (err) {
      console.error("Failed to mark report as resolved", err);
    } finally {
      setIsActionLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
    fetchOptions();
  }, []);

  return (
    <div
      style={{
        fontFamily: "'Inter', -apple-system, sans-serif",
        background: "#fff",
        minHeight: "100vh",
      }}
    >
      {/* ── Page Header ── */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          padding: "24px 20px 16px",
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: 20,
              fontWeight: 700,
              color: "#111827",
            }}
          >
            Missing &amp; Found
          </h1>
          <p style={{ margin: "3px 0 0", fontSize: 13, color: "#9ca3af" }}>
            Help residents recover lost items
          </p>
        </div>

        <button
          onClick={() => setShowCreate(true)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: "#10b981",
            color: "#fff",
            border: "none",
            borderRadius: 12,
            padding: "10px 18px",
            fontWeight: 700,
            fontSize: 14,
            cursor: "pointer",
            boxShadow: "0 2px 10px rgba(16,185,129,0.4)",
            whiteSpace: "nowrap",
          }}
        >
          <span style={{ fontSize: 20, lineHeight: 1, marginBottom: 1 }}>
            +
          </span>
          Create Report
        </button>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-4 gap-4 p-5">
        <StatCard
          icon={CircleAlert}
          value={stats.missing}
          label="Missing Items"
          iconBg="bg-red-100"
          borderColor="border-red-200"
          iconColor="text-red-500"
          valueColor="text-red-500"
          gradient="bg-gradient-to-br from-red-50 to-transparent"
        />
        <StatCard
          icon={Package}
          value={stats.found}
          label="Found Items"
          iconBg="bg-green-100"
          borderColor="border-green-200"
          iconColor="text-green-500"
          valueColor="text-green-500"
          gradient="bg-gradient-to-br from-green-50 to-transparent"
        />
        <StatCard
          icon={Clock4}
          value={stats.open}
          label="Open Cases"
          iconBg="bg-blue-100"
          borderColor="border-blue-200"
          iconColor="text-blue-500"
          valueColor="text-blue-500"
          gradient="bg-gradient-to-br from-blue-50 to-transparent"
        />
        <StatCard
          icon={CircleCheckBig}
          value={stats.resolved}
          label="Resolved"
          iconBg="bg-purple-100"
          borderColor="border-purple-200"
          iconColor="text-purple-500"
          valueColor="text-purple-500"
          gradient="bg-gradient-to-br from-purple-50 to-transparent"
        />
      </div>

      {/* ── Table ── */}
      <div style={{ margin: "0 20px 20px" }}>
        <ReportTable
          reports={reports}
          onViewReport={openReportDetails}
          onEditReport={setEditReport}
          onDeleteReport={setDeleteReport}
        />
      </div>

      {/* ── Modals ── */}
      {showCreate && (
        <CreateReportModal
          onClose={() => setShowCreate(false)}
          onSubmit={handleCreate}
          categoryOptions={resolvedCategoryOptions}
          residentOptions={residentOptions}
          isSubmitting={isSubmitting}
        />
      )}

      {viewReport && (
        <ReportModal
          report={viewReport}
          onClose={() => setViewReport(null)}
          onEdit={(report) => {
            setViewReport(null);
            setEditReport(report);
          }}
          onMarkResolved={handleMarkResolved}
          onMarkMatched={handleMarkMatched}
          onNotifyUser={handleNotifyUser}
          isActionLoading={isActionLoading}
        />
      )}

      {editReport && (
        <CreateReportModal
          onClose={() => setEditReport(null)}
          mode="edit"
          initialValues={{
            type: editReport.type,
            category: editReport.category,
            title: editReport.title,
            location: editReport.location,
            contact: editReport.contact,
            fullDesc: editReport.fullDesc,
            photo: editReport.photo,
          }}
          onSubmit={handleUpdate}
          categoryOptions={resolvedCategoryOptions}
          isSubmitting={isSubmitting}
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

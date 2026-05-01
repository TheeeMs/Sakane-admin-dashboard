import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import type { Report, ReportStatus, ReportType, SummaryResponse } from "./types";
import {
  mapApiReport,
  toCreatePayload,
  toUpdatePayload,
  TYPE_TO_API,
  STATUS_TO_API,
} from "./types";
import {
  fetchReports,
  fetchSummary,
  createReport,
  updateReport,
  deleteReport,
  markReportResolved,
  markReportMatched,
  notifyUser,
} from "./api/missingFoundApi";
import { StatCard } from "@/components/shared/StatCard";
import ReportTable from "./components/ReportTable";
import ReportModal from "./components/ReportModal";
import CreateReportModal from "./components/CreateReportModel";
import DeleteConfirmModal from "./components/DeleteConfirmModal";
import { CircleAlert, CircleCheckBig, Clock4, Package } from "lucide-react";

/** Decode JWT payload (no signature verification) */
function decodeJWT(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = parts[1];
    const padded = payload + "=".repeat((4 - (payload.length % 4)) % 4);
    const decoded = atob(padded.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

/** يقرأ الـ user UUID من أي مفتاح متاح، وآخر حاجة من الـ JWT token نفسه */
function getStoredUserId(): string | undefined {
  // 1) localStorage keys
  const candidates = ["userId", "sakane_user_id"];
  for (const key of candidates) {
    const v = localStorage.getItem(key);
    if (v) return v;
  }
  // 2) الـ user object
  try {
    const raw =
      localStorage.getItem("user") ?? localStorage.getItem("sakane_user");
    if (raw) {
      const parsed = JSON.parse(raw);
      const id = parsed?.id ?? parsed?.userId ?? parsed?.sub;
      if (id) return String(id);
    }
  } catch {
    /* ignore */
  }
  // 3) Decode JWT — الـ sub claim عادة بيكون فيه الـ userId
  const token =
    localStorage.getItem("token") ??
    localStorage.getItem("accessToken") ??
    localStorage.getItem("sakane_access_token") ??
    localStorage.getItem("sakane_token");
  if (token) {
    const decoded = decodeJWT(token);
    if (decoded) {
      const id =
        (decoded.sub as string | undefined) ??
        (decoded.userId as string | undefined) ??
        (decoded.user_id as string | undefined) ??
        (decoded.id as string | undefined);
      if (id) return String(id);
    }
  }
  return undefined;
}

export default function MissingFound() {
  const reporterId = getStoredUserId();

  /* ── Server data ── */
  const [reports, setReports] = useState<Report[]>([]);
  const [summary, setSummary] = useState<SummaryResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  /* ── Filters ── */
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<ReportType | "All">("All");
  const [statusFilter, setStatusFilter] = useState<ReportStatus | "All">("All");

  /* ── Modals ── */
  const [viewReport, setViewReport] = useState<Report | null>(null);
  const [editReport, setEditReport] = useState<Report | null>(null);
  const [deleteReportItem, setDeleteReportItem] = useState<Report | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  /* ──────────────────────────────────────────────
   *  Data fetching
   * ──────────────────────────────────────────── */
  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        search: search.trim() || undefined,
        type: typeFilter === "All" ? undefined : TYPE_TO_API[typeFilter],
        status:
          statusFilter === "All" ? undefined : STATUS_TO_API[statusFilter],
        page: 0,
        size: 100,
      };

      const [listRes, summaryRes] = await Promise.all([
        fetchReports(params),
        fetchSummary({
          search: params.search,
          type: params.type,
          status: params.status,
        }).catch(() => null), // الـ summary اختياري — لو فشل، نحسبها محلياً
      ]);

      const list = listRes.reports ?? listRes.content ?? [];
      setReports(list.map(mapApiReport));
      if (summaryRes) setSummary(summaryRes);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to load reports";
      setError(msg);
      setReports([]);
    } finally {
      setLoading(false);
    }
  }, [search, typeFilter, statusFilter]);

  // Debounced reload عند تغيّر الفلاتر/البحث
  useEffect(() => {
    const t = setTimeout(loadData, 300);
    return () => clearTimeout(t);
  }, [loadData]);

  /* ──────────────────────────────────────────────
   *  Stats: prefer server summary, fallback to local
   * ──────────────────────────────────────────── */
  const stats = useMemo(() => {
    if (summary) {
      return {
        missing: summary.missingCount ?? 0,
        found: summary.foundCount ?? 0,
        open: summary.openCount ?? 0,
        resolved: summary.resolvedCount ?? 0,
      };
    }
    return {
      missing: reports.filter((r) => r.type === "Missing").length,
      found: reports.filter((r) => r.type === "Found").length,
      open: reports.filter((r) => r.status === "Open").length,
      resolved: reports.filter((r) => r.status === "Resolved").length,
    };
  }, [summary, reports]);

  /* ──────────────────────────────────────────────
   *  CRUD handlers
   * ──────────────────────────────────────────── */
  const handleCreate = async (
    newReport: Omit<Report, "id">,
    extra: { residentId: string }
  ) => {
    try {
      setSubmitting(true);
      await createReport(
        toCreatePayload(newReport, {
          reporterId,
          residentId: extra.residentId,
        })
      );
      toast.success("Report created successfully");
      setShowCreate(false);
      await loadData();
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Failed to create report";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (
    updated: Omit<Report, "id">
    /* extra param ignored on update */
  ) => {
    if (!editReport) return;
    try {
      setSubmitting(true);
      await updateReport(editReport.id, toUpdatePayload(updated));
      toast.success("Report updated successfully");
      setEditReport(null);
      await loadData();
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Failed to update report";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteReportItem) return;
    try {
      setSubmitting(true);
      await deleteReport(deleteReportItem.id);
      toast.success("Report deleted");
      setDeleteReportItem(null);
      await loadData();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to delete report";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleMarkResolved = async (r: Report) => {
    try {
      await markReportResolved(r.id);
      toast.success("Report marked as resolved");
      await loadData();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update");
    }
  };

  const handleMarkMatched = async (r: Report) => {
    try {
      await markReportMatched(r.id);
      toast.success("Report marked as matched");
      await loadData();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update");
    }
  };

  const handleNotifyUser = async (r: Report) => {
    try {
      await notifyUser(r.id, {
        title: `Update on your report: ${r.title}`,
        message: `Your report "${r.title}" has been reviewed by an administrator.`,
        channel: "PUSH",
      });
      toast.success("User notified successfully");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to notify user");
    }
  };

  /* ──────────────────────────────────────────────
   *  Local search filter (server is the source of truth,
   *  this just filters client-side for instant feedback
   *  بدون انتظار الـ API)
   * ──────────────────────────────────────────── */
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return reports.filter((r) => {
      return (
        (!search ||
          r.title.toLowerCase().includes(q) ||
          r.reportedBy.toLowerCase().includes(q) ||
          r.shortDesc.toLowerCase().includes(q)) &&
        (typeFilter === "All" || r.type === typeFilter) &&
        (statusFilter === "All" || r.status === statusFilter)
      );
    });
  }, [reports, search, typeFilter, statusFilter]);

  /* ──────────────────────────────────────────────
   *  Render
   * ──────────────────────────────────────────── */
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
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "#111827" }}>
            Missing &amp; Found
          </h1>
          <p style={{ margin: "3px 0 0", fontSize: 13, color: "#9ca3af" }}>
            Help residents recover lost items
          </p>
        </div>

        <button
          onClick={() => setShowCreate(true)}
          disabled={loading}
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
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.7 : 1,
            boxShadow: "0 2px 10px rgba(16,185,129,0.4)",
            whiteSpace: "nowrap",
          }}
        >
          <span style={{ fontSize: 20, lineHeight: 1, marginBottom: 1 }}>+</span>
          Create Report
        </button>
      </div>

      {/* ── Error banner ── */}
      {error && !loading && (
        <div
          style={{
            margin: "0 20px 16px",
            padding: "12px 16px",
            background: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: 10,
            color: "#b91c1c",
            fontSize: 13,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <span>⚠️ {error}</span>
          <button
            onClick={loadData}
            style={{
              background: "#fff",
              border: "1px solid #fecaca",
              borderRadius: 8,
              padding: "6px 14px",
              fontSize: 12,
              fontWeight: 600,
              color: "#b91c1c",
              cursor: "pointer",
            }}
          >
            Retry
          </button>
        </div>
      )}

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-4 gap-4 p-5">
        <StatCard
          icon={CircleAlert}
          value={loading ? "…" : stats.missing}
          label="Missing Items"
          iconBg="bg-red-100"
          borderColor="border-red-200"
          iconColor="text-red-500"
          valueColor="text-red-500"
          gradient="bg-gradient-to-br from-red-50 to-transparent"
        />
        <StatCard
          icon={Package}
          value={loading ? "…" : stats.found}
          label="Found Items"
          iconBg="bg-green-100"
          borderColor="border-green-200"
          iconColor="text-green-500"
          valueColor="text-green-500"
          gradient="bg-gradient-to-br from-green-50 to-transparent"
        />
        <StatCard
          icon={Clock4}
          value={loading ? "…" : stats.open}
          label="Open Cases"
          iconBg="bg-blue-100"
          borderColor="border-blue-200"
          iconColor="text-blue-500"
          valueColor="text-blue-500"
          gradient="bg-gradient-to-br from-blue-50 to-transparent"
        />
        <StatCard
          icon={CircleCheckBig}
          value={loading ? "…" : stats.resolved}
          label="Resolved"
          iconBg="bg-purple-100"
          borderColor="border-purple-200"
          iconColor="text-purple-500"
          valueColor="text-purple-500"
          gradient="bg-gradient-to-br from-purple-50 to-transparent"
        />
      </div>

      {/* ── Loading / Empty / Table ── */}
      <div style={{ margin: "0 20px 20px" }}>
        {loading ? (
          <div
            style={{
              padding: "60px 20px",
              textAlign: "center",
              color: "#6b7280",
              background: "#f9fafb",
              borderRadius: 12,
              border: "1px solid #f3f4f6",
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                margin: "0 auto 14px",
                border: "3px solid #e5e7eb",
                borderTopColor: "#10b981",
                borderRadius: "50%",
                animation: "spin 0.9s linear infinite",
              }}
            />
            <div style={{ fontSize: 14, fontWeight: 500 }}>Loading reports…</div>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        ) : !error && reports.length === 0 ? (
          <div
            style={{
              padding: "60px 20px",
              textAlign: "center",
              color: "#6b7280",
              background: "#f9fafb",
              borderRadius: 12,
              border: "1px dashed #e5e7eb",
            }}
          >
            <div style={{ fontSize: 36, marginBottom: 8 }}>📭</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: "#374151" }}>
              No reports yet
            </div>
            <div style={{ fontSize: 13, marginTop: 4 }}>
              Click "Create Report" to add the first one.
            </div>
          </div>
        ) : !error ? (
          <ReportTable
            reports={filtered}
            totalCount={reports.length}
            search={search}
            typeFilter={typeFilter}
            statusFilter={statusFilter}
            onSearchChange={setSearch}
            onTypeFilterChange={setTypeFilter}
            onStatusFilterChange={setStatusFilter}
            onClearFilters={() => {
              setSearch("");
              setTypeFilter("All");
              setStatusFilter("All");
            }}
            onViewReport={setViewReport}
            onEditReport={setEditReport}
            onDeleteReport={setDeleteReportItem}
          />
        ) : null}
      </div>

      {/* ── Modals ── */}
      {showCreate && (
        <CreateReportModal
          submitting={submitting}
          hasReporterId={Boolean(reporterId)}
          onClose={() => !submitting && setShowCreate(false)}
          onSubmit={handleCreate}
        />
      )}

      {viewReport && (
        <ReportModal
          report={viewReport}
          onClose={() => setViewReport(null)}
          onEdit={(r) => {
            setViewReport(null);
            setEditReport(r);
          }}
          onDelete={(r) => {
            setViewReport(null);
            setDeleteReportItem(r);
          }}
          onMarkResolved={handleMarkResolved}
          onMarkMatched={handleMarkMatched}
          onNotifyUser={handleNotifyUser}
        />
      )}

      {editReport && (
        <CreateReportModal
          initial={editReport}
          submitting={submitting}
          hasReporterId={Boolean(reporterId)}
          onClose={() => !submitting && setEditReport(null)}
          onSubmit={handleUpdate}
        />
      )}

      {deleteReportItem && (
        <DeleteConfirmModal
          title={deleteReportItem.title}
          submitting={submitting}
          onConfirm={handleDelete}
          onClose={() => !submitting && setDeleteReportItem(null)}
        />
      )}
    </div>
  );
}

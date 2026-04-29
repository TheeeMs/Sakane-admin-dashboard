import { useEffect, useState, useCallback } from "react";
import { ChevronDown, Home, Building2, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import axios from "axios";
import MaintenanceDetailPanel from "./MaintenanceDetailPanel";
import {
  maintenanceApi,
  type MaintenanceRequestItemDto,
  type MaintenanceTab,
  type MaintenancePriority,
  type MaintenanceStatus,
} from "./data/maintenanceApi";
import type { MaintenanceRequest } from "./MaintenanceDetailPanel";
import { useAuthStore } from "@/features/auth";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const getApiError = (err: unknown): string => {
  if (axios.isAxiosError(err)) {
    const d = err.response?.data as { message?: string; detail?: string } | undefined;
    return d?.message ?? d?.detail ?? err.message;
  }
  return err instanceof Error ? err.message : "Something went wrong";
};

// Map backend priority → display priority
const mapPriority = (p: MaintenancePriority): "High" | "Medium" | "Low" => {
  if (p === "URGENT" || p === "HIGH") return "High";
  if (p === "MEDIUM") return "Medium";
  return "Low";
};

// Map backend status → display status
const mapStatus = (s: MaintenanceStatus): "Unassigned" | "Assigned" | "Completed" | "In Progress" => {
  if (s === "SUBMITTED") return "Unassigned";
  if (s === "ASSIGNED") return "Assigned";
  if (s === "IN_PROGRESS") return "In Progress";
  if (s === "RESOLVED") return "Completed";
  return "Unassigned";
};

// Map frontend tab → backend tab
const TAB_MAP: Record<string, MaintenanceTab> = {
  All: "ALL",
  Pending: "PENDING",
  "In Progress": "IN_PROGRESS",
  Completed: "COMPLETED",
};

const toDisplayRequest = (dto: MaintenanceRequestItemDto): MaintenanceRequest => ({
  id: dto.id,
  type: dto.isPublic ? "Public" : "Private",
  requestId: dto.requestId,
  priority: mapPriority(dto.priority),
  issue: dto.title,
  location: dto.locationLabel,
  dateTime: new Date(dto.createdAt).toLocaleString("en-US", {
    month: "short", day: "numeric", hour: "numeric", minute: "2-digit",
  }),
  status: mapStatus(dto.status),
  residentName: dto.residentName,
  residentUnit: dto.residentUnit,
});

// ─── Badge configs ────────────────────────────────────────────────────────────
const PRIORITY_CFG = {
  High:   { dot: "bg-[#fb2c36]", bg: "bg-[#ffe2e2]", text: "text-[#c10007]" },
  Medium: { dot: "bg-[#f0b100]", bg: "bg-[#fef9c2]", text: "text-[#a65f00]" },
  Low:    { dot: "bg-[#2b7fff]", bg: "bg-[#dbeafe]", text: "text-[#1447e6]" },
};
const STATUS_CFG = {
  Unassigned:  { dot: "bg-[#99a1af]", bg: "bg-[#f3f4f6]", text: "text-[#636e72]" },
  Assigned:    { dot: "bg-[#00a996]", bg: "bg-[#e0f2f1]", text: "text-[#00a996]" },
  "In Progress":{ dot: "bg-[#f0b100]", bg: "bg-[#fef9c2]", text: "text-[#a65f00]" },
  Completed:   { dot: "bg-[#00c950]", bg: "bg-[#dcfce7]", text: "text-[#008236]" },
};

// ─── Sub-components ───────────────────────────────────────────────────────────
const TypeBadge = ({ type }: { type: "Private" | "Public" }) => (
  <span className={cn(
    "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium",
    type === "Private" ? "bg-[#f3e8ff] text-[#8200db]" : "bg-[#e0f2f1] text-[#00a996]"
  )}>
    {type === "Private"
      ? <Home className="w-3 h-3 flex-shrink-0" />
      : <Building2 className="w-3 h-3 flex-shrink-0" />}
    {type}
  </span>
);

const PriorityBadge = ({ priority }: { priority: "High"|"Medium"|"Low" }) => {
  const cfg = PRIORITY_CFG[priority];
  return (
    <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium", cfg.bg, cfg.text)}>
      <span className={cn("w-2 h-2 rounded-full flex-shrink-0", cfg.dot)} />
      {priority}
    </span>
  );
};

const StatusBadge = ({ status }: { status: keyof typeof STATUS_CFG }) => {
  const cfg = STATUS_CFG[status];
  return (
    <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium", cfg.bg, cfg.text)}>
      <span className={cn("w-2 h-2 rounded-full flex-shrink-0", cfg.dot)} />
      {status}
    </span>
  );
};

function FilterSelect<T extends string>({
  value, onChange, options,
}: { value: T; onChange: (v: T) => void; options: { label: string; value: T }[] }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="appearance-none pl-3 pr-8 h-[36px] bg-white border border-[#e5e7eb] rounded-xl text-xs font-medium text-[#2d3436] outline-none focus:border-[#00a996] cursor-pointer hover:bg-gray-50 transition-colors"
      >
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
    </div>
  );
}

// ─── Status Tabs ──────────────────────────────────────────────────────────────
const STATUS_TABS = ["All", "Pending", "In Progress", "Completed"] as const;
type StatusTab = (typeof STATUS_TABS)[number];

// ─── Main Page ────────────────────────────────────────────────────────────────
const MaintenancePage = () => {
  const { user } = useAuthStore();
  const actorId = user?.id ?? "";

  // Filters
  const [activeTab, setActiveTab] = useState<StatusTab>("All");
  const [typeFilter, setTypeFilter] = useState<"ALL" | "PRIVATE" | "PUBLIC">("ALL");
  const [sortBy, setSortBy] = useState<"NEWEST" | "OLDEST">("NEWEST");

  // Data
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  // Detail panel
  const [selectedRequest, setSelectedRequest] = useState<MaintenanceRequest | null>(null);

  // ─── Fetch ────────────────────────────────────────────────────────────────
  const loadRequests = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await maintenanceApi.listRequests({
        tab: TAB_MAP[activeTab],
        type: typeFilter === "ALL" ? undefined : typeFilter,
        sortBy,
        page,
        size: 20,
      });
      const data = res.data;
      const list = Array.isArray(data?.requests) ? data.requests : [];
      setRequests(list.map(toDisplayRequest));
      setTotalPages(data?.totalPages ?? 1);
      setTotalElements(data?.totalElements ?? list.length);
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, typeFilter, sortBy, page]);

  useEffect(() => { void loadRequests(); }, [loadRequests]);

  // Reset page when filters change
  useEffect(() => { setPage(0); }, [activeTab, typeFilter, sortBy]);

  // Mark as viewed when opening detail panel
  const handleRowClick = async (req: MaintenanceRequest) => {
    if (req.id === selectedRequest?.id) {
      setSelectedRequest(null);
      return;
    }
    setSelectedRequest(req);
    try {
      await maintenanceApi.markViewed(req.id, actorId);
    } catch {
      // non-critical – ignore
    }
  };

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="bg-white rounded-2xl shadow-[0px_4px_10px_rgba(0,0,0,0.05)] p-6">
        <h1 className="text-2xl font-semibold text-[#2d3436] mb-6">
          Maintenance Command Center
        </h1>
        <div className="inline-flex items-center bg-[#f3f4f6] rounded-xl p-1 gap-0.5">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-4 py-2 rounded-[10px] text-sm font-medium transition-all duration-150",
                activeTab === tab
                  ? "bg-white text-[#2d3436] shadow-[0px_1px_3px_rgba(0,0,0,0.1)]"
                  : "text-[#636e72] hover:text-[#2d3436]"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center justify-between bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
          <span>{error}</span>
          <button onClick={() => void loadRequests()} className="flex items-center gap-1 text-red-600 hover:text-red-800 font-medium">
            <RefreshCw className="w-3.5 h-3.5" /> Retry
          </button>
        </div>
      )}

      {/* Table + Panel */}
      <div className="flex gap-5 items-start">
        <div className={cn(
          "bg-white rounded-2xl shadow-[0px_4px_20px_rgba(0,0,0,0.05)] overflow-hidden transition-all duration-300",
          selectedRequest ? "flex-1 min-w-0" : "w-full"
        )}>
          {/* Filters */}
          <div className="flex items-center gap-3 px-6 py-4 border-b border-[#f3f4f6]">
            <FilterSelect
              value={typeFilter}
              onChange={setTypeFilter}
              options={[
                { label: "All Types", value: "ALL" },
                { label: "Private", value: "PRIVATE" },
                { label: "Public", value: "PUBLIC" },
              ]}
            />
            <FilterSelect
              value={sortBy}
              onChange={setSortBy}
              options={[
                { label: "Newest First", value: "NEWEST" },
                { label: "Oldest First", value: "OLDEST" },
              ]}
            />
            <p className="ml-auto text-xs text-gray-400 font-medium">
              {totalElements} request{totalElements !== 1 ? "s" : ""}
            </p>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#f9fafb] border-b border-[#e5e7eb]">
                  {["Type", "ID", "Priority", "Issue", "Location", "Date & Time", "Status"].map((col) => (
                    <th key={col} className="text-left text-[11px] font-semibold text-[#636e72] uppercase tracking-wider px-4 py-3">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="text-center py-16">
                      <div className="flex flex-col items-center gap-2 text-gray-400">
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        <span className="text-sm">Loading requests…</span>
                      </div>
                    </td>
                  </tr>
                ) : requests.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-16 text-sm text-gray-400">
                      No maintenance requests found.
                    </td>
                  </tr>
                ) : (
                  requests.map((req) => (
                    <tr
                      key={req.id}
                      onClick={() => void handleRowClick(req)}
                      className={cn(
                        "border-b border-[#f3f4f6] transition-colors duration-100 cursor-pointer",
                        req.id === selectedRequest?.id
                          ? "bg-[#e0f2f1]"
                          : "hover:bg-gray-50/60"
                      )}
                    >
                      <td className="px-4 py-3.5"><TypeBadge type={req.type} /></td>
                      <td className="px-4 py-3.5">
                        <span className="inline-block bg-[#f3f4f6] text-[#2d3436] text-[11px] font-mono px-2 py-1 rounded">
                          {req.requestId}
                        </span>
                      </td>
                      <td className="px-4 py-3.5"><PriorityBadge priority={req.priority} /></td>
                      <td className="px-4 py-3.5">
                        <p className="text-sm font-semibold text-[#2d3436]">{req.issue}</p>
                      </td>
                      <td className="px-4 py-3.5">
                        <p className="text-sm text-[#636e72] whitespace-nowrap">{req.location}</p>
                      </td>
                      <td className="px-4 py-3.5">
                        <p className="text-sm text-[#636e72] whitespace-nowrap">{req.dateTime}</p>
                      </td>
                      <td className="px-4 py-3.5">
                        <StatusBadge status={req.status} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {!isLoading && requests.length > 0 && (
            <div className="px-6 py-3 border-t border-[#f3f4f6] bg-[#f9fafb]/40 flex items-center justify-between">
              <p className="text-xs text-gray-400">
                Page <span className="font-semibold text-gray-600">{page + 1}</span> of{" "}
                <span className="font-semibold text-gray-600">{totalPages}</span>
              </p>
              <div className="flex items-center gap-1">
                <button
                  disabled={page === 0}
                  onClick={() => setPage((p) => p - 1)}
                  className="px-3 py-1.5 text-xs font-medium text-gray-500 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-40"
                >
                  Previous
                </button>
                <button className="px-3 py-1.5 text-xs font-semibold text-white bg-[#00a996] border border-[#00a996] rounded-lg">
                  {page + 1}
                </button>
                <button
                  disabled={page + 1 >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-3 py-1.5 text-xs font-medium text-gray-500 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Detail Panel */}
        {selectedRequest && (
          <div className="w-[440px] flex-shrink-0 sticky top-4 max-h-[calc(100vh-7rem)] overflow-hidden">
            <MaintenanceDetailPanel
              request={selectedRequest}
              actorId={actorId}
              onClose={() => setSelectedRequest(null)}
              onUpdated={loadRequests}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default MaintenancePage;

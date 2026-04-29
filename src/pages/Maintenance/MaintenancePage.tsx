import { useState, useMemo } from "react";
import { ChevronDown, Home, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ──────────────────────────────────────────────────────────────────────
type RequestType = "Private" | "Public";
type Priority = "High" | "Medium" | "Low";
type Status = "Unassigned" | "Assigned" | "Completed" | "In Progress";

interface MaintenanceRequest {
  id: number;
  type: RequestType;
  requestId: string;
  priority: Priority;
  issue: string;
  location: string;
  dateTime: string;
  status: Status;
}

// ─── Mock Data ───────────────────────────────────────────────────────────────────
const REQUESTS: MaintenanceRequest[] = [
  {
    id: 1,
    type: "Private",
    requestId: "REQ-2024-001",
    priority: "High",
    issue: "Leaking Pipe in Kitchen",
    location: "Unit 205",
    dateTime: "Feb 10, 10:00 AM",
    status: "Unassigned",
  },
  {
    id: 2,
    type: "Public",
    requestId: "REQ-2024-002",
    priority: "High",
    issue: "Broken Main Gate Lock",
    location: "Main Gate",
    dateTime: "Feb 10, 09:45 AM",
    status: "Unassigned",
  },
  {
    id: 3,
    type: "Private",
    requestId: "REQ-2024-003",
    priority: "Medium",
    issue: "Air Conditioning Not Cooling",
    location: "Unit 310",
    dateTime: "Feb 10, 09:30 AM",
    status: "Assigned",
  },
  {
    id: 4,
    type: "Private",
    requestId: "REQ-2024-004",
    priority: "Low",
    issue: "Light Bulb Replacement",
    location: "Unit 150",
    dateTime: "Feb 9, 09:15 AM",
    status: "Completed",
  },
  {
    id: 5,
    type: "Public",
    requestId: "REQ-2024-005",
    priority: "Medium",
    issue: "Pool Filter Malfunction",
    location: "Swimming Pool",
    dateTime: "Feb 9, 08:50 AM",
    status: "Completed",
  },
  {
    id: 6,
    type: "Private",
    requestId: "REQ-2024-006",
    priority: "High",
    issue: "Electrical Outlet Sparking",
    location: "Unit 102",
    dateTime: "Feb 8, 08:30 AM",
    status: "Completed",
  },
  {
    id: 7,
    type: "Private",
    requestId: "REQ-2024-007",
    priority: "Medium",
    issue: "Bathroom Drain Clogged",
    location: "Unit 405",
    dateTime: "Feb 8, 08:00 AM",
    status: "Assigned",
  },
  {
    id: 8,
    type: "Public",
    requestId: "REQ-2024-008",
    priority: "Low",
    issue: "Garden Sprinkler Repair",
    location: "Garden Area B",
    dateTime: "Feb 8, 07:45 AM",
    status: "Unassigned",
  },
];

// ─── Badge Configs ───────────────────────────────────────────────────────────────
const PRIORITY_CONFIG: Record<
  Priority,
  { dot: string; bg: string; text: string }
> = {
  High: { dot: "bg-[#fb2c36]", bg: "bg-[#ffe2e2]", text: "text-[#c10007]" },
  Medium: { dot: "bg-[#f0b100]", bg: "bg-[#fef9c2]", text: "text-[#a65f00]" },
  Low: { dot: "bg-[#2b7fff]", bg: "bg-[#dbeafe]", text: "text-[#1447e6]" },
};

const STATUS_CONFIG: Record<
  Status,
  { dot: string; bg: string; text: string }
> = {
  Unassigned: {
    dot: "bg-[#99a1af]",
    bg: "bg-[#f3f4f6]",
    text: "text-[#636e72]",
  },
  Assigned: {
    dot: "bg-[#00a996]",
    bg: "bg-[#e0f2f1]",
    text: "text-[#00a996]",
  },
  Completed: {
    dot: "bg-[#00c950]",
    bg: "bg-[#dcfce7]",
    text: "text-[#008236]",
  },
  "In Progress": {
    dot: "bg-[#f0b100]",
    bg: "bg-[#fef9c2]",
    text: "text-[#a65f00]",
  },
};

const ROW_BG: Record<Status, string> = {
  Unassigned: "bg-white",
  Assigned: "bg-white",
  Completed: "bg-white",
  "In Progress": "bg-white",
};

// Row highlight based on first-row in Figma: Unassigned → teal tint, High priority → red tint
function getRowBg(req: MaintenanceRequest) {
  if (req.status === "Unassigned" && req.priority === "High" && req.type === "Public") {
    return "bg-[#fef2f2]";
  }
  if (req.status === "Unassigned" && req.priority === "High" && req.type === "Private") {
    return "bg-[#e0f2f1]";
  }
  return "bg-white";
}

// ─── Sub-components ──────────────────────────────────────────────────────────────
const TypeBadge = ({ type }: { type: RequestType }) => {
  const isPrivate = type === "Private";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium",
        isPrivate ? "bg-[#f3e8ff] text-[#8200db]" : "bg-[#e0f2f1] text-[#00a996]"
      )}
    >
      {isPrivate ? (
        <Home className="w-3 h-3 flex-shrink-0" />
      ) : (
        <Building2 className="w-3 h-3 flex-shrink-0" />
      )}
      {type}
    </span>
  );
};

const PriorityBadge = ({ priority }: { priority: Priority }) => {
  const cfg = PRIORITY_CONFIG[priority];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium",
        cfg.bg,
        cfg.text
      )}
    >
      <span className={cn("w-2 h-2 rounded-full flex-shrink-0", cfg.dot)} />
      {priority}
    </span>
  );
};

const StatusBadge = ({ status }: { status: Status }) => {
  const cfg = STATUS_CONFIG[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium",
        cfg.bg,
        cfg.text
      )}
    >
      <span className={cn("w-2 h-2 rounded-full flex-shrink-0", cfg.dot)} />
      {status}
    </span>
  );
};

// ─── Filter Tab ──────────────────────────────────────────────────────────────────
const STATUS_TABS = ["All", "Pending", "In Progress", "Completed"] as const;
type StatusTab = (typeof STATUS_TABS)[number];

// ─── Dropdown ────────────────────────────────────────────────────────────────────
function FilterSelect<T extends string>({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { label: string; value: T }[];
  placeholder: string;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="appearance-none pl-3 pr-8 h-[36px] bg-white border border-[#e5e7eb] rounded-xl text-xs font-medium text-[#2d3436] outline-none focus:border-[#00a996] cursor-pointer hover:bg-gray-50 transition-colors"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────────
const MaintenancePage = () => {
  const [activeTab, setActiveTab] = useState<StatusTab>("All");
  const [typeFilter, setTypeFilter] = useState<"All" | RequestType>("All");
  const [priorityFilter, setPriorityFilter] = useState<"All" | Priority>("All");
  const [statusFilter, setStatusFilter] = useState<"All" | Status>("All");

  const filtered = useMemo(() => {
    return REQUESTS.filter((r) => {
      const matchTab =
        activeTab === "All" ||
        (activeTab === "Pending" && r.status === "Unassigned") ||
        (activeTab === "In Progress" && r.status === "In Progress") ||
        (activeTab === "Completed" && r.status === "Completed");

      const matchType = typeFilter === "All" || r.type === typeFilter;
      const matchPriority = priorityFilter === "All" || r.priority === priorityFilter;
      const matchStatus = statusFilter === "All" || r.status === statusFilter;

      return matchTab && matchType && matchPriority && matchStatus;
    });
  }, [activeTab, typeFilter, priorityFilter, statusFilter]);

  return (
    <div className="space-y-5">
      {/* Page Header Card */}
      <div className="bg-white rounded-2xl shadow-[0px_4px_10px_rgba(0,0,0,0.05)] p-6">
        <h1 className="text-2xl font-semibold text-[#2d3436] mb-6">
          Maintenance Command Center
        </h1>

        {/* Status Tabs */}
        <div className="inline-flex items-center bg-[#f3f4f6] rounded-xl p-1 gap-0.5">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-4 py-2 rounded-[10px] text-sm font-medium transition-all duration-150",
                activeTab === tab
                  ? "bg-white text-[#2d3436] shadow-[0px_1px_3px_rgba(0,0,0,0.1),0px_1px_2px_rgba(0,0,0,0.1)]"
                  : "text-[#636e72] hover:text-[#2d3436]"
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl shadow-[0px_4px_20px_rgba(0,0,0,0.05)] overflow-hidden">
        {/* Filter Row */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-[#f3f4f6]">
          <FilterSelect
            value={typeFilter}
            onChange={setTypeFilter}
            placeholder="Type"
            options={[
              { label: "All Types", value: "All" },
              { label: "Private", value: "Private" },
              { label: "Public", value: "Public" },
            ]}
          />
          <FilterSelect
            value={priorityFilter}
            onChange={setPriorityFilter}
            placeholder="Priority"
            options={[
              { label: "All Priorities", value: "All" },
              { label: "High", value: "High" },
              { label: "Medium", value: "Medium" },
              { label: "Low", value: "Low" },
            ]}
          />
          <FilterSelect
            value={statusFilter}
            onChange={setStatusFilter}
            placeholder="Status"
            options={[
              { label: "All Statuses", value: "All" },
              { label: "Unassigned", value: "Unassigned" },
              { label: "Assigned", value: "Assigned" },
              { label: "In Progress", value: "In Progress" },
              { label: "Completed", value: "Completed" },
            ]}
          />
          <p className="ml-auto text-xs text-gray-400 font-medium">
            {filtered.length} request{filtered.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#f9fafb] border-b border-[#e5e7eb]">
                {["Type", "ID", "Priority", "Issue", "Location", "Date & Time", "Status"].map(
                  (col) => (
                    <th
                      key={col}
                      className="text-left text-[11px] font-semibold text-[#636e72] uppercase tracking-wider px-4 py-3"
                    >
                      {col}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center py-16 text-sm text-gray-400"
                  >
                    No maintenance requests match your filters.
                  </td>
                </tr>
              ) : (
                filtered.map((req) => (
                  <tr
                    key={req.id}
                    className={cn(
                      "border-b border-[#f3f4f6] hover:bg-gray-50/60 transition-colors duration-100",
                      getRowBg(req)
                    )}
                  >
                    {/* Type */}
                    <td className="px-4 py-3.5">
                      <TypeBadge type={req.type} />
                    </td>

                    {/* Request ID */}
                    <td className="px-4 py-3.5">
                      <span className="inline-block bg-[#f3f4f6] text-[#2d3436] text-[11px] font-mono px-2 py-1 rounded">
                        {req.requestId}
                      </span>
                    </td>

                    {/* Priority */}
                    <td className="px-4 py-3.5">
                      <PriorityBadge priority={req.priority} />
                    </td>

                    {/* Issue */}
                    <td className="px-4 py-3.5">
                      <p className="text-sm font-semibold text-[#2d3436] whitespace-nowrap">
                        {req.issue}
                      </p>
                    </td>

                    {/* Location */}
                    <td className="px-4 py-3.5">
                      <p className="text-sm text-[#636e72] whitespace-nowrap">
                        {req.location}
                      </p>
                    </td>

                    {/* Date & Time */}
                    <td className="px-4 py-3.5">
                      <p className="text-sm text-[#636e72] whitespace-nowrap">
                        {req.dateTime}
                      </p>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3.5">
                      <StatusBadge status={req.status} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        {filtered.length > 0 && (
          <div className="px-6 py-3 border-t border-[#f3f4f6] bg-[#f9fafb]/40 flex items-center justify-between">
            <p className="text-xs text-gray-400">
              Showing{" "}
              <span className="font-semibold text-gray-600">{filtered.length}</span>{" "}
              of{" "}
              <span className="font-semibold text-gray-600">{REQUESTS.length}</span>{" "}
              requests
            </p>
            <div className="flex items-center gap-1">
              <button
                className="px-3 py-1.5 text-xs font-medium text-gray-500 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-40"
                disabled
              >
                Previous
              </button>
              <button className="px-3 py-1.5 text-xs font-semibold text-white bg-[#00a996] border border-[#00a996] rounded-lg">
                1
              </button>
              <button className="px-3 py-1.5 text-xs font-medium text-gray-500 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MaintenancePage;

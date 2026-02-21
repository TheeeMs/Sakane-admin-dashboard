import { useState, useMemo } from "react";
import {
  Search,
  UserPlus,
  CheckCircle2,
  Clock,
  XCircle,
  Eye,
  Pencil,
  Trash2,
  Mail,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ─────────────────────────────────────────────────────────────────────
type ApprovalStatus = "Approved" | "Pending" | "Rejected";
type FinancialStatus = "Clear" | "Due";

interface Resident {
  id: number;
  initials: string;
  color: string;
  name: string;
  status: "Active" | "Pending" | "Inactive";
  building: string;
  apt: string;
  phone: string;
  email: string;
  approval: ApprovalStatus;
  financial: FinancialStatus;
  dueAmount?: string;
}

// ─── Mock Data ─────────────────────────────────────────────────────────────────
const RESIDENTS: Resident[] = [
  {
    id: 1,
    initials: "MA",
    color: "#00A389",
    name: "Mohamed Ahmed",
    status: "Active",
    building: "Building A",
    apt: "Apt 101",
    phone: "+20 100 123 4567",
    email: "mohamed.ahmed",
    approval: "Approved",
    financial: "Due",
    dueAmount: "1,500 EGP",
  },
  {
    id: 2,
    initials: "SE",
    color: "#3B82F6",
    name: "Sara El-Gendy",
    status: "Active",
    building: "Building B",
    apt: "Apt 205",
    phone: "+20 111 234 5678",
    email: "sara.elgendy",
    approval: "Approved",
    financial: "Clear",
  },
  {
    id: 3,
    initials: "OY",
    color: "#8B5CF6",
    name: "Omar Youssef",
    status: "Active",
    building: "Building C",
    apt: "Apt 304",
    phone: "+20 122 345 6789",
    email: "omar.youssef",
    approval: "Approved",
    financial: "Due",
    dueAmount: "3,200 EGP",
  },
  {
    id: 4,
    initials: "HM",
    color: "#F97316",
    name: "Heba Mahmoud",
    status: "Active",
    building: "Building A",
    apt: "Apt 102",
    phone: "+20 100 456 7890",
    email: "heba.mahmoud",
    approval: "Approved",
    financial: "Clear",
  },
  {
    id: 5,
    initials: "AH",
    color: "#EF4444",
    name: "Ahmed Hassan",
    status: "Active",
    building: "Building B",
    apt: "Apt 210",
    phone: "+20 111 567 8901",
    email: "ahmed.hassan",
    approval: "Approved",
    financial: "Due",
    dueAmount: "750 EGP",
  },
  {
    id: 6,
    initials: "NE",
    color: "#6366F1",
    name: "Noura El-Sayed",
    status: "Pending",
    building: "Building C",
    apt: "Apt 301",
    phone: "+20 122 678 9012",
    email: "noura.elsayed",
    approval: "Pending",
    financial: "Clear",
  },
  {
    id: 7,
    initials: "KI",
    color: "#10B981",
    name: "Khaled Ibrahim",
    status: "Active",
    building: "Building A",
    apt: "Apt 105",
    phone: "+20 100 789 0123",
    email: "khaled.ibrahim",
    approval: "Approved",
    financial: "Clear",
  },
  {
    id: 8,
    initials: "LM",
    color: "#FBBF24",
    name: "Layla Mohammed",
    status: "Active",
    building: "Building B",
    apt: "Apt 208",
    phone: "+20 111 890 1234",
    email: "layla.mohammed",
    approval: "Pending",
    financial: "Due",
    dueAmount: "2,100 EGP",
  },
  {
    id: 9,
    initials: "YA",
    color: "#14B8A6",
    name: "Youssef Ali",
    status: "Active",
    building: "Building C",
    apt: "Apt 302",
    phone: "+20 122 901 2345",
    email: "youssef.ali",
    approval: "Approved",
    financial: "Clear",
  },
  {
    id: 10,
    initials: "MA",
    color: "#EC4899",
    name: "Mona Abdullah",
    status: "Active",
    building: "Building A",
    apt: "Apt 103",
    phone: "+20 100 012 3456",
    email: "mona.abdullah",
    approval: "Rejected",
    financial: "Clear",
  },
];

// ─── Sub-components ────────────────────────────────────────────────────────────
const ApprovalBadge = ({ status }: { status: ApprovalStatus }) => {
  const config = {
    Approved: {
      icon: CheckCircle2,
      cls: "bg-emerald-50 text-emerald-600 border-emerald-100",
    },
    Pending: {
      icon: Clock,
      cls: "bg-amber-50  text-amber-600  border-amber-100",
    },
    Rejected: {
      icon: XCircle,
      cls: "bg-red-50    text-red-600    border-red-100",
    },
  }[status];
  const Icon = config.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border",
        config.cls,
      )}
    >
      <Icon className="w-3 h-3" />
      {status}
    </span>
  );
};

const FinancialBadge = ({
  status,
  amount,
}: {
  status: FinancialStatus;
  amount?: string;
}) => {
  if (status === "Clear") {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600">
        <span className="w-2 h-2 rounded-full bg-emerald-500" />
        Clear
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-600 border border-red-100">
      <span className="w-2 h-2 rounded-full bg-red-500" />
      Due: {amount}
    </span>
  );
};

const Avatar = ({
  initials,
  color,
  size = "md",
}: {
  initials: string;
  color: string;
  size?: "sm" | "md";
}) => (
  <div
    className={cn(
      "rounded-full flex items-center justify-center text-white font-bold flex-shrink-0",
      size === "md" ? "w-10 h-10 text-sm" : "w-8 h-8 text-xs",
    )}
    style={{ backgroundColor: color }}
  >
    {initials}
  </div>
);

// ─── Filter Tabs ───────────────────────────────────────────────────────────────
const FILTER_TABS = ["All Residents", "Active", "Pending", "Inactive"] as const;
type FilterTab = (typeof FILTER_TABS)[number];

// ─── Main Page ─────────────────────────────────────────────────────────────────
const ResidentsPage = () => {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<FilterTab>("All Residents");
  const [approvalFilter, setApprovalFilter] = useState<"All" | ApprovalStatus>(
    "All",
  );

  const filtered = useMemo(() => {
    return RESIDENTS.filter((r) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        r.name.toLowerCase().includes(q) ||
        r.apt.toLowerCase().includes(q) ||
        r.phone.includes(q) ||
        r.email.toLowerCase().includes(q);

      const matchTab = activeTab === "All Residents" || r.status === activeTab;

      const matchApproval =
        approvalFilter === "All" || r.approval === approvalFilter;

      return matchSearch && matchTab && matchApproval;
    });
  }, [search, activeTab, approvalFilter]);

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Resident Directory
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Manage all residents and their information
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-[#00A389] hover:bg-[#008A74] text-white text-sm font-semibold rounded-xl shadow-sm hover:shadow-md transition-all duration-150 active:scale-[0.98]">
          <UserPlus className="w-4 h-4" />
          Add Resident
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        <input
          type="text"
          placeholder="Search by Name, Unit, or Phone Number..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-400 outline-none focus:border-[#00A389] focus:ring-2 focus:ring-[#00A389]/10 transition-all shadow-sm"
        />
      </div>

      {/* Filters Row */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Status Tabs */}
        <div className="flex items-center bg-white border border-gray-200 rounded-xl p-1 gap-0.5 shadow-sm">
          {FILTER_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150",
                activeTab === tab
                  ? "bg-[#00A389] text-white shadow-sm"
                  : "text-gray-500 hover:text-gray-800 hover:bg-gray-50",
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Approval Filter */}
        <div className="relative">
          <select
            value={approvalFilter}
            onChange={(e) =>
              setApprovalFilter(e.target.value as typeof approvalFilter)
            }
            className="appearance-none pl-3.5 pr-8 py-2 bg-white border border-gray-200 rounded-xl text-xs font-semibold text-gray-600 outline-none focus:border-[#00A389] cursor-pointer shadow-sm hover:bg-gray-50 transition-colors"
          >
            <option value="All">All Statuses</option>
            <option value="Approved">Approved</option>
            <option value="Pending">Pending</option>
            <option value="Rejected">Rejected</option>
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
        </div>

        <p className="ml-auto text-xs text-gray-400 font-medium">
          {filtered.length} resident{filtered.length !== 1 ? "s" : ""} found
        </p>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-5 py-3.5">
                  Resident
                </th>
                <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-4 py-3.5">
                  Unit Info
                </th>
                <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-4 py-3.5">
                  Contact
                </th>
                <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-4 py-3.5 leading-tight">
                  Approval
                  <br />
                  Status
                </th>
                <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-4 py-3.5">
                  Financial Status
                </th>
                <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-4 py-3.5">
                  Quick Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-16 text-sm text-gray-400"
                  >
                    No residents match your search.
                  </td>
                </tr>
              ) : (
                filtered.map((r) => (
                  <tr
                    key={r.id}
                    className="hover:bg-gray-50/60 transition-colors duration-100 group"
                  >
                    {/* Resident */}
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <Avatar initials={r.initials} color={r.color} />
                        <div>
                          <p className="text-sm font-semibold text-gray-800 leading-tight">
                            {r.name}
                          </p>
                          <span
                            className={cn(
                              "text-[10px] font-medium",
                              r.status === "Active" && "text-emerald-500",
                              r.status === "Pending" && "text-amber-500",
                              r.status === "Inactive" && "text-gray-400",
                            )}
                          >
                            {r.status}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Unit Info */}
                    <td className="px-4 py-3.5">
                      <p className="text-sm text-gray-700 font-medium leading-tight">
                        {r.building}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">{r.apt}</p>
                    </td>

                    {/* Contact */}
                    <td className="px-4 py-3.5">
                      <p className="text-sm text-gray-700">{r.phone}</p>
                      <p className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                        <Mail className="w-3 h-3 flex-shrink-0" />
                        {r.email}
                      </p>
                    </td>

                    {/* Approval */}
                    <td className="px-4 py-3.5">
                      <ApprovalBadge status={r.approval} />
                    </td>

                    {/* Financial */}
                    <td className="px-4 py-3.5">
                      <FinancialBadge
                        status={r.financial}
                        amount={r.dueAmount}
                      />
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1">
                        <button
                          title="View"
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-[#00A389] hover:bg-emerald-50 transition-all duration-150"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          title="Edit"
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-all duration-150"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          title="Delete"
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all duration-150"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        {filtered.length > 0 && (
          <div className="px-5 py-3 border-t border-gray-100 bg-gray-50/40 flex items-center justify-between">
            <p className="text-xs text-gray-400">
              Showing{" "}
              <span className="font-semibold text-gray-600">
                {filtered.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-600">
                {RESIDENTS.length}
              </span>{" "}
              residents
            </p>
            <div className="flex items-center gap-1">
              <button
                className="px-3 py-1.5 text-xs font-medium text-gray-500 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-40"
                disabled
              >
                Previous
              </button>
              <button className="px-3 py-1.5 text-xs font-semibold text-white bg-[#00A389] border border-[#00A389] rounded-lg">
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

export default ResidentsPage;
